/* eslint-disable max-lines-per-function */
import { Payload as BulkCreateSalesOrderPayload } from '@models/db/types/BulkCreateSalesOrder';
import { CustomerModel } from '@/models/custumer';
import { CustomerRepository } from '@/repositories/customer/protocols';
import { LoggedUserModel } from '@/models/logged-user';
import { ProductModel } from '@/models/product';
import { ProductRepository } from '../../repositories/product/protocol';
import { SalesOrderHeaderRepository } from '@/repositories/sales-order-header/protocol';
import { SalesOrderHeadersModel } from '../../models/sales-order-header';
import { SalesOrderItemsModel } from '../../models/sales-order-item';
import { SalesOrderLogModel } from '@/models/sales-order-log';
import { SalesOrderLogRepository } from '@/repositories/sales-order-log/protocol';
import { User } from '@sap/cds';
import { CreationPayloadValidationResult, SalesOrderHeaderService } from './protocol';
import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly salesOrderHeaderRepository: SalesOrderHeaderRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly productRepository: ProductRepository,
        private readonly salesOrderLogRepository: SalesOrderLogRepository
    ) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        const productsValidationResult = await this.validadeProductsOnCreation(params);
        if (!productsValidationResult.hasError) {
            return productsValidationResult;
        }

        const items = this.getSalesOrderItems(params, productsValidationResult.products as ProductModel[]);

        const header = this.getSalesOrderHeader(params, items);

        const customerValidationResult = await this.validateCustomerOnCreation(params);

        if (!customerValidationResult.hasError) {
            return customerValidationResult;
        }
        const headerValidationResult = header.validadeCreationPlayload({
            customer_id: (customerValidationResult.customer as CustomerModel).id
        });

        if (headerValidationResult.hasError) {
            return {
                hasError: true,
                error: new Error(headerValidationResult.error?.message as string)
            };
        }

        return {
            hasError: false,
            totalAmount: header.calculatediscount()
        };
    }

    public async afterCreate(
        params: SalesOrderHeaders | BulkCreateSalesOrderPayload[],
        loggedUser: User
    ): Promise<void> {
        const headerAsArray = Array.isArray(params) ? params : ([params] as SalesOrderHeaders);
        const logs: SalesOrderLogModel[] = [];

        for (const header of headerAsArray) {
            const products = (await this.getProductsById(header)) as ProductModel[];

            const items = this.getSalesOrderItems(header, products);

            const salesOrderHeader = this.getExistingSalesOrderHeader(header, items);

            const productsData = salesOrderHeader.getProductsData();
            for (const product of products) {
                const foundProduct = productsData.find((productData) => productData.id === product.id);
                product.sell(foundProduct?.quantity as number);

                await this.productRepository.updateStock(product);
            }

            const user = this.getloggedUser(loggedUser);

            const log = this.getorderLog(salesOrderHeader, user);
            logs.push(log);
        }
        await this.salesOrderLogRepository.create(logs);
    }

    public async bulkCreate(
        headers: BulkCreateSalesOrderPayload[],
        loggedUser: User
    ): Promise<CreationPayloadValidationResult> {
        const bulkCreateHeaders: SalesOrderHeadersModel[] = [];
        for (const headerObject of headers) {
            const productValidation = await this.validadeProductsOnCreation(headerObject);

            if (productValidation.hasError) {
                return productValidation;
            }

            const items = this.getSalesOrderItems(headerObject, productValidation.products as ProductModel[]);
            const header = this.getSalesOrderHeader(headerObject, items);
            const customerValidationResult = await this.validateCustomerOnCreation(header);

            if (customerValidationResult.hasError) {
                return customerValidationResult;
            }
            const headerValidationResult = header.validadeCreationPlayload({
                customer_id: (customerValidationResult.customer as CustomerModel).id
            });

            if (headerValidationResult.hasError) {
                return {
                    hasError: true,
                    error: new Error(headerValidationResult.error?.message as string)
                };
            }

            bulkCreateHeaders.push(header);
        }
        await this.salesOrderHeaderRepository.bulkCreate(bulkCreateHeaders);
        await this.afterCreate(headers, loggedUser);
        return this.serializeBulkCreateResult(bulkCreateHeaders);
    }

    public async cloneSalesOrder(id: string, loggedUser: User): Promise<CreationPayloadValidationResult> {
        const header = await this.salesOrderHeaderRepository.findCompleteSalesOrderById(id);

        if (!header) {
            return {
                hasError: true,
                error: new Error('Pedido não encontrado.')
            };
        }

        const headerValidationResult = header.validadeCreationPlayload({
            customer_id: header.customer_id
        });

        if (headerValidationResult.hasError) {
            return {
                hasError: true,
                error: new Error(headerValidationResult.error?.message as string)
            };
        }

        await this.salesOrderHeaderRepository.bulkCreate([header]);
        await this.afterCreate([header.toCreationObject()], loggedUser);

        return this.serializeBulkCreateResult([header]);
    }
    private serializeBulkCreateResult(headers: SalesOrderHeadersModel[]): CreationPayloadValidationResult {
        return {
            hasError: false,
            headers: headers.map((header) => header.toCreationObject())
        };
    }

    private async validadeProductsOnCreation(
        header: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<CreationPayloadValidationResult> {
        const products = await this.getProductsById(header);
        if (!products) {
            return {
                hasError: true,
                error: new Error('Nenhum produto da lista de items foi encontrado.')
            };
        }
        return {
            hasError: false,
            products
        };
    }

    private async validateCustomerOnCreation(
        header: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<CreationPayloadValidationResult> {
        const customer = await this.getCustomerById(header);
        if (!customer) {
            return {
                hasError: true,
                error: new Error('Customer não encontrado')
            };
        }

        return {
            hasError: false,
            customer
        };
    }
    private async getProductsById(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<ProductModel[] | null> {
        const productsIds: string[] = params.items?.map((item) => item.product_id) as string[];
        return this.productRepository.findByIds(productsIds);
    }

    private getSalesOrderItems(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        products: ProductModel[]
    ): SalesOrderItemsModel[] {
        return params.items?.map((item) =>
            SalesOrderItemsModel.create({
                price: item.price as number,
                productId: item.product_id as string,
                quantity: item.quantity as number,
                products
            })
        ) as SalesOrderItemsModel[];
    }

    private getSalesOrderHeader(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        items: SalesOrderItemsModel[]
    ): SalesOrderHeadersModel {
        return SalesOrderHeadersModel.create({
            customerId: params.customer_id as string,
            items
        });
    }

    private getExistingSalesOrderHeader(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        items: SalesOrderItemsModel[]
    ): SalesOrderHeadersModel {
        return SalesOrderHeadersModel.with({
            id: params.id as string,
            customerId: params.customer_id as string,
            totalAmount: params.totalAmount as number,
            items
        });
    }

    private getCustomerById(params: SalesOrderHeader | BulkCreateSalesOrderPayload): Promise<CustomerModel | null> {
        const customerId = params.customer_id as string;
        return this.customerRepository.findById(customerId);
    }

    private getloggedUser(loggedUser: User): LoggedUserModel {
        return LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attributes: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown as string[]
            }
        });
    }

    private getorderLog(salesOrderHeader: SalesOrderHeadersModel, user: LoggedUserModel): SalesOrderLogModel {
        return SalesOrderLogModel.create({
            headerId: salesOrderHeader.id,
            orderData: salesOrderHeader.toStringfiedObject(),
            userData: user.toStringfiedObject()
        });
    }
}

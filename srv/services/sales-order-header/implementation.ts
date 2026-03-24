/* eslint-disable max-lines-per-function */
import { CustomerModel } from 'srv/models/custumer';
import { CustomerRepository } from 'srv/repositories/customer/protocols';
import { LoggedUserModel } from 'srv/models/logged-user';
import { ProductModel } from 'srv/models/product';
import { ProductRepository } from '../../repositories/product/protocol';
import { SalesOrderHeadersModel } from '../../models/sales-order-header';
import { SalesOrderItemsModel } from '../../models/sales-order-item';
import { SalesOrderLogModel } from 'srv/models/sales-order-log';
import { SalesOrderLogRepository } from 'srv/repositories/sales-order-log/protocol';
import { User } from '@sap/cds';
import { CreationPayloadValidationResult, SalesOrderHeaderService } from './protocol';
import { SalesOrderHeader, SalesOrderHeaders, SalesOrderItem } from '@models/sales';


export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService{
    constructor(
        private readonly customerRepository: CustomerRepository,
        private readonly productRepository: ProductRepository,
        private readonly salesOrderLogRepository: SalesOrderLogRepository
    ){}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        const products = await this.getProductsById(params);
        if(!products){
            return {
                hasError: true,
                error: new Error('Nenhum produto da lista de items foi encontrado.') 
            };
        };

        const items = this.getSalesOrderItems(params,products);

        const header = this.getSalesOrderHeader(params,items);


        const customer = await this.getCustomerById(params);

        const headerValidationResult = header.validadeCreationPlayload({ customer_id: customer?.id as string });

        if(!customer) {
            return {
                hasError: true,
                error: new Error('Customer não encontrado') 
            };
        }

        if(headerValidationResult.hasError){
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

    public async afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void> {
        const headerAsArray = Array.isArray(params) ? params : [params] as SalesOrderHeaders;
        const logs: SalesOrderLogModel[] = [];
       
        for(const header of headerAsArray){
            const products = await this.getProductsById(header) as ProductModel[];

            const items = this.getSalesOrderItems(header,products);

            const salesOrderHeader = this.getExistingSalesOrderHeader(header,items);

            const productsData = salesOrderHeader.getProductsData();
            for(const product of products){
                const foundProduct = productsData.find(productData => productData.id === product.id);
                product.sell(foundProduct?.quantity as number);

                await this.productRepository.updateStock(product);
            }

            const user = this.getloggedUser(loggedUser);
            
            const log = this.getorderLog(salesOrderHeader,user);
            logs.push(log);
       
        }
        await this.salesOrderLogRepository.create(logs);
    }

    private async getProductsById(params: SalesOrderHeader): Promise<ProductModel[] | null>{
        const productsIds: string[] = params.items?.map((item: SalesOrderItem) => item.product_id) as string [];
        return this.productRepository.findByIds(productsIds);
    }
     
    
    private getSalesOrderItems(params: SalesOrderHeader, products: ProductModel[]): SalesOrderItemsModel[]{
        return params.items?.map(item=> SalesOrderItemsModel.create({
            price: item.price as number,
            productId: item.product_id as string,
            quantity:  item.quantity as number,
            products
        })) as SalesOrderItemsModel[];
    }

    private getSalesOrderHeader(params: SalesOrderHeader,items: SalesOrderItemsModel[]): SalesOrderHeadersModel{
        return  SalesOrderHeadersModel.create({
            customerId: params.customer_id as string,
            items
        });
    }

    private getExistingSalesOrderHeader(params: SalesOrderHeader,items: SalesOrderItemsModel[]): SalesOrderHeadersModel{
        return SalesOrderHeadersModel.with({
            id: params.id as string,
            customerId: params.customer_id as string,
            totalAmount: params.totalAmount as number,
            items
        });
    }


    private getCustomerById(params: SalesOrderHeader): Promise<CustomerModel | null>{
        const customerId = params.customer_id as string;

        return this.customerRepository.findById(customerId);
    }

    private getloggedUser(loggedUser: User): LoggedUserModel{
        return LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attributes: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown  as string[]
            }
        });
    }


    private getorderLog(salesOrderHeader: SalesOrderHeadersModel, user: LoggedUserModel): SalesOrderLogModel{
        return SalesOrderLogModel.create({
            headerId: salesOrderHeader.id,
            orderData: salesOrderHeader.toStringfiedObject(),
            userData: user.toStringfiedObject()
        });
    }
    
}

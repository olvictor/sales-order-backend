import { SalesOrderHeader, SalesOrderItem } from "@models/sales";
import { SalesOrderHeaderService, CreationPayloadValidationResult } from "./protocol";
import { SalesOrderHeadersModel } from "../../models/sales-order-header"
import { SalesOrderItemsModel } from "../../models/sales-order-item"
import { ProductRepository } from "../../repositories/product/protocol"
import { CustomerRepository } from "srv/repositories/customer/protocols";
import { ProductModel } from "srv/models/product";
import { CustomerModel } from "srv/models/custumer";


export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService{
    constructor(
        private readonly customerRepository: CustomerRepository,
        private readonly productRepository: ProductRepository
    ){}





    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        const products = await this.getProductsById(params)

        if(!products){
            return {
                hasError: true,
                error: new Error('Nenhum produto da lista de items foi encontrado.') 
            }
        }

        const items = this.getSalesOrderItems(params,products)

        const header = this.getSalesOrderHeader(params,items)


        const customer = await this.getCustomerById(params);

        const headerValidationResult = header.validadeCreationPlayload({customer_id: customer?.id as string});

        if(!customer) {
             return {
                hasError: true,
                error: new Error('Customer não encontrado') 
            }
        }

        if(headerValidationResult.hasError){
             return {
                hasError: true,
                error: new Error(headerValidationResult.error?.message as string) 
            }
        }


        return {
            hasError: false,
            totalAmount: header.calculatediscount()
        }
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
        })
    }


    private getCustomerById(params: SalesOrderHeader): Promise<CustomerModel | null>{
        const customerId = params.customer_id as string;

        return this.customerRepository.findById(customerId);
    }
    
}
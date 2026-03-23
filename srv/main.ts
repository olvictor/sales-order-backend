import cds, { db, Request, Service } from "@sap/cds";
import { Customers, Product, Products, SalesOrderItem, SalesOrderItems } from "@models/sales"
import { SalesOrderHeaders } from "@models/sales"
import { customerController } from "./factories/controllers/customer";
import { salesOrderHeaderController } from "./factories/controllers/sales-order-header";


export default (service : Service) => {
   service.before('READ','*', (request: Request) =>{
        if(!request.user.is('read_only_user')) return request.reject(403,'Não autorizado.')
   })
   service.before(['WRITE','DELETE'],'*', (request: Request) =>{
        if(!request.user.is('admin')) return request.reject(403,'Não autorizada a escrita/deleção.')
   });

    service.after('READ',"Customers",(customersList: Customers, request) => {

        request.results =  customerController.afterRead(customersList)
        // results.forEach(Customer => {
            //     if(!Customer.email?.includes('@')){
            //         Customer.email = `${Customer.email}@gmail.com`
            //     }
            // })
    });


   service.before('CREATE',"SalesOrderHeaders", async (request: Request) => {
        const {customer_id} = request.data
        const result = await salesOrderHeaderController.beforeCreate(request.data)

        if(result.hasError){
            return request.reject(400,result.error?.message as string)
        }
        // const items: SalesOrderItems = request.data.params;

        // if(!customer_id) return request.reject(400,'Customer inválido.')
        // if(!items || request.data.params.items?.lenght == 0) return request.reject(400,"Items inválidos.");


        // const customerQuery = SELECT.one.from("sales.Customers").where({id:customer_id})

        // const customer = await cds.run(customerQuery);

        // if(!customer) return request.reject(404,"Customer não encontrado.")

        // const productsId = items.map((item: SalesOrderItem) => item.product_id)
        // const productsIdQuery = SELECT.from("sales.Produtcs").where( {id: productsId})

        // const products:Products = await cds.run(productsIdQuery);

        // for(const item of items){
        //     const dbProduct = products.find(product => product.id === item.product_id);

        //     if(!dbProduct) return request.reject(404,`Produto ${item.product_id} não encontrado.`);

        //     if(dbProduct.stock === 0) return request.reject(400,`O ${dbProduct.name}(${dbProduct.id} - está sem estoque.)`)
        // }

        // let totalAmout = 0;

        // items.filter(item =>{
        //     totalAmout += (item.price as number)  * (item.quantity as number)
        // })
        
        // request.data.totalAmout = totalAmout;


        // let desconto = totalAmout * (10/100);
        // if(totalAmout > 30000){
        //     let desconto = totalAmout * (10/100);
        //     totalAmout = totalAmout - desconto;
        // }

          request.data.totalAmount = result.totalAmount;
     });   
    service.after('CREATE','SalesOrderHeaders', async (results: SalesOrderHeaders, request: Request)=>{
            const headerAsArray = Array.isArray(results) ? results : [results] as SalesOrderHeaders

              for(const header of headerAsArray){

                const items = header.items as SalesOrderItems;

                const productsData = items.map(item => ({
                    id: item.product_id as String,
                    quantity: item.quantity as number
                }))

                const productsIds: String[] = productsData.map((productData) => productData.id)
                const productsIdQuery = SELECT.from('sales.Products').where( {id: productsIds})

                const products:Products = await cds.run(productsIdQuery);

                for(const productData of productsData){
                    const foundProduct = products.find(product => product.id === product.id) as Product;
                    
                    foundProduct.stock = (foundProduct.stock as number ) - productData.quantity

                    await cds.update("sales.Products").where({id: foundProduct.id}).with({stock: foundProduct.stock})
                }

                const headerAsString =JSON.stringify(header)
                const userAsString = JSON.stringify(request.user);
                
                const log = [{
                    header_id: header.id,
                    userData: userAsString,
                    orderData: headerAsString
                }]
                await cds.create('sales.SalesOrderLogs').entries(log)
            }

    })
    
}



import cds, { db, Request, Service } from "@sap/cds";
import { Customers, Product, Products, SalesOrderItem, SalesOrderItems } from "@models/sales"
import { SalesOrderHeaders } from "@models/sales"

export default (service : Service) => {
  service.after('READ',"Customers",(results: Customers) => {
        results.forEach(Customer => {
            if(!Customer.email?.includes('@')){
                Customer.email = `${Customer.email}@gmail.com`
            }
        })
  });


   service.before('CREATE',"SalesOrderHeaders", async (request: Request) => {
        const {customer_id} = request.data

        const items: SalesOrderItems = request.data.params;

        if(!customer_id) return request.reject(400,'Customer inválido.')
        if(!items || request.data.params.items?.lenght == 0) return request.reject(400,"Items inválidos.");


        const customerQuery = SELECT.one.from("sales.Customers").where({id:customer_id})

        const customer = await cds.run(customerQuery);

        if(!customer) return request.reject(404,"Customer não encontrado.")

        const productsId = items.map((item: SalesOrderItem) => item.product_id)
        const productsIdQuery = SELECT.from("sales.Produtcs").where( {id: productsId})

        const products:Products = await cds.run(productsIdQuery);

        for(const item of items){
            const dbProduct = products.find(product => product.id === item.product_id);

            if(!dbProduct) return request.reject(404,`Produto ${item.product_id} não encontrado.`);

            if(dbProduct.stock === 0) return request.reject(400,`O ${dbProduct.name}(${dbProduct.id} - está sem estoque.)`)
        }


        service.after('CREATE',SalesOrderHeaders, async (results: SalesOrderHeaders)=>{
            const headerAsArray = Array.isArray(results) ? results : [results] as SalesOrderHeaders

            for(const header of headerAsArray){
                const items = header.items as SalesOrderItems;

                const productsData = items.map(item => ({
                    id: item.product_id as string,
                    quantity: item.quantity as number
                }))

                const productsIds: string[] = productsData.map((productsData) => productsData.id)
                const productsIdQuery = SELECT.from("sales.Produtcs").where( {id: productsId})

                const products:Products = await cds.run(productsIdQuery);

                for(const productData of productsData){
                    const foundProduct = products.find(product => product.id === product.id) as Product;
                    
                    foundProduct.stock = (foundProduct.stock as number ) - productData.quantity

                    await cds.update("sales.Products").where({id: foundProduct.id}).with({stock: foundProduct.stock})
                }

            }
        })
    });
}



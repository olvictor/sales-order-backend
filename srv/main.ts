/* eslint-disable max-lines-per-function */
import { SalesOrderHeaders } from '@models/sales';
import { customerController } from './factories/controllers/customer';
import { salesOrderHeaderController } from './factories/controllers/sales-order-header';
import { Customers, Product, Products, SalesOrderItems } from '@models/sales';
import cds, { Request, Service } from '@sap/cds';

export default (service: Service) => {
    service.before('READ', '*', (request: Request) => {
        if (!request.user.is('read_only_user')) return request.reject(403, 'Não autorizado.');
    });
    service.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is('admin')) return request.reject(403, 'Não autorizada a escrita/deleção.');
    });

    service.after('READ', 'Customers', (customersList: Customers, request) => {
        request.results = customerController.afterRead(customersList);
    });

    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const result = await salesOrderHeaderController.beforeCreate(request.data);

        if (result.hasError) {
            return request.reject(400, result.error?.message as string);
        }

        request.data.totalAmount = result.totalAmount;
    });
    service.after('CREATE', 'SalesOrderHeaders', async (results: SalesOrderHeaders, request: Request) => {
        const headerAsArray = Array.isArray(results) ? results : ([results] as SalesOrderHeaders);

        for (const header of headerAsArray) {
            const items = header.items as SalesOrderItems;

            const productsData = items.map((item) => ({
                id: item.product_id as string,
                quantity: item.quantity as number
            }));

            const productsIds: string[] = productsData.map((productData) => productData.id);
            const productsIdQuery = SELECT.from('sales.Products').where({ id: productsIds });

            const products: Products = await cds.run(productsIdQuery);

            for (const productData of productsData) {
                const foundProduct = products.find((product) => product.id === product.id) as Product;

                foundProduct.stock = (foundProduct.stock as number) - productData.quantity;

                await cds.update('sales.Products').where({ id: foundProduct.id }).with({ stock: foundProduct.stock });
            }

            const headerAsString = JSON.stringify(header);
            const userAsString = JSON.stringify(request.user);

            const log = [
                {
                    header_id: header.id,
                    userData: userAsString,
                    orderData: headerAsString
                }
            ];
            await cds.create('sales.SalesOrderLogs').entries(log);
        }
    });
};

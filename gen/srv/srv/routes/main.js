"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../configs/module-alias");
const customer_1 = require("@/factories/controllers/customer");
const sales_order_header_1 = require("@/factories/controllers/sales-order-header");
const sales_report_1 = require("@/factories/controllers/sales-report");
const cds_1 = __importDefault(require("@sap/cds"));
// import { SalesReportRepositoryImpl } from '../repositories/sales-report/implementation';
exports.default = (service) => {
    service.before('READ', '*', (request) => {
        if (!request.user.is('read_only_user'))
            return request.reject(403, 'Não autorizado.');
    });
    service.before(['WRITE', 'DELETE'], '*', (request) => {
        if (!request.user.is('admin'))
            return request.reject(403, 'Não autorizada a escrita/deleção.');
    });
    service.after('READ', 'Customers', (customersList, request) => {
        request.results = customer_1.customerController.afterRead(customersList);
    });
    service.before('CREATE', 'SalesOrderHeaders', async (request) => {
        const result = await sales_order_header_1.salesOrderHeaderController.beforeCreate(request.data);
        if (result.hasError) {
            return request.reject(400, result.error?.message);
        }
        request.data.totalAmount = result.totalAmount;
    });
    service.after('CREATE', 'SalesOrderHeaders', async (results, request) => {
        const headerAsArray = Array.isArray(results) ? results : [results];
        for (const header of headerAsArray) {
            const items = header.items;
            const productsData = items.map((item) => ({
                id: item.product_id,
                quantity: item.quantity
            }));
            const productsIds = productsData.map((productData) => productData.id);
            const productsIdQuery = SELECT.from('sales.Products').where({ id: productsIds });
            const products = await cds_1.default.run(productsIdQuery);
            for (const productData of productsData) {
                const foundProduct = products.find((product) => product.id === product.id);
                foundProduct.stock = foundProduct.stock - productData.quantity;
                await cds_1.default.update('sales.Products').where({ id: foundProduct.id }).with({ stock: foundProduct.stock });
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
            await cds_1.default.create('sales.SalesOrderLogs').entries(log);
        }
    });
    service.on('getSalesReportByDays', async (request) => {
        const days = request.data?.days || 7;
        return sales_report_1.salesReportController.findByDays(days);
    });
    service.on('getSalesReportByCustomerId', async (request) => {
        const [{ id: customer }] = request.params;
        return sales_report_1.salesReportController.findByCustomerId(customer);
    });
};

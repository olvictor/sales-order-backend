"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cds_1 = __importDefault(require("@sap/cds"));
exports.default = (service) => {
    service.after('READ', "Customers", (results) => {
        results.forEach(Customer => {
            if (!Customer.email?.includes('@')) {
                Customer.email = `${Customer.email}@gmail.com`;
            }
        });
    });
    service.before('CREATE', "SalesOrderHeaders", async (request) => {
        const { customer_id } = request.data;
        const items = request.data.params;
        if (!customer_id)
            return request.reject(400, 'Customer inválido.');
        if (!items || request.data.params.items?.lenght == 0)
            return request.reject(400, "Items inválidos.");
        const customerQuery = SELECT.one.from("sales.Customers").where({ id: customer_id });
        const customer = await cds_1.default.run(customerQuery);
        if (!customer)
            return request.reject(404, "Customer não encontrado.");
        const productsId = items.map((item) => item.product_id);
        const productsIdQuery = SELECT.from("sales.Produtcs").where({ id: productsId });
        const products = await cds_1.default.run(productsIdQuery);
        for (const item of items) {
            const dbProduct = products.find(product => product.id === item.product_id);
            if (!dbProduct)
                return request.reject(404, `Produto ${item.product_id} não encontrado.`);
        }
    });
};

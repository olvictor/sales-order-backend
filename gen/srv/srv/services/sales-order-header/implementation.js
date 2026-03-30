"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderHeaderServiceImpl = void 0;
const logged_user_1 = require("@/models/logged-user");
const sales_order_header_1 = require("../../models/sales-order-header");
const sales_order_item_1 = require("../../models/sales-order-item");
const sales_order_log_1 = require("@/models/sales-order-log");
class SalesOrderHeaderServiceImpl {
    salesOrderHeaderRepository;
    customerRepository;
    productRepository;
    salesOrderLogRepository;
    constructor(salesOrderHeaderRepository, customerRepository, productRepository, salesOrderLogRepository) {
        this.salesOrderHeaderRepository = salesOrderHeaderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.salesOrderLogRepository = salesOrderLogRepository;
    }
    async beforeCreate(params) {
        const products = await this.getProductsById(params);
        if (!products) {
            return {
                hasError: true,
                error: new Error('Nenhum produto da lista de items foi encontrado.')
            };
        }
        const items = this.getSalesOrderItems(params, products);
        const header = this.getSalesOrderHeader(params, items);
        const customer = await this.getCustomerById(params);
        const headerValidationResult = header.validadeCreationPlayload({ customer_id: customer?.id });
        if (!customer) {
            return {
                hasError: true,
                error: new Error('Customer não encontrado')
            };
        }
        if (headerValidationResult.hasError) {
            return {
                hasError: true,
                error: new Error(headerValidationResult.error?.message)
            };
        }
        return {
            hasError: false,
            totalAmount: header.calculatediscount()
        };
    }
    async afterCreate(params, loggedUser) {
        const headerAsArray = Array.isArray(params) ? params : [params];
        const logs = [];
        for (const header of headerAsArray) {
            const products = (await this.getProductsById(header));
            const items = this.getSalesOrderItems(header, products);
            const salesOrderHeader = this.getExistingSalesOrderHeader(header, items);
            const productsData = salesOrderHeader.getProductsData();
            for (const product of products) {
                const foundProduct = productsData.find((productData) => productData.id === product.id);
                product.sell(foundProduct?.quantity);
                await this.productRepository.updateStock(product);
            }
            const user = this.getloggedUser(loggedUser);
            const log = this.getorderLog(salesOrderHeader, user);
            logs.push(log);
        }
        await this.salesOrderLogRepository.create(logs);
    }
    async bulkCreate(headers, loggedUser) {
        const bulkCreateHeaders = [];
        for (const headerObject of headers) {
            const products = await this.getProductsById(headerObject);
            if (!products) {
                return {
                    hasError: true,
                    error: new Error('Nenhum produto da lista de items foi encontrado.')
                };
            }
            const items = this.getSalesOrderItems(headerObject, products);
            const header = this.getSalesOrderHeader(headerObject, items);
            const customer = await this.getCustomerById(headerObject);
            const headerValidationResult = header.validadeCreationPlayload({ customer_id: customer?.id });
            if (!customer) {
                return {
                    hasError: true,
                    error: new Error('Customer não encontrado')
                };
            }
            if (headerValidationResult.hasError) {
                return {
                    hasError: true,
                    error: new Error(headerValidationResult.error?.message)
                };
            }
            bulkCreateHeaders.push(header);
        }
        await this.salesOrderHeaderRepository.bulkCreate(bulkCreateHeaders);
        await this.afterCreate();
        return {
            hasError: false
        };
    }
    async getProductsById(params) {
        const productsIds = params.items?.map((item) => item.product_id);
        return this.productRepository.findByIds(productsIds);
    }
    getSalesOrderItems(params, products) {
        return params.items?.map((item) => sales_order_item_1.SalesOrderItemsModel.create({
            price: item.price,
            productId: item.product_id,
            quantity: item.quantity,
            products
        }));
    }
    getSalesOrderHeader(params, items) {
        return sales_order_header_1.SalesOrderHeadersModel.create({
            customerId: params.customer_id,
            items
        });
    }
    getExistingSalesOrderHeader(params, items) {
        return sales_order_header_1.SalesOrderHeadersModel.with({
            id: params.id,
            customerId: params.customer_id,
            totalAmount: params.totalAmount,
            items
        });
    }
    getCustomerById(params) {
        const customerId = params.customer_id;
        return this.customerRepository.findById(customerId);
    }
    getloggedUser(loggedUser) {
        return logged_user_1.LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles,
            attributes: {
                id: loggedUser.attr.id,
                groups: loggedUser.attr.groups
            }
        });
    }
    getorderLog(salesOrderHeader, user) {
        return sales_order_log_1.SalesOrderLogModel.create({
            headerId: salesOrderHeader.id,
            orderData: salesOrderHeader.toStringfiedObject(),
            userData: user.toStringfiedObject()
        });
    }
}
exports.SalesOrderHeaderServiceImpl = SalesOrderHeaderServiceImpl;

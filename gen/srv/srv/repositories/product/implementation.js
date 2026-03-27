"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepositoryImpl = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const product_1 = require("@/models/product");
class ProductRepositoryImpl {
    async findByIds(ids) {
        const productsIdQuery = SELECT.from('sales.Products').where({ id: ids });
        const products = await cds_1.default.run(productsIdQuery);
        if (products.length === 0)
            return null;
        return products.map((product) => product_1.ProductModel.with({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock
        }));
    }
    async updateStock(product) {
        await cds_1.default.update('sales.Products').where({ id: product.id }).with({ stock: product.stock });
    }
}
exports.ProductRepositoryImpl = ProductRepositoryImpl;

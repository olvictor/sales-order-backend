"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderItemsModel = void 0;
class SalesOrderItemsModel {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        return new SalesOrderItemsModel({
            ...props,
            id: crypto.randomUUID()
        });
    }
    get id() {
        return this.props.id;
    }
    get productId() {
        return this.props.productId;
    }
    get quantity() {
        return this.props.quantity;
    }
    get price() {
        return this.props.price;
    }
    get products() {
        return this.props.products;
    }
    validateCreationOlayLoad(params) {
        const product = this.products.find((product) => product.id === params.product_id);
        if (!product)
            return { hasError: true, error: new Error(`Produto ${params.product_id} não encontrado.`) };
        if (product.stock === 0)
            return {
                hasError: true,
                error: new Error(`${product.name} -- ${product.id} - está sem estoque.)`)
            };
        return {
            hasError: false
        };
    }
}
exports.SalesOrderItemsModel = SalesOrderItemsModel;

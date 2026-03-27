"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
class ProductModel {
    props;
    constructor(props) {
        this.props = props;
    }
    static with(props) {
        return new ProductModel(props);
    }
    get id() {
        return this.props.id;
    }
    get name() {
        return this.props.name;
    }
    get price() {
        return this.props.price;
    }
    get stock() {
        return this.props.stock;
    }
    set stock(stock) {
        this.props.stock = stock;
    }
    sell(amount) {
        if (this.stock < amount) {
            return {
                hasError: true,
                error: new Error('Quantidade insuficiente no stock.')
            };
        }
        this.stock -= amount;
        return {
            hasError: false
        };
    }
}
exports.ProductModel = ProductModel;

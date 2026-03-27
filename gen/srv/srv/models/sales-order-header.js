"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderHeadersModel = void 0;
class SalesOrderHeadersModel {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        return new SalesOrderHeadersModel({
            ...props,
            id: crypto.randomUUID(),
            totalAmount: 0
        });
    }
    static with(props) {
        return new SalesOrderHeadersModel(props);
    }
    get id() {
        return this.props.id;
    }
    get customer_id() {
        return this.props.customerId;
    }
    get totalAmount() {
        return this.props.totalAmount;
    }
    get items() {
        return this.props.items;
    }
    set totalAmount(amount) {
        this.totalAmount = amount;
    }
    validadeCreationPlayload(params) {
        const customerValidationResult = this.validateCustomerOnCreation(params.customer_id);
        if (customerValidationResult.hasError)
            return customerValidationResult;
        const itemsValidationResult = this.validateItemsonCreation(this.items);
        if (itemsValidationResult.hasError)
            return itemsValidationResult;
        return { hasError: false };
    }
    validateCustomerOnCreation(customerId) {
        if (!customerId)
            return { hasError: true, error: new Error('Customer inválido.') };
        return {
            hasError: false
        };
    }
    validateItemsonCreation(items) {
        if (!items || items?.length === 0)
            return { hasError: true, error: new Error('Itens inválidos.') };
        const itemsErrors = [];
        items.forEach((item) => {
            const validationResult = item.validateCreationOlayLoad({ product_id: item.productId });
            if (validationResult.hasError) {
                itemsErrors.push(validationResult.error?.message);
            }
            if (itemsErrors.length > 0) {
                const messages = itemsErrors.join('\n -');
                return { hasError: true, error: new Error(messages) };
            }
        });
        return {
            hasError: false
        };
    }
    calculateTotalAmount() {
        let totalAmount = 0;
        this.items.filter((item) => {
            totalAmount += item.price * item.quantity;
        });
        return totalAmount;
    }
    calculatediscount() {
        let totalAmount = this.calculateTotalAmount();
        if (totalAmount > 30000) {
            const desconto = totalAmount * (10 / 100);
            totalAmount = totalAmount - desconto;
        }
        return totalAmount;
    }
    getProductsData() {
        return this.items.map((item) => ({
            id: item.productId,
            quantity: item.quantity
        }));
    }
    toStringfiedObject() {
        return JSON.stringify(this.props);
    }
}
exports.SalesOrderHeadersModel = SalesOrderHeadersModel;

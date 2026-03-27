"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
class CustomerModel {
    props;
    constructor(props) {
        this.props = props;
    }
    static with(props) {
        return new CustomerModel(props);
    }
    get id() {
        return this.props.id;
    }
    get firstName() {
        return this.props.firstName;
    }
    get lastName() {
        return this.props.lastName;
    }
    get email() {
        return this.props.email;
    }
    setDefaultEmailDomain() {
        if (!this.props.email?.includes('@')) {
            this.props.email = `${this.props.email}@gmail.com`;
        }
        return this;
    }
    toObject() {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            email: this.props.email
        };
    }
}
exports.CustomerModel = CustomerModel;

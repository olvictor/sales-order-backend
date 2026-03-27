"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedUserModel = void 0;
class LoggedUserModel {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        return new LoggedUserModel(props);
    }
    get id() {
        return this.props.id;
    }
    get roles() {
        return this.props.roles;
    }
    get attributes() {
        return this.props.attributes;
    }
    toStringfiedObject() {
        return JSON.stringify(this.props);
    }
}
exports.LoggedUserModel = LoggedUserModel;

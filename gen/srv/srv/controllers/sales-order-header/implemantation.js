"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderHeaderControllerImpl = void 0;
class SalesOrderHeaderControllerImpl {
    service;
    constructor(service) {
        this.service = service;
    }
    async beforeCreate(params) {
        return this.service.beforeCreate(params);
    }
    async afterCreate(params, loggedUser) {
        return this.service.afterCreate(params, loggedUser);
    }
}
exports.SalesOrderHeaderControllerImpl = SalesOrderHeaderControllerImpl;

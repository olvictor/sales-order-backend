"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesReportControllerImpl = void 0;
class SalesReportControllerImpl {
    service;
    constructor(service) {
        this.service = service;
    }
    async findByDays(days) {
        return this.service.findByDays(days);
    }
    async findByCustomerId(customerId) {
        return this.service.findByCustomerId(customerId);
    }
}
exports.SalesReportControllerImpl = SalesReportControllerImpl;

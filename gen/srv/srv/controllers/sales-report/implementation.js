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
}
exports.SalesReportControllerImpl = SalesReportControllerImpl;

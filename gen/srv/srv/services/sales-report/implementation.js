"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesReportServiceImpl = void 0;
class SalesReportServiceImpl {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findByDays(days = 7) {
        const reportData = await this.repository.findByDays(days);
        if (!reportData) {
            return [];
        }
        return reportData?.map((r) => r.toObject());
    }
    async findByCustomerId(customerId) {
        const reportData = await this.repository.findByCustomerId(customerId);
        if (!reportData) {
            return [];
        }
        return reportData?.map((r) => r.toObject());
    }
}
exports.SalesReportServiceImpl = SalesReportServiceImpl;

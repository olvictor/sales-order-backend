"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesReportRepositoryImpl = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
const sales_report_1 = require("@/models/sales-report");
class SalesReportRepositoryImpl {
    async findByDays(days) {
        const today = new Date().toISOString();
        const subtractedDays = new Date();
        subtractedDays.setDate(subtractedDays.getDate() - days);
        const subtractedDaysISOString = subtractedDays.toISOString();
        const sql = this.getReportBaseSql().where({
            createdAt: {
                between: subtractedDaysISOString,
                and: today
            }
        });
        const salesReports = await cds_1.default.run(sql);
        console.log(salesReports);
        if (salesReports.length === 0) {
            return null;
        }
        return this.mapReportResult(salesReports);
    }
    async findByCustomerId(customerId) {
        const sql = this.getReportBaseSql().where({
            customer_id: customerId
        });
        const salesReports = await cds_1.default.run(sql);
        if (salesReports.length === 0) {
            return null;
        }
        return this.mapReportResult(salesReports);
    }
    getReportBaseSql() {
        return SELECT.from('sales.SalesOrderHeaders').columns('id as salesOrderId', 'totalAmount as salesOrderTotalAmount', 'customer.id as customerId', 
        // eslint-disable-next-line quotes
        `customer.firstName || ' ' || customer.lastName as customerFullName`);
    }
    mapReportResult(salesReports) {
        if (salesReports.length === 0) {
            return null;
        }
        return salesReports.map((salesReport) => sales_report_1.SalesReportModel.with({
            salesOrderId: salesReport.salesOrderId,
            salesOrderTotalAmount: salesReport.salesOrderTotalAmount,
            customerId: salesReport.customerId,
            customerFullName: salesReport.customerFullName
        }));
    }
}
exports.SalesReportRepositoryImpl = SalesReportRepositoryImpl;

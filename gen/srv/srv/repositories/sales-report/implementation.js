"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesReportRepositoryImpl = void 0;
/* eslint-disable max-lines-per-function */
const cds_1 = __importDefault(require("@sap/cds"));
const sales_report_1 = require("@/models/sales-report");
class SalesReportRepositoryImpl {
    async findByDays(days) {
        const today = new Date().toISOString();
        const subtractedDays = new Date();
        subtractedDays.setDate(subtractedDays.getDay() - days);
        const subtractedDaysISOString = subtractedDays.toISOString();
        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns('id as salesOrderId', 'totalAmount as salesOrderTotalAmount', 'customer.id as customerId', 
        // eslint-disable-next-line quotes
        `customer.firstName || ' ' || customer.lastName as customerFullName`)
            .where({
            createdAt: {
                between: subtractedDaysISOString,
                and: today
            }
        });
        const salesReports = await cds_1.default.run(sql);
        console.log(salesReports);
        if (salesReports.lenght === 0) {
            return null;
        }
        return salesReports.map((salesReport) => sales_report_1.SalesReportModel.with({
            salesOrderId: salesReport.salesOrderId,
            salesOrderTotalAmount: salesReport.salesOrderTotalAmount,
            customerId: salesReport.custumerId,
            customerFullName: salesReport.custumerFullName
        }));
    }
}
exports.SalesReportRepositoryImpl = SalesReportRepositoryImpl;

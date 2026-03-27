/* eslint-disable max-lines-per-function */
import cds from '@sap/cds';

import { ExpectedResult } from '@models/db/types/SalesReportByDays';

import { SalesReportModel } from '@/models/sales-report';
import { SalesReportRepository } from '@/repositories/sales-report/protocol';

export class SalesReportRepositoryImpl implements SalesReportRepository {
    public async findByDays(days: number): Promise<SalesReportModel[] | null> {
        console.log(days);
        const today = new Date().toISOString();
        const subtractedDays = new Date();
        subtractedDays.setDate(subtractedDays.getDate() - days);
        const subtractedDaysISOString = subtractedDays.toISOString();

        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns(
                'id as salesOrderId',
                'totalAmount as salesOrderTotalAmount',
                'customer.id as customerId',
                // eslint-disable-next-line quotes
                `customer.firstName || ' ' || customer.lastName as customerFullName`
            )
            .where({
                createdAt: {
                    between: subtractedDaysISOString,
                    and: today
                }
            });

        const salesReports = await cds.run(sql);
        console.log(salesReports);
        if (salesReports.lenght === 0) {
            return null;
        }
        return salesReports.map((salesReport: ExpectedResult) =>
            SalesReportModel.with({
                salesOrderId: salesReport.salesOrderId as string,
                salesOrderTotalAmount: salesReport.salesOrderTotalAmount as number,
                customerId: salesReport.customerId as string,
                customerFullName: salesReport.customerFullName as string
            })
        );
    }
}

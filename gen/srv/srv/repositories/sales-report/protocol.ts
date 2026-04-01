import { SalesReportModel } from '@/models/sales-report';
// import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';

export interface SalesReportRepository {
    findByDays(days: number): Promise<SalesReportModel[] | null>;
    findByCustomerId(customerId: string): Promise<SalesReportModel[] | null>;
}

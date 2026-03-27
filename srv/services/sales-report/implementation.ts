import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';

import { SalesReportRepository } from '@/repositories/sales-report/protocol';
import { SalesReportService } from './protocols';

export class SalesReportServiceImpl implements SalesReportService {
    constructor(private readonly repository: SalesReportRepository) {}
    public async findByDays(days = 7): Promise<SalesReportByDays[]> {
        const reportData = await this.repository.findByDays(days);

        if (!reportData) {
            return [];
        }
        return reportData?.map((r) => r.toObject());
    }

    public async findByCustomerId(customerId: string): Promise<SalesReportByDays[]> {
        const reportData = await this.repository.findByCustomerId(customerId);

        if (!reportData) {
            return [];
        }
        return reportData?.map((r) => r.toObject());
    }
}

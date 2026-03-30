import { SalesOrderHeadersModel } from '@/models/sales-order-header';

export interface SalesOrderHeaderRepository {
    bulkCreate(logs: SalesOrderHeadersModel[]): Promise<void>;
}

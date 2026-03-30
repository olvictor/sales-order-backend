import cds from '@sap/cds';

import { SalesOrderHeaderRepository } from './protocol';
import { SalesOrderHeadersModel } from '@/models/sales-order-header';

export class SalesOrderHeaderRepositoryImpl implements SalesOrderHeaderRepository {
    public async bulkCreate(headers: SalesOrderHeadersModel[]): Promise<void> {
        const headerObjects = headers.map((header) => header.toCreationObject());
        await cds.create('sales.SalesOrderHeaders').entries(headerObjects);
    }
}

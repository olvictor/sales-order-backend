import { SalesOrderHeadersModel } from '@/models/sales-order-header';

export type completeSalesOrderHeader = {
    totalAmount: number;
    customerId: string;
    item_quantity: number;
    item_price: number;
    product_id: string;
    product_name: string;
    product_price: number;
    product_stock: number;
};

export interface SalesOrderHeaderRepository {
    bulkCreate(logs: SalesOrderHeadersModel[]): Promise<void>;
    findCompleteSalesOrderById(id: string): Promise<SalesOrderHeadersModel | null>;
}

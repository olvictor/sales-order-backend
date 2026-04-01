import cds from '@sap/cds';

import { ProductModel } from '@/models/product';
import { SalesOrderHeadersModel } from '@/models/sales-order-header';
import { SalesOrderItemsModel } from '@/models/sales-order-item';
import { SalesOrderHeaderRepository, completeSalesOrderHeader } from './protocol';

export class SalesOrderHeaderRepositoryImpl implements SalesOrderHeaderRepository {
    public async bulkCreate(headers: SalesOrderHeadersModel[]): Promise<void> {
        const headerObjects = headers.map((header) => header.toCreationObject());
        await cds.create('sales.SalesOrderHeaders').entries(headerObjects);
    }
    public async findCompleteSalesOrderById(id: string): Promise<SalesOrderHeadersModel | null> {
        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns(
                'totalAmount as salesOrderTotalAmount',
                'customer.id as customerId',
                'items.quantity as item_quantity',
                'items.price as item_price',
                'items.product.id as product_id',
                'items.product.name as product_name',
                'items.product.price as product_price',
                'items.product.stock as product_stock'
            )
            .where({ id });

        const headers: completeSalesOrderHeader[] = await cds.run(sql);

        if (!headers || headers.length === 0) return null;

        const products = this.mapProductsCompleteSalesOrder(headers);

        const items: SalesOrderItemsModel[] = this.mapItemsCompleteSalesOrder(headers, products);

        return SalesOrderHeadersModel.create({
            customerId: headers.at(0)?.customerId as string,
            items
        });
    }

    private mapProductsCompleteSalesOrder(headers: completeSalesOrderHeader[]): ProductModel[] {
        return headers.map((header) =>
            ProductModel.with({
                id: header.product_id,
                name: header.product_name,
                price: header.product_price,
                stock: header.product_stock
            })
        );
    }

    private mapItemsCompleteSalesOrder(
        headers: completeSalesOrderHeader[],
        products: ProductModel[]
    ): SalesOrderItemsModel[] {
        return headers.map((header) =>
            SalesOrderItemsModel.create({
                price: header.item_price,
                quantity: header.item_quantity,
                productId: header.product_id,
                products: products
            })
        );
    }
}

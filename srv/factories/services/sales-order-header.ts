import { CustomerRepositoryImpl } from '@/repositories/customer/implementation';
import { ProductRepositoryImpl } from '@/repositories/product/implementation';
import { SalesOrderHeaderService } from '@/services/sales-order-header/protocol';
import { SalesOrderHeaderServiceImpl } from '@/services/sales-order-header/implementation';
import { SalesOrderLogRepositoryImpl } from '@/repositories/sales-order-log/implementation';

const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const customerRepository = new CustomerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const salesOrderLogsRepository = new SalesOrderLogRepositoryImpl();

    return new SalesOrderHeaderServiceImpl(customerRepository, productRepository, salesOrderLogsRepository);
};

export const salesOrderHeaderService = makeSalesOrderHeaderService();

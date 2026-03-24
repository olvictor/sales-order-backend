import { CustomerRepositoryImpl } from "srv/repositories/customer/implementation";
import { ProductRepositoryImpl } from "srv/repositories/product/implementation";
import { SalesOrderLogRepositoryImpl } from "srv/repositories/sales-order-log/implementation";
import { SalesOrderHeaderServiceImpl } from "srv/services/sales-order-header/implementation";
import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocol";

const makeSalesOrderHeaderService = (): SalesOrderHeaderService =>{
    const customerRepository = new CustomerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const salesOrderLogsRepository = new SalesOrderLogRepositoryImpl();
    
    return new SalesOrderHeaderServiceImpl(customerRepository, productRepository, salesOrderLogsRepository);
}

export const salesOrderHeaderService = makeSalesOrderHeaderService();
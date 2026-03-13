using { sales } from '../db/schema';


service MainService {
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;
    entity Products as projection on sales.Products;
    entity Customers as projection on sales.Customers;
}
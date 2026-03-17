using { sales } from '../db/schema';

//@requires : ['admin','read_only_user']
@requires : 'authenticated-user'

service MainService {
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;
    entity Products as projection on sales.Products;
    entity Customers as projection on sales.Customers;
}
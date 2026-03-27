using { sales } from '../../db/schema';
using { db.types.SalesReportByDays } from '../../db/types/sales-report-by-days';

@requires : 'authenticated-user'

//Entities
service MainService {
 
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;

    entity Products as projection on sales.Products;

    entity Customers as projection on sales.Customers;

    entity SalesOrderStatuses as projection on sales.SalesOrderStatuses;
}
// Functions
extend service MainService with {
    function getSalesReportByDays(days: SalesReportByDays.Params:days) returns  array of  SalesReportByDays.ExpectedResult;

}
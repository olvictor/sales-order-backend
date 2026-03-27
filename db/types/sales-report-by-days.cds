using { sales } from '../schema';

namespace db.types.SalesReportByDays;

type ExpectedResult {
        salesOrderId: sales.SalesOrderHeaders:id;
        salesOrderTotalAmount: sales.SalesOrderHeaders:totalAmount;
        customerId: sales.Customers:id;
        customerFullName: String(120)
}

type Params {
    days:Integer
}
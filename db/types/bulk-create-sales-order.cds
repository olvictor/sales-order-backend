using { sales } from '../schema';


namespace db.types.BulkCreateSalesOrder;

type Payload{
    id: sales.SalesOrderHeaders:id;
    customer_id: sales.Customers:id;
    totalAmount: sales.SalesOrderHeaders:totalAmount;
    items: array of ItemsPayload;
}

type ItemsPayload {
    id: sales.SalesOrderItems:id;
    header_id: sales.SalesOrderHeaders:id;
    product: sales.SalesOrderItems:product;
    quantity: sales.SalesOrderItems:quantity;
    price: sales.SalesOrderItems:price;

}


type ExpectedResult {
    success:Boolean;
}
// {
//   "id": "{{id}}",
//   "customer_id": "15835084-bccf-49e8-9465-9d70bdee3e7d",
//   "items": [
//     {
//       "id": "c23ccfc1-2d10-4274-8e1c-6aa7d95e0300",
//       "header_id": "{{id}}",
//       "product_id": "{{productId2}}",
//       "quantity": 10,
//       "price": 2.99
//     },
//     {
//       "id": "1463f1d6-4c71-4822-9497-86ede7ba9f2b",
//       "header_id": "{{id}}",
//       "product_id": "{{productId2}}",
//       "quantity": 5,
//       "price": 1.99
//     }
//   ]
// }
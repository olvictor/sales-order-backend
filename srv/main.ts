import { Service } from "@sap/cds";
import { Customers } from "@models/sales"
export default (service : Service) => {
  service.after('READ',"Customers",(results: Customers) => {
        results.forEach(Customer => {
            if(!Customer.email?.includes('@')){
                Customer.email = `${Customer.email}@gmail.com`
            }
        })
  });
}
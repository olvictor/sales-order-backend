import { CustomerServiceImpl } from "srv/services/customer/implemantation";
import { CustomerService } from "srv/services/customer/protocols";

const makeCustomerService = ():CustomerService =>{
        return new CustomerServiceImpl();
}

export const customerService = makeCustomerService();
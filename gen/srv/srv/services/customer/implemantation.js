"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerServiceImpl = void 0;
const custumer_1 = require("@/models/custumer");
class CustomerServiceImpl {
    afterRead(customerList) {
        const customers = customerList.map((c) => {
            const customer = custumer_1.CustomerModel.with({
                id: c.id,
                firstName: c.firstName,
                lastName: c.lastName,
                email: c.email
            });
            return customer.setDefaultEmailDomain().toObject();
        });
        console.log(customers);
        return customers;
    }
}
exports.CustomerServiceImpl = CustomerServiceImpl;

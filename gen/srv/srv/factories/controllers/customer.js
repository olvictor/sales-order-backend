"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
const implementation_1 = require("@/controllers/customer/implementation");
const customer_1 = require("../services/customer");
const makeCustomerController = () => {
    return new implementation_1.CustomerControllerImpl(customer_1.customerService);
};
exports.customerController = makeCustomerController();

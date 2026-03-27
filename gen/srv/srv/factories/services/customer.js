"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerService = void 0;
const implemantation_1 = require("@/services/customer/implemantation");
const makeCustomerService = () => {
    return new implemantation_1.CustomerServiceImpl();
};
exports.customerService = makeCustomerService();

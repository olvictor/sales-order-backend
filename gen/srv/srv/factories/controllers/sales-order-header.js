"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesOrderHeaderController = exports.makeSalesOrderHeaderController = void 0;
const implemantation_1 = require("@/controllers/sales-order-header/implemantation");
const sales_order_header_1 = require("../services/sales-order-header");
const makeSalesOrderHeaderController = () => {
    return new implemantation_1.SalesOrderHeaderControllerImpl(sales_order_header_1.salesOrderHeaderService);
};
exports.makeSalesOrderHeaderController = makeSalesOrderHeaderController;
exports.salesOrderHeaderController = (0, exports.makeSalesOrderHeaderController)();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesReportModel = void 0;
class SalesReportModel {
    props;
    constructor(props) {
        this.props = props;
    }
    static with(props) {
        return new SalesReportModel(props);
    }
    get salesOrderId() {
        return this.props.salesOrderId;
    }
    get salesOrderTotalAmount() {
        return this.props.salesOrderTotalAmount;
    }
    get custumerId() {
        return this.props.customerId;
    }
    get custumerFullName() {
        return this.props.customerFullName;
    }
    toObject() {
        return {
            salesOrderId: this.props.salesOrderId,
            salesOrderTotalAmount: this.props.salesOrderTotalAmount,
            customerId: this.props.customerId,
            customerFullName: this.props.customerFullName
        };
    }
}
exports.SalesReportModel = SalesReportModel;

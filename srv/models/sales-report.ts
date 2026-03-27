type SalesReportProps = {
    salesOrderId: string;
    salesOrderTotalAmount: number;
    customerId: string;
    customerFullName: string;
};

export class SalesReportModel {
    constructor(private props: SalesReportProps) {}

    public static with(props: SalesReportProps): SalesReportModel {
        return new SalesReportModel(props);
    }

    public get salesOrderId() {
        return this.props.salesOrderId;
    }
    public get salesOrderTotalAmount() {
        return this.props.salesOrderTotalAmount;
    }
    public get custumerId() {
        return this.props.customerId;
    }
    public get custumerFullName() {
        return this.props.customerFullName;
    }

    public toObject(): SalesReportProps {
        return {
            salesOrderId: this.props.salesOrderId,
            salesOrderTotalAmount: this.props.salesOrderTotalAmount,
            customerId: this.props.customerId,
            customerFullName: this.props.customerFullName
        };
    }
}

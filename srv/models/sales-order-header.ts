import { SalesOrderItemsModel, SalesOrderItemsPropsWithSnakeCaseProductId } from './sales-order-item';

type salesOrderHeadersProps = {
    id: string;
    customerId: string;
    totalAmount?: number;
    items: SalesOrderItemsModel[];
};

type salesOrderHeadersPropsWhitoutIdAndTotalAmount = Omit<salesOrderHeadersProps, 'id' | 'TotalAmount'>;

type salesOrderHeadersPropsWithSnakeCaseCustomerId = Omit<salesOrderHeadersProps, 'customerId' | 'items'> & {
    customer_id: salesOrderHeadersProps['customerId'];
    items: SalesOrderItemsPropsWithSnakeCaseProductId[];
};

type CreationPayload = {
    customer_id: salesOrderHeadersProps['customerId'];
};

type CreationPayloadValidationResult = {
    hasError: boolean;
    error?: Error;
};
export class SalesOrderHeadersModel {
    constructor(private props: salesOrderHeadersProps) {}

    public static create(props: salesOrderHeadersPropsWhitoutIdAndTotalAmount): SalesOrderHeadersModel {
        return new SalesOrderHeadersModel({
            ...props,
            id: crypto.randomUUID(),
            totalAmount: 0
        });
    }

    public static with(props: salesOrderHeadersProps): SalesOrderHeadersModel {
        return new SalesOrderHeadersModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get customer_id() {
        return this.props.customerId;
    }

    public get totalAmount() {
        return this.props.totalAmount as number;
    }
    public get items() {
        return this.props.items;
    }

    public set totalAmount(amount: number) {
        this.totalAmount = amount;
    }
    public validadeCreationPlayload(params: CreationPayload): CreationPayloadValidationResult {
        const customerValidationResult = this.validateCustomerOnCreation(params.customer_id);

        if (customerValidationResult.hasError) return customerValidationResult;

        const itemsValidationResult = this.validateItemsonCreation(this.items);

        if (itemsValidationResult.hasError) return itemsValidationResult;
        return { hasError: false };
    }

    private validateCustomerOnCreation(customerId: CreationPayload['customer_id']): CreationPayloadValidationResult {
        if (!customerId) return { hasError: true, error: new Error('Customer inválido.') };
        return {
            hasError: false
        };
    }

    private validateItemsonCreation(items: salesOrderHeadersProps['items']): CreationPayloadValidationResult {
        if (!items || items?.length === 0) return { hasError: true, error: new Error('Itens inválidos.') };

        const itemsErrors: string[] = [];
        items.forEach((item) => {
            const validationResult = item.validateCreationOlayLoad({ product_id: item.productId });

            if (validationResult.hasError) {
                itemsErrors.push(validationResult.error?.message as string);
            }

            if (itemsErrors.length > 0) {
                const messages = itemsErrors.join('\n -');
                return { hasError: true, error: new Error(messages) };
            }
        });

        return {
            hasError: false
        };
    }

    public calculateTotalAmount(): number {
        let totalAmount = 0;
        this.items.filter((item) => {
            totalAmount += (item.price as number) * (item.quantity as number);
        });

        return totalAmount;
    }

    public calculatediscount(): number {
        let totalAmount = this.calculateTotalAmount();

        if (totalAmount > 30000) {
            const desconto = totalAmount * (10 / 100);
            totalAmount = totalAmount - desconto;
        }

        return totalAmount;
    }

    public getProductsData(): { id: string; quantity: number }[] {
        return this.items.map((item) => ({
            id: item.productId,
            quantity: item.quantity
        }));
    }

    public toStringfiedObject(): string {
        return JSON.stringify(this.props);
    }

    public toCreationObject(): salesOrderHeadersPropsWithSnakeCaseCustomerId {
        return {
            id: this.props.id,
            customer_id: this.props.customerId,
            totalAmount: this.calculateTotalAmount(),
            items: this.props.items.map((item) => item.toCreationObject())
        };
    }
}

import { ProductModel } from './product';

type SalesOrderItemsProps = {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    products: ProductModel[];
};

type CreationPlayLoadValidation = {
    hasError: boolean;
    error?: Error;
};

type SalesOrderItemsPropsWithoutId = Omit<SalesOrderItemsProps, 'id'>;

type CreationPlayLoad = {
    product_id: SalesOrderItemsProps['productId'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items?: any[];
};

export class SalesOrderItemsModel {
    public constructor(private props: SalesOrderItemsProps) {}

    public static create(props: SalesOrderItemsPropsWithoutId): SalesOrderItemsModel {
        return new SalesOrderItemsModel({
            ...props,
            id: crypto.randomUUID()
        });
    }

    public get id() {
        return this.props.id;
    }
    public get productId() {
        return this.props.productId;
    }
    public get quantity() {
        return this.props.quantity;
    }
    public get price() {
        return this.props.price;
    }
    public get products() {
        return this.props.products;
    }

    public validateCreationOlayLoad(params: CreationPlayLoad): CreationPlayLoadValidation {
        const product = this.products.find((product) => product.id === params.product_id);

        if (!product) return { hasError: true, error: new Error(`Produto ${params.product_id} não encontrado.`) };

        if (product.stock === 0)
            return {
                hasError: true,
                error: new Error(`${product.name} -- ${product.id} - está sem estoque.)`)
            };

        return {
            hasError: false
        };
    }
}

type SalesOderLogProps = {
    id: string,
    headerId: string,
    userData: string,
    orderData: string
}

type SalesOderLogPropsWithoutIdProps = Omit<SalesOderLogProps,'id'>


type SalesOderLogDbProps = Omit<SalesOderLogProps,'headerId'> &{
    header_id: string
}
export class SalesOrderLogModel{
    constructor(private props: SalesOderLogProps){}

    public static create(props: SalesOderLogPropsWithoutIdProps):SalesOrderLogModel{
        return new SalesOrderLogModel({
            ...props,
            id: crypto.randomUUID()            
        });
    }   

    public get id(){
        return this.props.id;
    }
    
    public get headerId(){
        return this.props.headerId;
    }
    
    public get userData(){
        return this.props.userData;
    }

    public get orderData(){
        return this.props.orderData;
    }
    

    public toObject(): SalesOderLogDbProps {
        return {
            id:  this.id,
            header_id: this.headerId,
            userData: this.userData,
            orderData: this.orderData
        };
    }
    
}

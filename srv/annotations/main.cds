using { MainService } from '../routes/main';

annotate MainService.SalesOrderHeaders with @(
    Capabilities: {
        DeleteRestrictions : {
            $Type : 'Capabilities.DeleteRestrictionsType',
            Deletable: false,
        },
        // UpdateRestrictions : {
        //     $Type : 'Capabilities.UpdateRestrictionsType',
        //     Updatable: false
        // },
        FilterFunctions : [
            'tolower',
        ],
        FilterRestrictions : {
            $Type : 'Capabilities.FilterRestrictionsType',
            FilterExpressionRestrictions: [
                {
                    Property: createdAt,
                    AllowedExpressions: 'SingleRange'
                },
                {
                    Property: modifiedAt,
                    AllowedExpressions: 'SingleRange'
                }
            ]
        },
    },
    UI:{
        SelectionFields  : [
            id,
            totalAmount,
            customer_id,
            status_id,
            createdAt, 
            modifiedAt,
        ],
        LineItem  : [
            {
                $type: 'UI.DataField',
                Value: id,
                ![@HTML5.CssDefaults] :{
                    $Type: 'HTML5.CssDefaultsType',
                    width: '18rem'
                },
            },
             {
                $type: 'UI.DataField',
                Value: customer.id,
                Label:'Customer_ID',
                ![@HTML5.CssDefaults] :{
                    $Type: 'HTML5.CssDefaultsType',
                    width: '18rem'
                },
            },
             {
                $type: 'UI.DataField',
                Value: status.description,
                Criticality: (
                    status.id ='COMPLETED' ? 3 : (status.id = 'PENDING' ? 2  : 1)
                    ),
                CriticalityRepresentation:#WithoutIcon,
                Label:'Status',
                ![@HTML5.CssDefaults] :{
                    $Type: 'HTML5.CssDefaultsType',
                    width: '10rem'
                },
            },
            {
                $type: 'UI.DataField',
                Value: totalAmount,
                ![@HTML5.CssDefaults] :{
                    $Type: 'HTML5.CssDefaultsType',
                    width: '10rem'
                },
            },
            {
                $type: 'UI.DataField',
                Value: createdAt,
                ![@HTML5.CssDefaults] :{
                    $Type: 'HTML5.CssDefaultsType',
                    width: '10rem'
                },
            },
             {
                $type: 'UI.DataField',
                Value: createdBy,
                ![@HTML5.CssDefaults] :{
                    $Type: 'HTML5.CssDefaultsType',
                    width: '10rem'
                },
            },
        ],
        HeaderInfo  : {
            $Type : 'UI.HeaderInfoType',
            TypeName : 'Pedido',
            TypeNamePlural : 'Pedidos',
            Title: {
                $Type: 'UI.DataField',
                Value: 'Pedido: {id}'
            }
        },
       Facets  : [
           {
             ID: 'salesOrderData',
             $Type: 'UI.CollectionFacet',
             Label: 'Informações do Cabeçalho do pedido',
             Facets: [
                {
                    ID:'header',
                    $Type: 'UI.ReferenceFacet',
                    Target: '@UI.FieldGroup#Header',
                }
             ]
           },
           {
            ID: 'customerData',
            $Type: 'UI.ReferenceFacet',
            Label: 'Informações do Cliente',
            Target: 'customer/@UI.FieldGroup#CustomerData'
           },
           {
            ID: 'itemsData',
            $Type: 'UI.ReferenceFacet',
            Label: 'Items do Pedido',
            Target: 'items/@UI.LineItem'
           },

       ], 
       FieldGroup#Header : {
           $Type : 'UI.FieldGroupType',
           Data: [
                {
                    $Type: 'UI.DataField',
                    Label: 'ID',
                    Value: id
                },
                {
                    $Type: 'UI.DataField',
                    Value: totalAmount
                },
                {
                    $Type: 'UI.DataField',
                    Value: createdAt
                },
                {
                    $Type: 'UI.DataField',
                    Value: createdBy
                },
           ]
       },
    }
)
{
    id @title : 'ID';
    totalAmount @title : 'Valor Total';
    createdAt @title: 'Data de Criacao';
    modifiedAt @title: 'Data de Atualização';
    createdBy @title: 'Criado Por';
     status @(
        title : 'Status',
        Common: {
            Label : 'Status',
            Text : status.description,
            TextArrangement : #TextOnly,
            ValueListWithFixedValues,
            ValueList : {
                $Type : 'Common.ValueListType',
                CollectionPath: 'SalesOrderStatuses',
                Parameters: [
                    {
                        $Type: 'Common.ValueListParameterInOut',
                        ValueListProperty: 'id',
                        LocalDataProperty: 'status_id'
                    },
                ]
            },
        }
    );
    customer @(
        title : 'Cliente',
        Common: {
            Title : 'Cliente',
            Text : customer.firstName,            
            ValueList : {
                $Type : 'Common.ValueListType',
                CollectionPath: 'Customers',
                Parameters: [
                    {
                        $Type: 'Common.ValueListParameterInOut',
                        ValueListProperty: 'id',
                        LocalDataProperty: 'customer_id'
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'firstName'
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'lastName'
                    },
                    
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'email'
                    },
                ]
            },
        }
    );
}


annotate MainService.SalesOrderStatuses with {
     id @Common.Text : description @Common.TextArrangement: #TextOnly
}

annotate MainService.Customers with @(
    UI: {
        FieldGroup#CustomerData : {
            $Type : 'UI.FieldGroupType',
            Data: [
                    {
                        $Type: 'UI.DataField',
                        Value: id
                    },
                    {
                        $Type: 'UI.DataField',
                        Value: firstName
                    },
                    {
                        $Type: 'UI.DataField',
                        Value: lastName
                    },
                    {
                        $Type: 'UI.DataField',
                        Value: email
                    },
     
                ]
        },
    }
)
{
    id @title : 'ID';
    firstName @title : 'Nome';
    lastName @title : 'Sobrenome';
    email @title : 'Email'  
};

annotate MainService.SalesOrderItems with @ (
    UI: {
        LineItem  : [
            {
                $type: UI.DataField,
                Value: id,
                ![@HTML5.CssDefaults] :{
                    $Type: 'HTML5.CssDefaultsType',
                    width: '18rem'
                },
            },
            {
                $type: UI.DataField,
                Value: price,
                 ![@HTML5.CssDefaults] :{
                    $Type: 'HTML5.CssDefaultsType',
                    width: '15rem'
                },
            },
            {
                $type: UI.DataField,
                Value: quantity,
                 ![@HTML5.CssDefaults] :{
                    $Type: 'HTML5.CssDefaultsType',
                    width: '15rem'
                },
            },
            {
                $type: UI.DataField,
                Value: product.name,
                 ![@HTML5.CssDefaults] :{
                    $Type: 'HTML5.CssDefaultsType',
                    width: '15rem'
                },
            },
        ],
    }
)
{
    id @title : 'ID';
    price @title : 'Preço';
    quantity @title : 'Quantidade';
    header @UI.Hidden @UI.HiddenFilter; 
    product @UI.Hidden @UI.HiddenFilter; 

}

annotate MainService.Products with @(
    
)
{
    name @title : 'Produto'
}

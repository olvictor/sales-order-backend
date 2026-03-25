using { MainService } from '../routes/main';

annotate MainService.SalesOrderHeaders with @(
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
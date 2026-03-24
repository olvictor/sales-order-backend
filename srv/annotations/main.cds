using { MainService } from '../routes/main';

annotate MainService.SalesOrderHeaders with @(
    UI:{
        LineItem  : [
            {
                $type: 'UI.DataField',
                Label: 'ID',
                Value: id,
            }
        ],
    }
)
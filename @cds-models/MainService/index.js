// This is an automatically generated file. Please do not change its contents manually!
const { createEntityProxy } = require('./../_')
// service
const MainService = { name: 'MainService' }
module.exports = MainService
module.exports.MainService = MainService
// SalesOrderHeaders
module.exports.SalesOrderHeader = createEntityProxy(['MainService', 'SalesOrderHeaders'], { target: { is_singular: true } })
module.exports.SalesOrderHeaders = createEntityProxy(['MainService', 'SalesOrderHeaders'], { target: { is_singular: false }})
// Products
module.exports.Product = createEntityProxy(['MainService', 'Products'], { target: { is_singular: true } })
module.exports.Products = createEntityProxy(['MainService', 'Products'], { target: { is_singular: false }})
// Customers
module.exports.Customer = createEntityProxy(['MainService', 'Customers'], { target: { is_singular: true } })
module.exports.Customers = createEntityProxy(['MainService', 'Customers'], { target: { is_singular: false }})
// SalesOrderStatuses
module.exports.SalesOrderStatus = createEntityProxy(['MainService', 'SalesOrderStatuses'], { target: { is_singular: true }, customProps: ["id"] })
module.exports.SalesOrderStatuses = createEntityProxy(['MainService', 'SalesOrderStatuses'], { target: { is_singular: false }})
// SalesOrderItems
module.exports.SalesOrderItem = createEntityProxy(['MainService', 'SalesOrderItems'], { target: { is_singular: true } })
module.exports.SalesOrderItems = createEntityProxy(['MainService', 'SalesOrderItems'], { target: { is_singular: false }})
// SalesOrderStatuses.texts
module.exports.SalesOrderStatuses.text = createEntityProxy(['MainService', 'SalesOrderStatuses.texts'], { target: { is_singular: true }, customProps: ["id"] })
module.exports.SalesOrderStatuses.texts = createEntityProxy(['MainService', 'SalesOrderStatuses.texts'], { target: { is_singular: false }})
// events
// actions
module.exports.getSalesReportByDays = 'getSalesReportByDays'
module.exports.bulkCreateSalesOrder = 'bulkCreateSalesOrder'
// enums
module.exports.SalesOrderStatus.id ??= { completed: "COMPLETED", pending: "PENDING", rejected: "REJECTED" }
module.exports.SalesOrderStatuses.text.id ??= { completed: "COMPLETED", pending: "PENDING", rejected: "REJECTED" }

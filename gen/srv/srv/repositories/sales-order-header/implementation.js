"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderHeaderRepositoryImpl = void 0;
const cds_1 = __importDefault(require("@sap/cds"));
class SalesOrderHeaderRepositoryImpl {
    async bulkCreate(headers) {
        const headerObjects = headers.map((header) => header.toCreationObject());
        await cds_1.default.create('sales.SalesOrderHeaders').entries(headerObjects);
    }
}
exports.SalesOrderHeaderRepositoryImpl = SalesOrderHeaderRepositoryImpl;

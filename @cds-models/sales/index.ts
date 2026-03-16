// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './..';
import * as __ from './../_';

export function _SalesOrderHeaderAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class SalesOrderHeader extends _._managedAspect(Base) {
    declare id?: __.Key<string>
    declare customer?: __.Association.to<Customer> | null
    declare customer_id?: string | null
    declare totalAmount?: number | null
    declare items?: __.Composition.of.many<SalesOrderItems>
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<SalesOrderHeader>;
    declare static readonly elements: __.ElementsOf<SalesOrderHeader>;
    declare static readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
  };
}
export class SalesOrderHeader extends _SalesOrderHeaderAspect(__.Entity) {}
Object.defineProperty(SalesOrderHeader, 'name', { value: 'sales.SalesOrderHeaders' })
Object.defineProperty(SalesOrderHeader, 'is_singular', { value: true })
export class SalesOrderHeaders extends Array<SalesOrderHeader> {$count?: number}
Object.defineProperty(SalesOrderHeaders, 'name', { value: 'sales.SalesOrderHeaders' })

export function _SalesOrderItemAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class SalesOrderItem extends Base {
    declare id?: __.Key<string>
    declare header?: __.Association.to<SalesOrderHeader> | null
    declare header_id?: string | null
    declare product?: __.Association.to<Product> | null
    declare product_id?: string | null
    declare quantity?: number | null
    declare price?: number | null
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<SalesOrderItem>;
    declare static readonly elements: __.ElementsOf<SalesOrderItem>;
    declare static readonly actions: globalThis.Record<never, never>;
  };
}
export class SalesOrderItem extends _SalesOrderItemAspect(__.Entity) {}
Object.defineProperty(SalesOrderItem, 'name', { value: 'sales.SalesOrderItems' })
Object.defineProperty(SalesOrderItem, 'is_singular', { value: true })
export class SalesOrderItems extends Array<SalesOrderItem> {$count?: number}
Object.defineProperty(SalesOrderItems, 'name', { value: 'sales.SalesOrderItems' })

export function _CustomerAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Customer extends Base {
    declare id?: __.Key<string>
    declare firstName?: string | null
    declare lastName?: string | null
    declare email?: string | null
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Customer>;
    declare static readonly elements: __.ElementsOf<Customer>;
    declare static readonly actions: globalThis.Record<never, never>;
  };
}
export class Customer extends _CustomerAspect(__.Entity) {}
Object.defineProperty(Customer, 'name', { value: 'sales.Customers' })
Object.defineProperty(Customer, 'is_singular', { value: true })
export class Customers extends Array<Customer> {$count?: number}
Object.defineProperty(Customers, 'name', { value: 'sales.Customers' })

export function _ProductAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Product extends Base {
    declare id?: __.Key<string>
    declare name?: string | null
    declare price?: number | null
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<Product>;
    declare static readonly elements: __.ElementsOf<Product>;
    declare static readonly actions: globalThis.Record<never, never>;
  };
}
export class Product extends _ProductAspect(__.Entity) {}
Object.defineProperty(Product, 'name', { value: 'sales.Products' })
Object.defineProperty(Product, 'is_singular', { value: true })
export class Products extends Array<Product> {$count?: number}
Object.defineProperty(Products, 'name', { value: 'sales.Products' })

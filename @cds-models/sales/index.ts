// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './..';
import * as __ from './../_';
import * as _sap_common from './../sap/common';

// enum
const SalesOrderStatus_id = {
  completed: "COMPLETED",
  pending: "PENDING",
  rejected: "REJECTED",
} as const;
type SalesOrderStatus_id = "COMPLETED" | "PENDING" | "REJECTED"

export function _SalesOrderHeaderAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class SalesOrderHeader extends Base {
    declare id?: __.Key<string>
    declare totalAmount?: number | null
    declare createdAt?: __.CdsTimestamp | null
    /** Canonical user ID */
    declare createdBy?: _.User | null
    declare modifiedAt?: __.CdsTimestamp | null
    /** Canonical user ID */
    declare modifiedBy?: _.User | null
    declare customer?: __.Association.to<Customer> | null
    declare customer_id?: string | null
    declare status?: __.Association.to<SalesOrderStatus> | null
    declare status_id?: SalesOrderStatus_id | null
    declare items?: __.Composition.of.many<SalesOrderItems>
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<SalesOrderHeader>;
    declare static readonly elements: __.ElementsOf<SalesOrderHeader>;
    declare static readonly actions: globalThis.Record<never, never>;
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

export function _SalesOrderLogAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class SalesOrderLog extends _._managedAspect(Base) {
    declare id?: __.Key<string>
    declare header?: __.Association.to<SalesOrderHeader> | null
    declare header_id?: string | null
    declare userData?: string | null
    declare orderData?: string | null
    static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<SalesOrderLog>;
    declare static readonly elements: __.ElementsOf<SalesOrderLog>;
    declare static readonly actions: typeof _.managed.actions & globalThis.Record<never, never>;
  };
}
export class SalesOrderLog extends _SalesOrderLogAspect(__.Entity) {}
Object.defineProperty(SalesOrderLog, 'name', { value: 'sales.SalesOrderLogs' })
Object.defineProperty(SalesOrderLog, 'is_singular', { value: true })
export class SalesOrderLogs extends Array<SalesOrderLog> {$count?: number}
Object.defineProperty(SalesOrderLogs, 'name', { value: 'sales.SalesOrderLogs' })

export function _SalesOrderStatusAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class SalesOrderStatus extends Base {
    declare id?: __.Key<SalesOrderStatus_id>
    declare description?: string | null
    declare texts?: __.Composition.of.many<SalesOrderStatuses.texts>
    declare localized?: __.Association.to<SalesOrderStatuses.text> | null
    static id = SalesOrderStatus_id;
    static readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
    declare static readonly keys: __.KeysOf<SalesOrderStatus>;
    declare static readonly elements: __.ElementsOf<SalesOrderStatus>;
    declare static readonly actions: globalThis.Record<never, never>;
  };
}
export class SalesOrderStatus extends _SalesOrderStatusAspect(__.Entity) {}
Object.defineProperty(SalesOrderStatus, 'name', { value: 'sales.SalesOrderStatuses' })
Object.defineProperty(SalesOrderStatus, 'is_singular', { value: true })
export class SalesOrderStatuses extends Array<SalesOrderStatus> {$count?: number}
Object.defineProperty(SalesOrderStatuses, 'name', { value: 'sales.SalesOrderStatuses' })

export function _CustomerAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
  return class Customer extends Base {
    declare id?: __.Key<string>
    declare firstName?: string | null
    declare lastName?: string | null
    declare email?: string | null
    declare salesOrders?: __.Association.to.many<SalesOrderHeaders>
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
    declare stock?: number | null
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

export namespace SalesOrderStatuses {
  // enum
  const text_id = {
    completed: "COMPLETED",
    pending: "PENDING",
    rejected: "REJECTED",
  } as const;
  type text_id = "COMPLETED" | "PENDING" | "REJECTED"
  
  export function _textAspect<TBase extends new (...args: any[]) => object>(Base: TBase) {
    return class text extends _sap_common._TextsAspectAspect(Base) {
      declare id?: __.Key<text_id>
      declare description?: string | null
      static id = text_id;
      static override readonly kind: 'entity' | 'type' | 'aspect' = 'entity';
      declare static readonly keys: __.KeysOf<text> & typeof _sap_common.TextsAspect.keys;
      declare static readonly elements: __.ElementsOf<text>;
      declare static readonly actions: typeof _sap_common.TextsAspect.actions & globalThis.Record<never, never>;
    };
  }
  export class text extends _textAspect(__.Entity) {}
  Object.defineProperty(text, 'name', { value: 'sales.SalesOrderStatuses.texts' })
  Object.defineProperty(text, 'is_singular', { value: true })
  export class texts extends Array<text> {$count?: number}
  Object.defineProperty(texts, 'name', { value: 'sales.SalesOrderStatuses.texts' })
  
}
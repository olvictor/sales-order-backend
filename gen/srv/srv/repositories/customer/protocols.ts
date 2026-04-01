import { CustomerModel, typeCustomer } from '@/models/custumer';

export interface CustomerRepository {
    findById(id: typeCustomer['id']): Promise<CustomerModel | null>;
}

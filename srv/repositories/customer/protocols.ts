import { CustomerModel, typeCustomer } from 'srv/models/custumer';

export interface CustomerRepository {
    findById(id: typeCustomer['id']): Promise<CustomerModel | null>;
}

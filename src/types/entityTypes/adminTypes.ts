import { FindAttributeOptions, FindOptions, Order } from "sequelize";
import { PaginationQueryInterface } from "../commonTypes";

interface Permission {
  route: string;
  read: true;
  write: true;
}

interface AdminInterface {
  id?: string;
  name: string;
  username: string;
  password: string;
  permissions: Permission[];
  status?: boolean;
}

interface FetchAdminPaginationQueryInterface extends PaginationQueryInterface {
  status?: boolean;
}

interface FilterAdminInterface extends FindOptions {
  limit?: number;
  offset?: number;
  where?: {
    status?: boolean;
    isPrimary?: boolean;
  };
  order?: Order;
  attributes?: FindAttributeOptions;
}

export {
  AdminInterface,
  FetchAdminPaginationQueryInterface,
  FilterAdminInterface,
  Permission,
};

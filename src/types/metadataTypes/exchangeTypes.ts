import { FindAttributeOptions, FindOptions, Order } from "sequelize";
import { PaginationQueryInterface } from "../commonTypes";

interface MembersInExchangeInterface {
  memberId: string;
  assignedMemberId?: string;
  productTrackingLink?: string;
  orderCreated?: boolean;
}

type ExchangeStatusTypes =
  | "initiated"
  | "in-progress"
  | "completed"
  | "cancelled";
const exchangeStatusEnum = [
  "initiated",
  "in-progress",
  "completed",
  "cancelled",
];

interface ExchangeInterface {
  id?: string;
  month: number;
  members: MembersInExchangeInterface[];
  memberCount: number;
  status: ExchangeStatusTypes;
  createdBy: "admin" | "cron";
}

interface FetchExchangePaginationQueryInterface
  extends PaginationQueryInterface {
  status?: ExchangeStatusTypes;
  month?: number;
  createdBy?: "admin" | "cron";
}

interface FilterExchangeInterface extends FindOptions {
  limit?: number;
  offset?: number;
  where?: {
    status?: ExchangeStatusTypes;
    month?: number;
    createdBy?: "admin" | "cron";
  };
  order?: Order;
  attributes?: FindAttributeOptions;
}

export {
  ExchangeInterface,
  exchangeStatusEnum,
  ExchangeStatusTypes,
  FetchExchangePaginationQueryInterface,
  FilterExchangeInterface,
  MembersInExchangeInterface,
};

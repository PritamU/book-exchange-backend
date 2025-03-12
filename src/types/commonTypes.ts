type SortValueTypes = "ASC" | "DESC";
const sortValueEnum = ["ASC", "DESC"];

interface JwtPayloadInterface {
  id: string;
  name: string;
  exp?: number;
}

interface BasicResponseInterface {
  status: boolean;
  message: string;
}

interface PaginatedResponseData<DataType> {
  count: number;
  hasNext: boolean;
  data: DataType;
}

interface BasicDataResponseInterface<DataType> {
  status: boolean;
  data: DataType;
}

interface PaginationQueryInterface {
  page?: 1;
  limit?: 10;
  sortField?: string;
  sortValue?: SortValueTypes;
}

export {
  BasicDataResponseInterface,
  BasicResponseInterface,
  JwtPayloadInterface,
  PaginatedResponseData,
  PaginationQueryInterface,
  sortValueEnum,
  SortValueTypes,
};

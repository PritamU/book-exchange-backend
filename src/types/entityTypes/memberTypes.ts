import { FindAttributeOptions, FindOptions, Op, Order } from "sequelize";
import { PaginationQueryInterface } from "../commonTypes";
import { InputFieldsInterface } from "../metadataTypes/generalInfoTypes";

type MemberStatusTypes = "pending" | "approved" | "rejected";
const memberStatusEnum = ["pending", "approved", "rejected"];

interface MemberInfoFieldInterface extends InputFieldsInterface {
  value: string | number;
}

interface MemberInterface {
  id?: string;
  name: string;
  username: string;
  password: string;
  status?: MemberStatusTypes;
  userInformation: MemberInfoFieldInterface[];
  telegramChatId?: string;
  // redditUsername?: string;
  // telegramUsername?: string;
  // penName?: string;
  // topBooks?: string;
  // currentGenres?: string;
  // interestedGenres?: string;
  // tbr?: string;
  // authorsToAvoid?: string;
  // preferredLanguages?: string;
  // ageRange?: string;
  // postalAddress?: string;
  // phoneNumber?: string;
  reasonForRejection?: string;
}

interface FetchMemberPaginationQueryInterface extends PaginationQueryInterface {
  status?: MemberStatusTypes;
  searchKey?: string;
}

interface FilterMemberInterface extends FindOptions {
  limit?: number;
  offset?: number;
  where?: {
    status?: MemberStatusTypes;
    [Op.or]?: {
      userInformation: {
        [Op.contains]: { fieldName: string; value: string }[];
      };
    }[];
  };
  order?: Order;
  attributes?: FindAttributeOptions;
}
export {
  FetchMemberPaginationQueryInterface,
  FilterMemberInterface,
  MemberInfoFieldInterface,
  MemberInterface,
  memberStatusEnum,
  MemberStatusTypes,
};

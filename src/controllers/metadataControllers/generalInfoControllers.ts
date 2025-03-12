import { NextFunction, Request, Response } from "express-serve-static-core";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { GeneralInfo } from "../../models/metadataModels/generalInfoModel";
import {
  BasicDataResponseInterface,
  BasicResponseInterface,
} from "../../types/commonTypes";
import { InputFieldsInterface } from "../../types/metadataTypes/generalInfoTypes";

// update input fields data
const updateInputFieldsData = async (
  req: Request<
    {},
    {},
    {
      data: InputFieldsInterface[];
    }
  >,
  res: Response<BasicResponseInterface>,
  next: NextFunction
) => {
  let { data } = req.body;
  try {
    let [affectedCount] = await GeneralInfo.update(
      { data },
      { where: { id: "input_fields" } }
    );

    if (affectedCount === 0) {
      throw new Error("Some Error Occured!");
    }

    let returnObject: BasicResponseInterface = {
      status: true,
      message: "Input Fields Updated!",
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

// fetch general info
const fetchGeneralInfo = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<BasicDataResponseInterface<any>>,
  next: NextFunction
) => {
  let { id } = req.params;
  try {
    let data = await GeneralInfo.findOne({
      where: { id: id },
      raw: true,
    });

    let a = await GeneralInfo.findAll();

    console.log("a", a);

    if (!data) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Data Not Found!"));
    }

    let returnObject: BasicDataResponseInterface<any> = {
      status: true,
      data: data.data,
    };

    return res.json(returnObject);
  } catch (e: any) {
    return next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, e.message));
  }
};

export { fetchGeneralInfo, updateInputFieldsData };

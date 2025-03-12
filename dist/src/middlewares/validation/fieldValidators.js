"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringValidate = exports.pincodeValidate = exports.phoneValidate = exports.passwordValidateWithSimpleMessage = exports.passwordValidate = exports.objectValidate = exports.mongoIdValidate = exports.intValidate = exports.floatValidate = exports.enumValidate = exports.emailValidate = exports.booleanValidate = exports.arrayValidate = void 0;
const express_validator_1 = require("express-validator");
const stringValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isString()
                    .withMessage(`${text} must be String`)
                    .trim();
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isString()
                .withMessage(`${text} must be String`)
                .trim();
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isString()
                    .withMessage(`${text} must be String`)
                    .trim();
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isString()
                .withMessage(`${text} must be String`)
                .trim();
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isString()
                    .withMessage(`${text} must be String`)
                    .trim();
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isString()
                .withMessage(`${text} must be String`)
                .trim();
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.stringValidate = stringValidate;
const intValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isInt()
                    .withMessage(`${text} must be Integer`);
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isInt()
                .withMessage(`${text} must be Integer`);
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isInt()
                    .withMessage(`${text} must be Integer`);
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isInt()
                .withMessage(`${text} must be Integer`);
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isInt()
                    .withMessage(`${text} must be Integer`);
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isInt()
                .withMessage(`${text} must be Integer`);
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.intValidate = intValidate;
const floatValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isFloat()
                    .withMessage(`${text} must be Float`);
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isFloat()
                .withMessage(`${text} must be Float`);
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isFloat()
                    .withMessage(`${text} must be Float`);
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isFloat()
                .withMessage(`${text} must be Float`);
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isFloat()
                    .withMessage(`${text} must be Float`);
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isFloat()
                .withMessage(`${text} must be Float`);
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.floatValidate = floatValidate;
const emailValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isEmail()
                    .withMessage(`${text} must be Email`)
                    .trim();
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isEmail()
                .withMessage(`${text} must be Email`)
                .trim();
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isEmail()
                    .withMessage(`${text} must be Email`)
                    .trim();
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isEmail()
                .withMessage(`${text} must be Email`)
                .trim();
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isEmail()
                    .withMessage(`${text} must be Email`)
                    .trim();
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isEmail()
                .withMessage(`${text} must be Email`)
                .trim();
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.emailValidate = emailValidate;
const passwordValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isStrongPassword()
                    .withMessage(`${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`)
                    .trim();
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isStrongPassword()
                .withMessage(`${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`)
                .trim();
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isStrongPassword()
                    .withMessage(`${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`)
                    .trim();
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isStrongPassword()
                .withMessage(`${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`)
                .trim();
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isStrongPassword()
                    .withMessage(`${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`)
                    .trim();
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isStrongPassword()
                .withMessage(`${text} must be atleast 8 digits with one uppercase, one lowercase, one numeric and one special character`)
                .trim();
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.passwordValidate = passwordValidate;
const passwordValidateWithSimpleMessage = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isStrongPassword()
                    .withMessage(`${text} format invalid!`)
                    .trim();
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} format invalid!`)
                .bail()
                .isStrongPassword()
                .withMessage(`${text} format invalid!`)
                .trim();
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isStrongPassword()
                    .withMessage(`${text} format invalid!`)
                    .trim();
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isStrongPassword()
                .withMessage(`${text} format invalid!`)
                .trim();
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isStrongPassword()
                    .withMessage(`${text} format invalid!`)
                    .trim();
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isStrongPassword()
                .withMessage(`${text} format invalid!`)
                .trim();
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.passwordValidateWithSimpleMessage = passwordValidateWithSimpleMessage;
const mongoIdValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text).optional().isMongoId().withMessage(`Invalid ${text}`);
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isMongoId()
                .withMessage(`Invalid ${text}`);
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isMongoId()
                    .withMessage(`Invalid ${text}`);
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isMongoId()
                .withMessage(`Invalid ${text}`);
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isMongoId()
                    .withMessage(`Invalid ${text}`);
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isMongoId()
                .withMessage(`Invalid ${text}`);
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.mongoIdValidate = mongoIdValidate;
const enumValidate = (source, text, optional, array) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isIn(array)
                    .withMessage(`Invalid ${text}`)
                    .trim();
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isIn(array)
                .withMessage(`Invalid ${text}`)
                .trim();
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isIn(array)
                    .withMessage(`Invalid ${text}`)
                    .trim();
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isIn(array)
                .withMessage(`Invalid ${text}`)
                .trim();
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isIn(array)
                    .withMessage(`Invalid ${text}`)
                    .trim();
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isIn(array)
                .withMessage(`Invalid ${text}`)
                .trim();
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.enumValidate = enumValidate;
const booleanValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isBoolean()
                    .withMessage(`Invalid ${text}`)
                    .toBoolean();
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isBoolean()
                .withMessage(`Invalid ${text}`)
                .toBoolean();
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isBoolean()
                    .withMessage(`Invalid ${text}`)
                    .toBoolean();
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isBoolean()
                .withMessage(`Invalid ${text}`)
                .toBoolean();
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isBoolean()
                    .withMessage(`Invalid ${text}`)
                    .toBoolean();
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isBoolean()
                .withMessage(`Invalid ${text}`)
                .toBoolean();
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.booleanValidate = booleanValidate;
const arrayValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isArray()
                    .withMessage(`${text} must be an array`);
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isArray()
                .withMessage(`${text} must be an array`);
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isArray()
                    .withMessage(`${text} must be an array`);
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isArray()
                .withMessage(`${text} must be an array`);
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isArray()
                    .withMessage(`${text} must be an array`);
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isArray()
                .withMessage(`${text} must be an array`);
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.arrayValidate = arrayValidate;
const objectValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isObject()
                    .withMessage(`${text} must be an object`);
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isObject()
                .withMessage(`${text} must be an object`);
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isObject()
                    .withMessage(`${text} must be an object`);
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isObject()
                .withMessage(`${text} must be an object`);
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isObject()
                    .withMessage(`${text} must be an object`);
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isObject()
                .withMessage(`${text} must be an object`);
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.objectValidate = objectValidate;
const phoneValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isLength({ min: 10, max: 10 })
                    .withMessage(`${text} must be a 10 digit number!`)
                    .isNumeric()
                    .withMessage(`${text} must be numeric!`);
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isLength({ min: 10, max: 10 })
                .withMessage(`${text} must be a 10 digit number!`)
                .isNumeric()
                .withMessage(`${text} must be numeric!`);
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isLength({ min: 10, max: 10 })
                    .withMessage(`${text} must be a 10 digit number!`)
                    .isNumeric()
                    .withMessage(`${text} must be numeric!`);
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isLength({ min: 10, max: 10 })
                .withMessage(`${text} must be a 10 digit number!`)
                .isNumeric()
                .withMessage(`${text} must be numeric!`);
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isLength({ min: 10, max: 10 })
                    .withMessage(`${text} must be a 10 digit number!`)
                    .isNumeric()
                    .withMessage(`${text} must be numeric!`);
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isLength({ min: 10, max: 10 })
                .withMessage(`${text} must be a 10 digit number!`)
                .isNumeric()
                .withMessage(`${text} must be numeric!`);
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.phoneValidate = phoneValidate;
const pincodeValidate = (source, text, optional) => {
    switch (source) {
        case "body":
            if (optional) {
                return (0, express_validator_1.body)(text)
                    .optional()
                    .isLength({ min: 6, max: 6 })
                    .withMessage(`${text} must be a 6 digit number!`)
                    .isNumeric()
                    .withMessage(`${text} must be numeric!`);
            }
            return (0, express_validator_1.body)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isLength({ min: 6, max: 6 })
                .withMessage(`${text} must be a 6 digit number!`)
                .isNumeric()
                .withMessage(`${text} must be numeric!`);
        case "query":
            if (optional) {
                return (0, express_validator_1.query)(text)
                    .optional()
                    .isLength({ min: 6, max: 6 })
                    .withMessage(`${text} must be a 6 digit number!`)
                    .isNumeric()
                    .withMessage(`${text} must be numeric!`);
            }
            return (0, express_validator_1.query)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isLength({ min: 6, max: 6 })
                .withMessage(`${text} must be a 6 digit number!`)
                .isNumeric()
                .withMessage(`${text} must be numeric!`);
        case "param":
            if (optional) {
                return (0, express_validator_1.param)(text)
                    .optional()
                    .isLength({ min: 6, max: 6 })
                    .withMessage(`${text} must be a 6 digit number!`)
                    .isNumeric()
                    .withMessage(`${text} must be numeric!`);
            }
            return (0, express_validator_1.param)(text)
                .notEmpty()
                .withMessage(`${text} Required`)
                .bail()
                .isLength({ min: 6, max: 6 })
                .withMessage(`${text} must be a 6 digit number!`)
                .isNumeric()
                .withMessage(`${text} must be numeric!`);
        default:
            console.log(`Default validator case for ${text} in ${source}`);
    }
};
exports.pincodeValidate = pincodeValidate;

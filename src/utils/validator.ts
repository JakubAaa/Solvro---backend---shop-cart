import * as yup from 'yup'
import {NextFunction, Request, Response} from "express";
import {ValidationError} from "../error/error.module";

export const validate = (schema: yup.ObjectSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction) =>
        schema.validate(req.body)
            .then(() => next())
            .catch((error: yup.ValidationError) => {
                throw new ValidationError(error.path || "Unrecognized validation error", error.value, error.errors)
            })
}
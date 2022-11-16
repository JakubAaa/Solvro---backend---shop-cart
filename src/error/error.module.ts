import { ErrorCodes } from './error.codes'
import { ErrorDatas } from './error.datas'

export interface AppError {
  status: number,
  code: string,
  data: string
}

export class ResourceNotFound implements AppError {
  status = 404
  code = ErrorCodes.RESOURCE_NOT_FOUND
  data = ErrorDatas.RESOURCE_NOT_FOUND
}

export class ValidationError implements AppError {
  status = 400
  code = ErrorCodes.VALIDATION_ERROR
  data

  constructor (private path: string, private inputValue: string, private validationErrors?: string[]) {
    this.data = `${JSON.stringify(inputValue)} is not assignable to required type, ${validationErrors}`
  }
}

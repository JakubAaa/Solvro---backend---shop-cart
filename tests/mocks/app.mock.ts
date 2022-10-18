import * as bodyParser from "body-parser";
import express from "express"
import {errorHandler} from "../../src/error/error.handler";
import {Controller} from "../../src/utils/controller";
import {authenticateUser} from "../../src/auth/auth.request.interface";

require('express-async-errors');

export const appMock = (controller: Controller) => express()
    .use(bodyParser.json())
    .use(authenticateUser) // just for demo use
    .use(controller.router)
    .use(errorHandler)
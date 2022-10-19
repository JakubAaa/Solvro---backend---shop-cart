import * as bodyParser from "body-parser";
import express from "express"
import {errorHandler} from "../../src/error/error.handler";
import {Controller} from "../../src/utils/controller";
import {authenticateDemoUser} from "../../src/auth/auth.request";

require('express-async-errors');

export const appMock = (controller: Controller) => express()
    .use(bodyParser.json())
    .use(authenticateDemoUser)
    .use(controller.router)
    .use(errorHandler)
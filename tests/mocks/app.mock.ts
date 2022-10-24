import * as bodyParser from "body-parser";
import express from "express"
import {errorHandler} from "../../src/error/error.handler";
import {Controller} from "../../src/utils/controller";
import {authenticateDemoUser} from "../../src/auth/auth.request";

export const DIFFERENT_USER_ID = 'DifferentId'

require('express-async-errors');

export const appMock = (controller: Controller, userId: string) => express()
    .use(bodyParser.json())
    .use(authenticateDemoUser(userId))
    .use(controller.router)
    .use(errorHandler)

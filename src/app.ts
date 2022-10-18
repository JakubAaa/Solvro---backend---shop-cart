import express from 'express';
import {errorHandler} from "./error/error.handler";

export const app = express()
    .use(express.json())
    .use(errorHandler)


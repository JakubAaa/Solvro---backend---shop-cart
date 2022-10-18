import express from 'express';
import {errorHandler} from "./error/error.handler";
import {CartController} from "./cart/cart.controller";
import {CartService} from "./cart/cart.service";
import {authenticateUser} from "./auth/auth.request";

export const cartController = new CartController(new CartService()).router;

export const app = express()
    .use(express.json())
    .use(authenticateUser) // just for demo use
    .use(cartController)
    .use(errorHandler)


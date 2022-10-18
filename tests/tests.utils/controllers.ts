import {CartService} from "../../src/cart/cart.service";
import {CartController} from "../../src/cart/cart.controller";

const cartService = new CartService();

export const cartController = new CartController(cartService);
import {Request} from "express";

export interface AuthRequest extends Request {
    user: AuthUser,
    page: number
}

export interface AuthUser {
    id: string,
    name: string,
    cartId: string
}
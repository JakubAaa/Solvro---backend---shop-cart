import {NextFunction, Request, Response} from "express";

export const DEFAULT_USER_ID = '1';

export interface AuthRequest extends Request {
    user: AuthUser
}

export interface AuthUser {
    id: string
}

export const authenticateDemoUser = (id:string) => (req: AuthRequest, res: Response, next: NextFunction) => {
    req.user = {id};
    next();
}
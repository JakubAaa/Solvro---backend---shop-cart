import {NextFunction, Request, Response} from "express";

export const DEFAULT_USER_ID = '1';

export interface AuthRequest extends Request {
    user: AuthUser
}

export interface AuthUser {
    id: string
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) =>{  //middleware just for demo use
    req.user = {id: DEFAULT_USER_ID};
    next();
}
import { Request, Response, NextFunction } from 'express';
interface UserDecoded {
    id: string;
    email: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: UserDecoded;
        }
    }
}
export declare const currentUser: (req: Request, res: Response, next: NextFunction) => void;
export {};

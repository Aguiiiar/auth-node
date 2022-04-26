import { Request, Response, NextFunction } from "express"
import JWT from "jsonwebtoken";
import { User } from "../models/User";

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        let sucess = false;

        // Fazer verificação auth

        if (req.headers.authorization) {
            const [authType, token] = req.headers.authorization.split(" ");

            if (authType === 'Bearer') {
                try {
                    JWT.verify(token, process.env.JWT_TOKEN as string);

                    sucess = true;
                } catch (error) { }
            }
        }

        if (sucess) {
            next();
        } else {
            return res.status(403).json({ error: "Não autorizado" });
        }
    }
}
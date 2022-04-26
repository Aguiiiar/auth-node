import { Request, Response } from 'express';
import JWT from "jsonwebtoken";
import { User } from '../models/User';

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true });
}

export const register = async (req: Request, res: Response) => {
    let { email, password } = req.body;
    if (email && password) {

        let hasUser = await User.findOne({ where: { email } });
        if (!hasUser) {
            let newUser = await User.create({ email, password });

            return res.status(201).json({ id: newUser.id });
        } else {
            return res.json({ error: 'E-mail já existe.' });
        }
    }
    res.json({ error: 'E-mail e/ou senha não enviados.' });
}

export const login = async (req: Request, res: Response) => {
    let { email, password } = req.body;
    if (email && password) {

        let user = await User.findOne({
            where: { email, password }
        });

        if (user) {
            const token = JWT.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_TOKEN as string,
                {
                    expiresIn: "2h"
                }
            )
            res.json({ status: true, token });
            return;
        }
    }

    res.json({ status: false });
}

export const list = async (req: Request, res: Response) => {
    let users = await User.findAll();
    let list: string[] = [];

    if (!users) {
        return res.json({ error: "Nada aqui" })
    } else {
        for (let i in users) {
            list.push(users[i].email);
        }

        res.json({ list });
    }
}
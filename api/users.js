import express from "express";
const usersRouter = express.Router();

import { userRegister, getUserByUsernameAndPassword } from '#db/queries/users';
import requireBody from '#middleware/requireBody';
import { createToken } from '#utils/jwt';

usersRouter.post('/register', 
    requireBody(['username', 'password']), async (req, res) => {
        const { username, password } = req.body;
        const user = await userRegister(username, password);

        const token = await createToken({ id: user.id });
        res.status(201).send(token);
    }
);

usersRouter.post('/login',
    requireBody(['username', 'password']), async (req, res) => {
        const { username, password } = req.body;
        const user = await getUserByUsernameAndPassword(username, password);

        if (!user) {
           return res.status(401).send('Invalid username or password.');
        }

        const token = await createToken({ id: user.id });
        res.send(token);
    }
);

export default usersRouter;
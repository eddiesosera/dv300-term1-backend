import express from "express";
import AppDataSource from "../dataSource";
import { User } from "../models/user.model";

const userRouter = express.Router()
const appDataSource = AppDataSource

userRouter.use(express.json());

// Get All
userRouter.get('/', async (req, res) => {
    try {
        console.log('User: Im being requested')
        const users = await appDataSource
            .getRepository(User)
            .find();

        res.json(users)

    } catch (error) {
        console.log('Error fetching Users: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

// Get Single
userRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await appDataSource.getRepository(User)
            .createQueryBuilder("users")
            .where("users.id = :id", { id: id })
            .getOne()

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);

    } catch (error) {
        console.log('Error fetching user: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});


export default userRouter


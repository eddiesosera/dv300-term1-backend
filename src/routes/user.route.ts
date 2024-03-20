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
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.skateboard', 'skateboard')
            .leftJoinAndSelect('users.location', 'location')
            .getMany();

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
        const user = await appDataSource
            .getRepository(User)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.skateboard', 'skateboard')
            .leftJoinAndSelect('users.location', 'location')
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

// Insert (Create) User
userRouter.post('/', async (req, res) => {
    try {

        const newUser = req.body

        console.log("Trying to create the user: ", newUser)

        const createdUser = await appDataSource
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({ dateJoined: Date(), ...newUser })
            .execute().then((user) => {
                let newUserId = user.identifiers[0].id
                console.log("Created New User ID: ", newUserId)
            })

        res.json("Created New User: " + createdUser)

    } catch (error) {
        console.log('Error creating User: ', error)
        res.status(500).json({ error: 'Could not create User account. Internal server error' })
    }
})

// Delete Single User
userRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Delete User
        const userDelete = await appDataSource.getRepository(User)
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("id = :id", { id: id })
            .execute()

        res.json("Successfully removed User. " + JSON.stringify(userDelete))

    } catch (error) {
        console.log('Error deleting user: ', error)
        res.status(500).json({ error: 'Internal server error while deleting user' })
    }
});


export default userRouter


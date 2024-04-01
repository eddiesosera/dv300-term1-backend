import express from "express";
import AppDataSource from "../dataSource";
import { User } from "../models/user.model";
import * as bcrypt from 'bcrypt';

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
            .leftJoinAndSelect('users.location', 'User')
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

        const { password, ...newUser } = req.body

        console.log("Trying to create the user: ", newUser);

        // Password hashing
        const salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(password, salt)

        const createdUser = await appDataSource
            .getRepository(User)
            .save({ dateJoined: Date(), password: newPassword, ...newUser })

        res.json("Created New User: " + JSON.stringify(createdUser))

    } catch (error) {
        console.log('Error creating User: ', error)
        res.status(500).json({ error: 'Could not create User account. Internal server error' })
    }
});

// Update User
userRouter.patch('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, surname, email, avatar, password, isEmailVerified, location } = req?.body;

        // Find Single User Item
        const userItem = await
            appDataSource.getRepository(User).findOneBy({ id: id })

        // Update User Properties
        userItem!.name = name;
        userItem!.surname = surname;
        userItem!.email = email;
        userItem!.avatar = avatar;
        userItem!.password = password;
        userItem!.isEmailVerified = isEmailVerified;
        userItem!.location = location;

        console.log("Updated User", userItem)

        // Update the user item
        const updatedItem = await appDataSource
            .getRepository(User)
            .save(userItem!)

        res.json(updatedItem)

    } catch (error) {
        console.log('Error updating User: ', error)
        res.status(500).json({ error: 'Internal server error while updating User' })
    }
});

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


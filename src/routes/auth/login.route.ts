import express from "express";
import AppDataSource from "../../dataSource";
import { User } from "../../models/user.model";
import * as bcrypt from 'bcrypt';

const authRouter = express.Router()
const appDataSource = AppDataSource

authRouter.use(express.json());

// Login User
authRouter.post('/login', async (req, res) => {
    try {
        // console.log('Request body: ', req.body)
        const { email, password } = req.body;
        let isPasswordMatched = false;

        // Find Single User Item
        const userItem = await
            appDataSource
                .getRepository(User)
                .createQueryBuilder('users')
                .leftJoinAndSelect('users.location', 'User')
                .where({ email: email })
                .getOne();

        if (!userItem) {
            res.json({ message: "User does not exist." })
        } else {

            console.log('Email: ' + email, 'Password: ' + password);

            // Check if password matches
            bcrypt.compare(password, userItem!.password).then(function (result) {
                console.log("Password matched: " + result)
                isPasswordMatched = result

                // If email and password matches then return user else throw error
                if (userItem?.email === email && isPasswordMatched) {
                    const userWithoutPassword: Partial<User> = { ...userItem };
                    delete userWithoutPassword.password;
                    res.json({ message: "Success", user: JSON.stringify(userWithoutPassword) })
                } else if (userItem?.password !== password) {
                    res.json({ message: "Bad credentials. Try again" })
                }
            }).catch(err => {
                res.json({ message: `Bcrypt failed because: ${err}` })
            })
        }

    } catch (error) {
        console.log('Error updating User: ', error)
        res.status(500).json({ error: 'Internal server error while updating User' })
    }
});


export default authRouter

import express from "express";
import AppDataSource from "../../dataSource";
import { User } from "../../models/user.model";

const authRouter = express.Router()
const appDataSource = AppDataSource

authRouter.use(express.json());

// Login User
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find Single User Item
        const userItem = await
            appDataSource.getRepository(User).findOneBy({ email: email });

        if (!userItem) {
            res.json("User does not exist.")
        }

        if (userItem?.email === email && userItem?.password === password) {
            res.json({ status: "Success", user: JSON.stringify(userItem) })
        } else if (userItem?.password !== password) {
            res.json({ ok: "Bad credentials. Try again" })
        }

        console.log("Updated User", userItem)
        res.json(userItem)

    } catch (error) {
        console.log('Error updating User: ', error)
        res.status(500).json({ error: 'Internal server error while updating User' })
    }
});


export default authRouter

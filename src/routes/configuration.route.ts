import express from "express";
import AppDataSource from "../dataSource";
import { Configuration } from "../models/configuration.model";

const configurationRouter = express.Router()
const appDataSource = AppDataSource

configurationRouter.use(express.json());

// Get All
configurationRouter.get('/', async (req, res) => {
    try {
        console.log('Config: Im being requested')
        const items = await appDataSource
            .getRepository(Configuration)
            .find();

        res.json(items)

    } catch (error) {
        console.log('Error fetching config: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});


export default configurationRouter


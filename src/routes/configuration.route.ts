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
            .createQueryBuilder('configuration')
            .leftJoinAndSelect('configuration.board_type', 'skateboards')
            .getMany();

        res.json(items)

    } catch (error) {
        console.log('Error fetching config: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

// Get Single
configurationRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const configuration = await appDataSource.getRepository(Configuration)
            .createQueryBuilder("configuration")
            .where("configuration.id = :id", { id: id })
            .getOne()

        if (!configuration) {
            return res.status(404).json({ error: 'Configuration not found' });
        }

        res.json(configuration);

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});


export default configurationRouter


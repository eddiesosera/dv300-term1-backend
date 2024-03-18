import express from "express";
import AppDataSource from "../dataSource";
import { Location } from "../models/location.model";
import { Skateboard } from "../models/skateboard.model";

const skateboardRouter = express.Router()
const appDataSource = AppDataSource

skateboardRouter.use(express.json());

// Get All
skateboardRouter.get('/', async (req, res) => {
    try {
        console.log('Im being requested: Skateboard')
        const items = await appDataSource.getRepository(Skateboard).find();
        res.json(items)
    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

// Get Single
skateboardRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await appDataSource.getRepository(Skateboard)
            .createQueryBuilder("skateboard")
            .where("skateboard.id :id", { id: id })
    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

// Insert Single
skateboardRouter.post('/', async (req, res) => {
    try {

        const newSkateboard = req.body

        await appDataSource
            .createQueryBuilder()
            .insert()
            .into(Skateboard)
            .values([newSkateboard])
            .execute()
    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Update Single
skateboardRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { price } = req.body;
        const { avatar } = req.body;
        const { configuration } = req.body;

        // Find Single Item
        const skateboardItem = await
            appDataSource.getRepository(Skateboard).findOneBy({ id: id })

        if (!skateboardItem) {
            res.status(400).json({ message: 'No Item found' })
        }

        // Update Properties
        skateboardItem!.price = price
        skateboardItem!.price = avatar
        skateboardItem!.configuration = configuration

        const updatedItem = await appDataSource.getRepository(Skateboard).save(skateboardItem!);
        res.json(updatedItem)

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Delete Single
skateboardRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await appDataSource.getRepository(Skateboard)
            .createQueryBuilder()
            .delete()
            .from(Skateboard)
            .where("id = :id", { id: id })
            .execute()
    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

export default skateboardRouter


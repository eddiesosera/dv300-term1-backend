import express from "express";
import AppDataSource from "../dataSource";
import { Location } from "../models/location.model";


const locationRouter = express.Router()

locationRouter.use(express.json());

const appDataSource = AppDataSource

// Get All
locationRouter.get('/', async (req, res) => {
    try {
        console.log('Im being requested')
        const items = await appDataSource.getRepository(Location).find();
        res.json(items)
    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

// Update Single
locationRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { amount } = req.body;

        // Find single item
        const locationItem = await
            appDataSource.getRepository(Location).findOneBy({ id: id })
        // res.json(locationItem);

        if (!locationItem) {
            res.status(400).json({ message: 'No Item found' })
        }

        // update vars
        locationItem!.stockAmount = amount
        // update all the vars of Location  that you want
        const updatedItem = await appDataSource.getRepository(Location).save(locationItem!);
        res.json(updatedItem)

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

export default locationRouter


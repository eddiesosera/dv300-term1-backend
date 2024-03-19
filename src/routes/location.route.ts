import express from "express";
import AppDataSource from "../dataSource";
import { Location } from "../models/location.model";

const locationRouter = express.Router()
const appDataSource = AppDataSource

locationRouter.use(express.json());

// Get All
locationRouter.get('/', async (req, res) => {
    try {
        console.log('Im being requested')
        const items = await appDataSource
            .getRepository(Location)
            .createQueryBuilder('location')
            .leftJoinAndSelect('location.skateboards', 'skateboards')
            .leftJoinAndSelect('location.users', 'users')
            .getMany();

        res.json(items)

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

// Get Single Location
locationRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const location = await appDataSource.getRepository(Location)
            .createQueryBuilder("location")
            .leftJoinAndSelect('location.skateboards', 'skateboards')
            .leftJoinAndSelect('location.users', 'users')
            .where("location.id = :id", { id: id })
            .getOne()

        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        res.json(location);

    } catch (error) {
        console.log('Error fetching Location: ', error)
        res.status(500).json({ error: 'Internal server error fetching Location' })
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

// Delete Single Location
locationRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Delete Location
        const locationDelete = await appDataSource.getRepository(Location)
            .createQueryBuilder()
            .delete()
            .from(Location)
            .where("id = :id", { id: id })
            .execute()

        res.json("Successfully removed Location. " + JSON.stringify(locationDelete))

    } catch (error) {
        console.log('Error deleting location: ', error)
        res.status(500).json({ error: 'Internal server error while deleting location' })
    }
});


export default locationRouter


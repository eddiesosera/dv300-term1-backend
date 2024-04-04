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
            .leftJoinAndSelect('skateboards.configuration', 'configuration')
            .leftJoinAndSelect('location.skins', 'skins')
            .leftJoinAndSelect('location.trucks', 'trucks')
            .leftJoinAndSelect('location.wheels', 'wheels')
            .leftJoinAndSelect('location.bearings', 'bearings')
            .leftJoinAndSelect('location.board_type', 'board_type')

            .leftJoinAndSelect('configuration.board_type', 'board_type')
            // .leftJoinAndSelect('skateboards.craftedBy')
            .leftJoinAndSelect('skateboards.stockNeeded', 'stockNeeded')
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

// Insert (Create) Location
locationRouter.post('/', async (req, res) => {
    try {

        const newLocation = req.body

        console.log("Trying to create the location: ", newLocation)

        await appDataSource
            .createQueryBuilder()
            .insert()
            .into(Location)
            .values(newLocation)
            .execute().then((location) => {
                let newLocationId = location.identifiers[0].id
                console.log("Created New Location ID: ", newLocationId)
                res.json("Created New Location: " + newLocationId)
            })

    } catch (error) {
        console.log('Error creating Location: ', error)
        res.status(500).json({ error: 'Could not create Location account. Internal server error' })
    }
})

// Update Single Location
locationRouter.patch('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, city, description } = req.body;

        // Find Single Location Item
        const locationItem = await
            appDataSource.getRepository(Location).findOneBy({ id: id })

        // Update Location Properties
        locationItem!.name = name;
        locationItem!.city = city;
        locationItem!.description = description;

        console.log("Updated Location", locationItem)

        const updatedItem = await appDataSource
            .getRepository(Location)
            .save(locationItem!)

        res.json(updatedItem)

    } catch (error) {
        console.log('Error updating Location: ', error)
        res.status(500).json({ error: 'Internal server error while updating Location' })
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


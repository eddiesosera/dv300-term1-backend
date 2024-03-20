import express from "express";
import AppDataSource from "../dataSource";
import { StockNeeded } from "../models/stockNeeded.model";

const stockNeededRouter = express.Router()
const appDataSource = AppDataSource

stockNeededRouter.use(express.json());

// Get All
stockNeededRouter.get('/', async (req, res) => {
    try {
        console.log('Im being requested')
        const items = await appDataSource
            .getRepository(StockNeeded)
            .createQueryBuilder('stockNeeded')
            .leftJoinAndSelect('stockNeeded.skateboards', 'skateboards')
            .getMany();

        res.json(items)

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

// Get Single StockNeeded
stockNeededRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const stockNeeded = await appDataSource.getRepository(StockNeeded)
            .createQueryBuilder("stockNeeded")
            .leftJoinAndSelect('stockNeeded.skateboards', 'skateboards')
            .where("stockNeeded.id = :id", { id: id })
            .getOne()

        if (!stockNeeded) {
            return res.status(404).json({ error: 'Stock needed not found' });
        }

        res.json(stockNeeded);

    } catch (error) {
        console.log('Error fetching Stock needed: ', error)
        res.status(500).json({ error: 'Internal server error fetching StockNeeded' })
    }
});

// Insert (Create) StockNeeded
stockNeededRouter.post('/', async (req, res) => {
    try {

        const newLocation = req.body

        console.log("Trying to create the stock needed: ", newLocation)

        await appDataSource
            .createQueryBuilder()
            .insert()
            .into(StockNeeded)
            .values(newLocation)
            .execute().then((stockNeeded) => {
                let newLocationId = stockNeeded.identifiers[0].id
                console.log("Created New Stock needed ID: ", newLocationId)
                res.json("Created New Stock needed: " + newLocationId)
            })

    } catch (error) {
        console.log('Error creating Stock Needed: ', error)
        res.status(500).json({ error: 'Could not create StockNeeded item. Internal server error' })
    }
})

// Update Single StockNeeded
stockNeededRouter.patch('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { skateboard_type, board_type, board_skin, trucks, wheels, bearings } = req.body;

        // Find Single StockNeeded Item
        const stockNeededItem = await
            appDataSource.getRepository(StockNeeded).findOneBy({ id: id })

        // Update StockNeeded Properties
        stockNeededItem!.skateboard_type = skateboard_type;
        stockNeededItem!.board_type = board_type;
        stockNeededItem!.board_skin = board_skin;
        stockNeededItem!.trucks = trucks;
        stockNeededItem!.wheels = wheels;
        stockNeededItem!.bearings = bearings;

        console.log("Updated StockNeeded", stockNeededItem)

        const updatedItem = await appDataSource
            .getRepository(StockNeeded)
            .save(stockNeededItem!)

        res.json(updatedItem)

    } catch (error) {
        console.log('Error updating StockNeeded: ', error)
        res.status(500).json({ error: 'Internal server error while updating StockNeeded' })
    }
})

// Delete Single StockNeeded
stockNeededRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Delete StockNeeded
        const locationDelete = await appDataSource.getRepository(StockNeeded)
            .createQueryBuilder()
            .delete()
            .from(StockNeeded)
            .where("id = :id", { id: id })
            .execute()

        res.json("Successfully removed StockNeeded. " + JSON.stringify(locationDelete))

    } catch (error) {
        console.log('Error deleting stockNeeded: ', error)
        res.status(500).json({ error: 'Internal server error while deleting stockNeeded' })
    }
});


export default stockNeededRouter


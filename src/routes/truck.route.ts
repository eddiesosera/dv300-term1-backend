// the truck route for backend 
import express from "express";
import AppDataSource from "../dataSource";
import { Truck } from "../models/truck.model" // ? this needs to import the data from the entity folder
import { Location } from "../models/location.model";
import { Configuration } from "../models/configuration.model";

const truckRouter = express.Router()
const appDataSource = AppDataSource

truckRouter.use(express.json())

// todo : Get all trucks
truckRouter.get('/', async (req, res) => {
    try {
        console.log('all trucks being requested')
        const items = await appDataSource
            .getRepository(Truck) // ? not sure waht else i should add here
        res.json(items)
    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server error' })
    }
});

// todo : Get single truck
truckRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const truck = await appDataSource
            .getRepository(Truck)
        // .getOne()

        if (!truck) {
            return res.status(404).json({ error: 'truck not found' })
        }

        res.json(truck);

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server erro' })
    }
});

// todo : Insert Single truck

// todo : Update Single truck
truckRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // todo : this needs to be changed
        const { type } = req.body;
        const { size } = req.body;
        const { price } = req.body;
        const { stiffness } = req.body;

        // ? find single truck item ?
        const truckItem = await
            appDataSource
                .getRepository(Truck) // ?
                .createQueryBuilder("truck")
                .leftJoinAndSelect('trucks.configuration', 'configuration')
                .where("trucks.id = :id", { id: id })
                .getOne()

        // ? find single configuration item ?

        if (!truckItem) {
            res.status(400).json({ message: 'no item found' })
        }

        // todo : this need to be fixed
        // update truck properties
        truckItem!.price = price
        // truckItem!.color = color // *
        truckItem!.stiffness = stiffness
        // truckItem!.avatar = avatar // *

        console.log("Updated truck", truckItem) // ? check this 

        const updatedItem = await appDataSource
            .getRepository(Truck)
            .save(truckItem!)

        // await appDataSource // this is for the configuration ?

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: ' internal server error' })
    }
});

// todo : Delete single truck
truckRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // get truck
        await appDataSource.getRepository(Truck)
            .createQueryBuilder("trucks") // ? 
            // .leftJoinAndSelect('') // ? do i have to add this or is it obly for configurations
            .where("trucks.id = :id", { id: id })
            .getOne().then(async (truckbd: any) => {
                // ? what is sktbd ?
                console.log("DELETE TRUCKBD:", truckbd)

                // delete truck
                const truckDelete = await appDataSource.getRepository(Truck)
                    .createQueryBuilder()
                    .delete()
                    .from(Truck)
                    .where("id = :id", { id: id })
                    .execute()

                res.json("successfully removed truck." + JSON.stringify(truckDelete))
            })

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});




export default truckRouter
// the wheel route for backend 
import express from "express";
import AppDataSource from "../dataSource";
import { Bearing } from "../models/bearing.model" // ? this needs to import the data from the entity folder
import { Location } from "../models/location.model";
import { Configuration } from "../models/configuration.model";

const bearingRouter = express.Router()
const appDataSource = AppDataSource

bearingRouter.use(express.json())

// * : Get all bearings
bearingRouter.get('/', async (req, res) => {
    try {
        console.log('all bearings being requested')
        const items = await appDataSource.getRepository(Bearing).find()
        res.json(items)
    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server error' })
    }
});

// * : Get single bearing
bearingRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const bearing = await appDataSource
            .getRepository(Bearing)
        // .getOne()

        if (!bearing) {
            return res.status(404).json({ error: 'bearing not found' })
        }

        res.json(bearing);

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server erro' })
    }
});

// todo : Insert Single bearing

// todo : Update Single bearing
bearingRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        const { brand } = req.body;
        const { avatar } = req.body;
        const { price } = req.body;
        const { color } = req.body;

        // ? find single bearing item ?
        const bearingItem = await
            appDataSource
                .getRepository(Bearing) // ?
                .createQueryBuilder("bearing")
                .leftJoinAndSelect('bearings.configuration', 'configuration')
                .where("bearings.id = :id", { id: id })
                .getOne()

        // ? find single configuration item ?

        if (!bearingItem) {
            res.status(400).json({ message: 'no item found' })
        }

        // update bearing properties
        bearingItem!.brand = brand
        bearingItem!.color = color
        bearingItem!.price = price
        bearingItem!.avatar = avatar
        

        console.log("Updated bearing", bearingItem) // ? check this 

        const updatedItem = await appDataSource
            .getRepository(Bearing)
            .save(bearingItem!)

        // await appDataSource // this is for the configuration ?

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: ' internal server error' })
    }
});

// todo : Delete single Bearing
bearingRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // get bearing
        await appDataSource.getRepository(Bearing)
            .createQueryBuilder("bearings") // ? 
            // .leftJoinAndSelect('') // ? do i have to add this or is it obly for configurations
            .where("bearings.id = :id", { id: id })
            .getOne().then(async (bearingbd: any) => {
                // ? what is sktbd ?
                console.log("DELETE BEARINGBD:", bearingbd)

                // delete bearing
                const bearingDelete = await appDataSource.getRepository(Bearing)
                    .createQueryBuilder()
                    .delete()
                    .from(Bearing)
                    .where("id = :id", { id: id })
                    .execute()

                res.json("successfully removed bearing." + JSON.stringify(bearingDelete))
            })

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

export default bearingRouter
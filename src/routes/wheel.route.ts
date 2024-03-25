// the wheel route for backend 
import express from "express";
import AppDataSource from "../dataSource";
import { Wheel } from "../models/wheel.model" // ? this needs to import the data from the entity folder
import { Location } from "../models/location.model";
import { Configuration } from "../models/configuration.model";


const wheelRouter = express.Router()
const appDataSource = AppDataSource

wheelRouter.use(express.json())

// todo : Get all Wheels 
wheelRouter.get('/', async (req, res) => {
    try {
        console.log('all wheels being requested')
        const items = await appDataSource.getRepository(Wheel).find()
        res.json(items)
    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server error' })
    }
});

// todo : Get single wheel
wheelRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const wheel = await appDataSource
            .getRepository(Wheel)
        // .getOne()

        if (!wheel) {
            return res.status(404).json({ error: 'wheel not found' })
        }

        res.json(wheel);

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server erro' })
    }
});

// todo : Insert Single Wheel
wheelRouter.post('/', async (req, res) => {
    try {
        const { userId, ...newWheel } = req.body

        // let configId: a
    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})


// todo : Update Single Wheel
wheelRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        const { type } = req.body;
        const { size } = req.body;
        const { price } = req.body;

        // ? find single wheel item ?
        const wheelItem = await
            appDataSource
                .getRepository(Wheel) // ? (Wheel) = does this fetch from the model
                .createQueryBuilder("wheels")
                .leftJoinAndSelect('wheels.configuration', 'configuration')
                .where("wheels.id = :id", { id: id })
                .getOne()

        // ? find single configuration item ?

        if (!wheelItem) {
            res.status(400).json({ message: 'no item found' })
        }

        // update wheel properties
        wheelItem!.name = name
        wheelItem!.price = price
        wheelItem!.size = size
        wheelItem!.type = type

        console.log("Updated wheel", wheelItem) // ? check this 

        const updatedItem = await appDataSource
            .getRepository(Wheel)
            .save(wheelItem!)

        // await appDataSource // this is for the configuration ?

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: ' internal server error' })
    }
});

// todo : Delete single wheel
wheelRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // get wheel
        await appDataSource.getRepository(Wheel)
            .createQueryBuilder("wheels") // ? 
            // .leftJoinAndSelect('') // ? do i have to add this or is it obly for configurations
            .where("wheels.id = :id", { id: id })
            .getOne().then(async (wheelbd: any) => {
                // ? what is sktbd ?
                console.log("DELETE WHEELBD:", wheelbd)

                // delete wheel 
                const wheelDelete = await appDataSource.getRepository(Wheel)
                    .createQueryBuilder()
                    .delete()
                    .from(Wheel)
                    .where("id = :id", { id: id })
                    .execute()

                res.json("successfully removed wheel." + JSON.stringify(wheelDelete))
            })

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

export default wheelRouter
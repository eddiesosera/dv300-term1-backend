// the wheel route for backend 
import express from "express";
import AppDataSource from "../dataSource";
import { Wheel } from "../models/wheel.model" // ? this needs to import the data from the entity folder
import { Location } from "../models/location.model";
import { Configuration } from "../models/configuration.model";


const wheelRouter = express.Router()
const appDataSource = AppDataSource

wheelRouter.use(express.json())

// * : Get all Wheels 
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

// * : Get single wheel
wheelRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const wheel = await appDataSource.getRepository(Wheel)
            .createQueryBuilder("wheel")
            .where("wheel.id = :id", { id: id })
            .getOne()

        if (!wheel) {
            return res.status(404).json({ error: 'wheel not found' })
        }

        res.json(wheel);

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server error' })
    }
});

// * : Insert Single Wheel
wheelRouter.post('/', async (req, res) => {
    try {
        const newWheel = req.body
        console.log("trying to create the new wheel: ", newWheel)

        await appDataSource
            .createQueryBuilder()
            .insert()
            .into(Wheel)
            .values(newWheel)
            .execute().then((wheel) => {
                let newWheelId = wheel.identifiers[0].id
                console.log("created new wheel ID: ", newWheelId)
                res.json("created New WHeel: " + newWheelId)
            })

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
        const { storedOn } = req.body;
        // const { avatar } = req.body;


        const wheelItem = await
            appDataSource
                .getRepository(Wheel)
                .createQueryBuilder("wheels")
                .where("wheels.id = :id", { id: id })
                .getOne()


        if (!wheelItem) {
            res.status(400).json({ message: 'no item found' })
        }

        // update wheel properties
        wheelItem!.name = name
        wheelItem!.price = price
        wheelItem!.size = size
        wheelItem!.type = type
        wheelItem!.storedOn = storedOn
        // wheelItem!.avatar = avatar

        console.log("Updated wheel", wheelItem) // ? check this 

        const updatedItem = await appDataSource
            .getRepository(Wheel)
            .save(wheelItem!)
        res.json(updatedItem)
        // await appDataSource // this is for the configuration ?

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: ' internal server error' })
    }
});

// * : Delete single wheel
wheelRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // get wheel
        await appDataSource.getRepository(Wheel)
            .createQueryBuilder("wheels")
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
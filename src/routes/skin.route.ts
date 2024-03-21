import express from "express";
import AppDataSource from "../dataSource";
import { Skin } from "../models/skin.model"
import { Location } from "../models/location.model";
import { Configuration } from "../models/configuration.model";

const skinRouter = express.Router()
const appDataSource = AppDataSource

skinRouter.use(express.json())

// todo : Get all skins
skinRouter.get('/', async (req, res) => {
    try {
        console.log('all skins being requested')
        const items = await appDataSource
            .getRepository(Skin) // ? not sure waht else i should add here
        res.json(items)
    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server error' })
    }
});

// todo : Get single skin
skinRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const skin = await appDataSource
            .getRepository(Skin)
        // .getOne()

        if (!skin) {
            return res.status(404).json({ error: 'skin not found' })
        }

        res.json(skin);

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server erro' })
    }
});

// todo : Insert Single skin

// todo : Update Single skin
skinRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // todo : this needs to be changed
        const { name } = req.body;
        const { price } = req.body;
        const { avatar } = req.body;

        // ? find single skin item ?
        const skinItem = await
            appDataSource
                .getRepository(Skin) // ?
                .createQueryBuilder("skin")
                .leftJoinAndSelect('skins.configuration', 'configuration')
                .where("skins.id = :id", { id: id })
                .getOne()

        // ? find single configuration item ?

        if (!skinItem) {
            res.status(400).json({ message: 'no item found' })
        }

        // todo : this need to be fixed
        // update skin properties
        skinItem!.name = name
        skinItem!.price = price
        skinItem!.avatar = avatar


        console.log("Updated skin", skinItem) // ? check this 

        const updatedItem = await appDataSource
            .getRepository(Skin)
            .save(skinItem!)

        // await appDataSource // this is for the configuration ?

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: ' internal server error' })
    }
});

// todo : Delete single skin
skinRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // get skin
        await appDataSource.getRepository(Skin)
            .createQueryBuilder("skins") // ? 
            // .leftJoinAndSelect('') // ? do i have to add this or is it obly for configurations
            .where("skins.id = :id", { id: id })
            .getOne().then(async (skinbd: any) => {
                // ? what is sktbd ?
                console.log("DELETE SKINBD:", skinbd)

                // delete skin
                const skinDelete = await appDataSource.getRepository(Skin)
                    .createQueryBuilder()
                    .delete()
                    .from(Skin)
                    .where("id = :id", { id: id })
                    .execute()

                res.json("successfully removed skin." + JSON.stringify(skinDelete))
            })

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

export default skinRouter
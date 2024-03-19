import express from "express";
import AppDataSource from "../dataSource";
import { Location } from "../models/location.model";
import { Skateboard } from "../models/skateboard.model";
import { Configuration } from "../models/configuration.model";

const skateboardRouter = express.Router()
const appDataSource = AppDataSource

skateboardRouter.use(express.json());

// Get All
skateboardRouter.get('/', async (req, res) => {
    try {
        console.log('Im being requested: Skateboard')
        const items = await appDataSource
            .getRepository(Skateboard)
            .createQueryBuilder('skateboards')
            .leftJoinAndSelect('skateboards.configuration', 'configuration')
            .getMany();
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
        const skateboard = await appDataSource.getRepository(Skateboard)
            .createQueryBuilder("skateboards")
            .leftJoinAndSelect('skateboards.configuration', 'configuration')
            .where("skateboards.id = :id", { id: id })
            .getOne()

        if (!skateboard) {
            return res.status(404).json({ error: 'Skateboard not found' });
        }

        res.json(skateboard);

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

// Insert Single
skateboardRouter.post('/', async (req, res) => {
    try {

        const { configuration, ...newSkateboard } = req.body
        // const {configuration} = req.body
        let configId: any = null;

        // Create Configuration of Skateboard first to get the ID after the item is recorded
        await appDataSource
            .createQueryBuilder()
            .insert()
            .into(Configuration)
            .values([configuration])
            .execute()
            .then((configItem: any) => {
                configId = configItem.identifiers[0]?.id
            }).catch((error) => {
                console.log('Error creating Configuration: ', error)
                res.status(500).json({ error: 'Configuration could not be saved.' })
            })

        // If the Configuration has been created then create Skateboard item
        if (configId) {
            console.log("AFTER CONFIG SUCCESS ENTER SKATEBOARD, CONFID ID: ", configId)

            await appDataSource
                .createQueryBuilder()
                .insert()
                .into(Skateboard)
                .values([
                    {
                        craftedBy: 1,
                        avatar: newSkateboard.avatar,
                        price: newSkateboard.price,
                        craftedOn: Date(),
                        configuration: configId
                    }
                ])
                .execute().then((sktbd) => {
                    let skateboardNewId = sktbd.identifiers[0].id
                    console.log("Created New Skateboard ID: ", skateboardNewId)
                })
        }
    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Update Single
skateboardRouter.patch('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { price } = req.body;
        const { avatar } = req.body;
        const { configuration } = req.body;

        // Find Single Item
        const skateboardItem = await
            appDataSource
                .getRepository(Skateboard)
                .createQueryBuilder("skateboards")
                .leftJoinAndSelect('skateboards.configuration', 'configuration')
                .where("skateboards.id = :id", { id: id })
                .getOne()

        if (!skateboardItem) {
            res.status(400).json({ message: 'No Item found' })
        }

        // Update Properties
        skateboardItem!.price = price
        skateboardItem!.avatar = avatar
        skateboardItem!.configuration!.board_type = configuration.board_type

        console.log("Updated Skateboard", skateboardItem)

        const updatedItem = await appDataSource
            .createQueryBuilder()
            .update(Skateboard)
            .set(skateboardItem!)
            .execute()

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
        const skateboard = await appDataSource.getRepository(Skateboard)
            .createQueryBuilder()
            .delete()
            .from(Skateboard)
            .where("id = :id", { id: id })
            .execute()

        res.json(skateboard)

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

export default skateboardRouter


import express from "express";
import AppDataSource from "../dataSource";
import { Location } from "../models/location.model";
import { Skateboard } from "../models/skateboard.model";
import { Configuration } from "../models/configuration.model";

const skateboardRouter = express.Router()
const appDataSource = AppDataSource

skateboardRouter.use(express.json());

// Get All Skateboards
skateboardRouter.get('/', async (req, res) => {
    try {
        console.log('Im being requested: Skateboard')
        const items = await appDataSource
            .getRepository(Skateboard)
            .createQueryBuilder('skateboards')
            .leftJoinAndSelect('skateboards.configuration', 'configuration')
            .leftJoinAndSelect('skateboards.location', 'location')
            .leftJoinAndSelect('skateboards.stockNeeded', 'stockNeeded')
            .getMany();
        res.json(items)
    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

// Get Single Skateboards
skateboardRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const skateboard = await appDataSource.getRepository(Skateboard)
            .createQueryBuilder("skateboards")
            .leftJoinAndSelect('skateboards.configuration', 'configuration')
            .leftJoinAndSelect('skateboards.location', 'location')
            .leftJoinAndSelect('skateboards.stockNeeded', 'stockNeeded')
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

// Insert Single Skateboard
skateboardRouter.post('/', async (req, res) => {
    try {

        const { configuration, userId, ...newSkateboard } = req.body
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
                        craftedBy: userId!,
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

// Update Single Skateboard
skateboardRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { price } = req.body;
        const { avatar } = req.body;
        const { configuration } = req.body;

        // Find Single Skateboard Item
        const skateboardItem = await
            appDataSource
                .getRepository(Skateboard)
                .createQueryBuilder("skateboards")
                .leftJoinAndSelect('skateboards.configuration', 'configuration')
                .where("skateboards.id = :id", { id: id })
                .getOne()

        // Find Single Configuration Item
        const configurationItem = await
            appDataSource
                .getRepository(Configuration)
                .createQueryBuilder("configuration")
                .where("configuration.id = :id", { id: skateboardItem?.configuration?.id })
                .getOne()

        if (!skateboardItem) {
            res.status(400).json({ message: 'No Item found' })
        }

        // Update Skateboard Properties
        skateboardItem!.price = price
        skateboardItem!.avatar = avatar

        // Update Configuration Properties
        configurationItem!.board_type = configuration.board_type
        configurationItem!.board_skin = configuration.board_skin
        configurationItem!.trucks = configuration.trucks
        configurationItem!.wheels = configuration.wheels
        configurationItem!.bearings = configuration.bearings

        console.log("Updated Skateboard", skateboardItem, "Updated Skateboard", configurationItem)

        const updatedItem = await appDataSource
            .getRepository(Skateboard)
            .save(skateboardItem!)

        await appDataSource
            .getRepository(Configuration)
            .save(configurationItem!).then((config) => {
                res.json("Update Config: " + config)
                res.json(updatedItem)
            })

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Delete Single Skateboard
skateboardRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Get Skateboard 
        await appDataSource.getRepository(Skateboard)
            .createQueryBuilder("skateboards")
            .leftJoinAndSelect('skateboards.configuration', 'configuration')
            .where("skateboards.id = :id", { id: id })
            .getOne().then(async (sktbd: any) => {
                console.log("DELETE SKTBD: ", sktbd)

                // Delete Skateboard
                const skateboardDelete = await appDataSource.getRepository(Skateboard)
                    .createQueryBuilder()
                    .delete()
                    .from(Skateboard)
                    .where("id = :id", { id: id })
                    .execute()

                res.json("Successfully removed Skateboard. " + JSON.stringify(skateboardDelete))

                // Delete Configuration
                await appDataSource.getRepository(Configuration)
                    .createQueryBuilder()
                    .delete()
                    .from(Configuration)
                    .where("id = :id", { id: sktbd.configuration.id })
                    .execute()

            })

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

export default skateboardRouter


import express from "express";
import AppDataSource from "../dataSource";
import { BoardType } from "../models/boardtype.model"
import { Location } from "../models/location.model";
import { Configuration } from "../models/configuration.model";

const boardtypeRouter = express.Router()
const appDataSource = AppDataSource

boardtypeRouter.use(express.json())

// * : to get all boardtypes
boardtypeRouter.get('/', async (req, res) => {
    try {
        console.log('all board type being requested')
        // functional part : to get items from the repository BoardType
        const items = await appDataSource.getRepository(BoardType).find()
        res.json(items)
    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server error' })
    }
});

// * : Get single boardtype
boardtypeRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const boardtype = await appDataSource.getRepository(BoardType)
            .createQueryBuilder("boardtype")
            .where("boardtype.id = :id", { id: id })
            .getOne()

        if (!boardtype) {
            return res.status(404).json({ error: 'boardType not found' })
        }

        res.json(boardtype);

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: 'internal server error' })
    }
});

// todo : Insert Single boardtype
boardtypeRouter.post('/', async (req, res) => {
    try {
        const newBoardType = req.body
        console.log("trying to make new boarType: ", newBoardType)

        await appDataSource
            .createQueryBuilder()
            .insert()
            .into(BoardType)
            .values(newBoardType)
            .execute().then((boardType) => {
                let newBoardTypeId = boardType.identifiers[0].id
                console.log("create new skin ID: ", newBoardTypeId)
                res.json("created New BoardType: " + newBoardTypeId)
            })

    } catch (error) {
        console.log("error creating boardtype: ", error)
        res.status(500).json({ erro: 'could not create boadtype' })
    }
})

// * : Update Single boardType
boardtypeRouter.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const { name } = req.body;
        const { type } = req.body;
        const { backColor } = req.body;
        const { price } = req.body;
        const {storedOn} = req.body;
        const { avatar } = req.body;

        // ? find single boardtype item ?
        const boardTypeItem = await
            appDataSource
                .getRepository(BoardType) // ?
                .createQueryBuilder("boardTypes")
                .where("boardTypes.id = :id", { id: id })
                .getOne()


        if (!boardTypeItem) {
            res.status(400).json({ message: 'no item found' })
        }

        // update boardtype properties
        boardTypeItem!.name = name
        boardTypeItem!.type = type
        boardTypeItem!.backColor = backColor
        boardTypeItem!.price = price
        boardTypeItem!.storedOn = storedOn
        boardTypeItem!.avatar = avatar

        console.log("Updated boardType", boardTypeItem) // ? check this 

        const updatedItem = await appDataSource
            .getRepository(BoardType)
            .save(boardTypeItem!)
        res.json(updatedItem)
        // await appDataSource // this is for the configuration ?

    } catch (error) {
        console.log('error fetching:', error)
        res.status(500).json({ error: ' internal server error' })
    }
});

// * : Delete single boardType
boardtypeRouter.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // get boardtype
        await appDataSource.getRepository(BoardType)
            .createQueryBuilder("boardTypes") // ? 
            // .leftJoinAndSelect('') // ? do i have to add this or is it obly for configurations
            .where("boardTypes.id = :id", { id: id })
            .getOne().then(async (boardTypebd: any) => {
                console.log("DELETE BOARDTYPEBD:", boardTypebd)

                // delete BOARDTYPE
                const boardTypeDelete = await appDataSource.getRepository(BoardType)
                    .createQueryBuilder()
                    .delete()
                    .from(BoardType)
                    .where("id = :id", { id: id })
                    .execute()

                res.json("successfully removed boardType." + JSON.stringify(boardTypeDelete))
            })

    } catch (error) {
        console.log('Error fetching: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

export default boardtypeRouter
// the wheel route for backend 
import express from "express";
import AppDataSource from "../dataSource";
import { Bearing } from "../entity/bearing" // ? this needs to import the data from the entity folder

const bearingRouter = express.Router()

bearingRouter.use(express.json())

export default bearingRouter
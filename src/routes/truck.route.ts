// the wheel route for backend 
import express from "express";
import AppDataSource from "../dataSource";
import { Truck } from "../entity/truck" // ? this needs to import the data from the entity folder

const truckRouter = express.Router()

truckRouter.use(express.json())

export default truckRouter
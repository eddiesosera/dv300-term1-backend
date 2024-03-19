// the wheel route for backend 
import express from "express";
import AppDataSource from "../dataSource";
import { Wheel } from "../models/wheel.model" // ? this needs to import the data from the entity folder

const wheelRouter = express.Router()

wheelRouter.use(express.json())

export default wheelRouter
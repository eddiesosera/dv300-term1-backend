import express from 'express';
import dotenv from 'dotenv'; // ? hey this has a red underline for me: is it the same for you
import locationRouter from './routes/location.route';
import skateboardRouter from './routes/skateboard.route';
import configurationRouter from './routes/configuration.route';
import userRouter from './routes/user.route';
import authRouter from './routes/auth/login.route';
import stockNeededRouter from './routes/stockNeeded.route';
import wheelRouter from './routes/wheel.route';
import bearingRouter from './routes/bearing.route';
import truckRouter from './routes/truck.route';
import boardtypeRouter from './routes/boardtype.route';
import skinRouter from './routes/skin.route';
// import inventoryRouter from './route/inventoryRoute';
// import recipeRouter from './route/recipeRoute';

const cors = require("cors")
const app = express();

app.use(cors())

dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello, Skate360!');
});

// Route Endpoints: Entities
app.use('/location', locationRouter)
app.use('/skateboards', skateboardRouter)
app.use('/configuration', configurationRouter)
app.use('/stockNeeded', stockNeededRouter)
app.use('/users', userRouter)
app.use('/wheels', wheelRouter)
app.use('/bearings', bearingRouter)
app.use('/trucks', truckRouter)
app.use('/boardType', boardtypeRouter)
app.use('/skins', skinRouter)

// Route Endpoints: Auth
app.use('/auth', authRouter)


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});


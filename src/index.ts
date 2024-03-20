import express from 'express';
import dotenv from 'dotenv'; // ? hey this has a red underline for me: is it the same for you
import locationRouter from './routes/location.route';
import skateboardRouter from './routes/skateboard.route';
import configurationRouter from './routes/configuration.route';
import userRouter from './routes/user.route';
import authRouter from './routes/auth/login.route';
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
app.use('/users', userRouter)

// Route Endpoints: Auth
app.use('/auth', authRouter)


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});


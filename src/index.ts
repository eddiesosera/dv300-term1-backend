import express from 'express';
import dotenv from 'dotenv';
import locationRouter from './routes/location.route';
import skateboardRouter from './routes/skateboard.route';
// import inventoryRouter from './route/inventoryRoute';
// import recipeRouter from './route/recipeRoute';

const cors = require("cors")
const app = express();

app.use(cors())

dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello, Skate360!');
});

// Route Endpoints
app.use('/location', locationRouter)
app.use('/skateboards', skateboardRouter)
// app.use('/recipe', recipeRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});


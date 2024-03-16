import { DataSource } from 'typeorm';

const AppDataSource = new DataSource(
    {
        "type": "postgres",
        "host": "localhost",
        "port": 5432,
        "username": "postgres",
        "password": "1234",
        "synchronize": true,
        "entities": ["src/models/*"],
        "database": "dv300_term1"
    }
)

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err: any) => {
        console.error("Error during Data Source initialization", err)
    })

export default AppDataSource
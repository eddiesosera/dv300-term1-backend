<!-- REPLACE ALL THE [USERNAME] TEXT WITH YOUR GITHUB PROFILE NAME & THE [PROJECTNAME] WITH THE NAME OF YOUR GITHUB PROJECT -->

<!-- Repository Information & Links-->
<br />

[![LinkedIn][linkedin-shield]][linkedin-url]
[![Instagram][instagram-shield]][instagram-url]

<!-- HEADER SECTION -->
 <p align="center">
<h5 align="center" style="padding:0;margin:0;">Eddie Sosera 21100419  |  Ungerer Hattingh 221302</h5>
·
<!-- <h5 align="center" style="padding:0;margin:0;">Ungerer Hattingh 221302</h5> -->
</p>
</br>

<!-- Cover Image-->
 <a href="https://github.com/eddiesosera/dv300-term1-backend">
    <img src="https://github.com/eddiesosera/skate-360/blob/main/readmeAssets/skate-360-cover.png" alt="Cover Image">
  </a>

<!-- HEADER SECTION -->
<br />
<br />

<p align="center">

  <a href="https://github.com/eddiesosera/dv300-term1-backend">
    <img src="https://github.com/eddiesosera/skate-360/blob/main/readmeAssets/skate-360-logo.png" alt="Logo" width="140">
  </a>
  
  <h3 align="center">Skate 360: Backend</h3>
  <p align="center">
   Skate All day, Everyday!
    <br>
    <br>
   <a href="https://drive.google.com/drive/folders/1UVmXXdD3UPih2JOfLJc1vha8G8sXqz5x?usp=sharing">View Demo</a>
    ·
    <a href="https://github.com/eddiesosera/skate-360/issues">Report Bug</a>
    ·
    <a href="https://github.com/eddiesosera/skate-360/issues">Request Feature</a>
</p>

## Table of Contents

1. [Authors](#authors)
2. [Front-end Link](#front-end-link)
3. [Code Structure Used](#code-structure-used)
4. [Software used](#software-used)
5. [Linking backend to Database](#linking-backend-to-database)
6. [Development Process](#development-process)
    - [Relational Diagram](#relational-diagram)
    - [Setting up Crud](#setting-up-the-crud-functionality)
7. [Responsibilities](#responsibilities)
8. [License](#license)
9. [Contact Us](#contact)

</br>
</br>

<img src="https://github.com/eddiesosera/skate-360/blob/main/readmeAssets/skate-360-logo.png" alt="Logo" width="140">

### Description:
This is the documentation for the backend of the Skateboard warehouse inventory management web app.

</br>

## Frontend Link
The following is a link to the frontend repo: [Frontend repo](https://github.com/eddiesosera/dv300-term1).

<br>

## Code Structure used 

```Angular``` was the code structure used in the development of the backend.

<br>

## Software Used

A list of all the software that was used in the development of the backend 

- Postgress (pgadmin4)
    > Is the SQL database 

- Visual Studio Code
    > The coding software

- Postman 
    > To test server endpoints

- Insomnia 
    > To test server endpoints

</br>
</br>

## Linking backend to Database

this is how we linked the backend to the PostgreSQL Database.

```
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "****",
  "synchronize": true,
  "entities":["src/models/**/*"],
  "database":"***********"
}
```

>[!NOTE]
>This can be found in both the ormconfig.json file and the dataSource.ts file in the src folder. 

</br>
</br>

## Development Process

### Relational Diagram

This is the relational diagram for the database entity structure.

<img src="https://github.com/eddiesosera/skate-360/blob/main/readMeAssets/database-architecture.png">

> Relational diagram.

<br>

### Setting Up the ```CRUD``` Functionality.

  >This is the crud functionality for the skateboards and their configuration. This is the most complicated example of the ```CRUD``` functionality

  Get all Items

    > [!NOTE]
    > The GET ALL Function in the route.ts file is used to get all items in the specific array

  ```
    // Get All Skateboards
    skateboardRouter.get('/', async (req, res) => {
        try {
            console.log('Im being requested: Skateboard')
            const items = await appDataSource
                .getRepository(Skateboard)
                .createQueryBuilder('skateboards')
                .leftJoinAndSelect('skateboards.configuration', 'configuration')
                .leftJoinAndSelect('configuration.board_type', 'board_type')
                .leftJoinAndSelect('skateboards.location', 'location')
                .leftJoinAndSelect('skateboards.stockNeeded', 'stockNeeded')
                .leftJoinAndSelect('skateboards.craftedBy', 'users')
                .getMany();
            res.json(items)
        } catch (error) {
            console.log('Error fetching: ', error)
            res.status(500).json({ error: 'Internal server error' })
        }
    });
  ```
  
  Get Singal Item

  > [!NOTE]
  > The GET SINGLE Function to get a single item by calling the item ID

  ```
    // Get Single Skateboards
    skateboardRouter.get('/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const skateboard = await appDataSource.getRepository(Skateboard)
                .createQueryBuilder("skateboards")
                .leftJoinAndSelect('skateboards.configuration', 'configuration')
                .leftJoinAndSelect('skateboards.location', 'location')
                .leftJoinAndSelect('skateboards.stockNeeded', 'stockNeeded')
                .leftJoinAndSelect('skateboards.craftedBy', 'users')
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
  ```

  Add an Item

  > [!NOTE]
  > The Function to add new items to your database

  ```
    // Insert Single Skateboard
    skateboardRouter.post('/', async (req, res) => {
        try {

            const { configuration, userId, locationId, stockNeeded, ...newSkateboard } = req.body
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
                            location: locationId!,
                            stockNeeded: stockNeeded!,
                            avatar: newSkateboard.avatar,
                            price: newSkateboard.price,
                            craftedOn: Date(),
                            configuration: configId
                        }
                    ])
                    .execute().then((sktbd) => {
                        let skateboardNewId = sktbd.identifiers[0].id
                        console.log("Created New Skateboard ID: ", skateboardNewId)
                        res.json(sktbd)
                    })
            }
        } catch (error) {
            console.log('Error fetching: ', error)
            res.status(500).json({ error: 'Internal server error' })
        }
    })
  ```

  Update Item

  > [!NOTE]
  > The UPDATE Function in the route.ts file

  ```
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
            configurationItem!.board_type = configuration?.board_type
            configurationItem!.board_skin = configuration?.board_skin
            configurationItem!.trucks = configuration?.trucks
            configurationItem!.wheels = configuration?.wheels
            configurationItem!.bearings = configuration?.bearings

            console.log("Updated Skateboard", skateboardItem, "Updated Skateboard", configurationItem)

            const updatedItem = await appDataSource
                .getRepository(Skateboard)
                .save(skateboardItem!)

            await appDataSource
                .getRepository(Configuration)
                .save(configurationItem!).then((config) => {
                    res.json("Update Config: " + JSON.stringify(config))
                    res.json(updatedItem)
                })

        } catch (error) {
            console.log('Error fetching: ', error)
            res.status(500).json({ error: 'Internal server error' })
        }
    })
  ```

  Delete Item

  > [!NOTE]
  > The DELETE Function in the route.ts file

  ```
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
  ```

</br>
</br>

## Responsibilities

Who was responsible for developing each part of the backend.

**Eddie**
  - Skateboard Route and Model
  - Configuration Route and Model
  - Location Route and Model
  - User Model Route
  - ormConfig
  - DataSource File
  - Backend Authentication Route

**Ungerer**
  - Wheel Route and model
  - Truck Route and model
  - Bearing Route and model
  - Board-Skin Route and model
  - Board-type Route and model
  - Backend ReadMe file

</br>
</br>

  <!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

</br>
</br>


### Authors
- [eddiesosera](https://github.com/eddiesosera)
- [Ungerer221](https://github.com/Ungerer221)

<br>

<!-- CONTACT -->

## Contact

- **Eddie Sosera** - [email@address](mailto:email@address) - [@instagram_handle](https://www.instagram.com/instagram_handle/)
- **Ungerer Hattingh** - [email@address](mailto:email@address) - [@instagram_handle](https://www.instagram.com/instagram_handle/)
- **Project Link** - https://github.com/eddiesosera/dv300-term1
- **Backend Link** - https://github.com/eddiesosera/dv300-term1-backend


[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/nameonlinkedin/
[instagram-shield]: https://img.shields.io/badge/-Instagram-black.svg?style=flat-square&logo=instagram&colorB=555
[instagram-url]: https://www.instagram.com/instagram_handle/
[behance-shield]: https://img.shields.io/badge/-Behance-black.svg?style=flat-square&logo=behance&colorB=555
[behance-url]: https://www.behance.net/name-on-behance/

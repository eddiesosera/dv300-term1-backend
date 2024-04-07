
![GitHub repo size](https://img.shields.io/github/repo-size/username/projectname?color=%000000)
![GitHub watchers](https://img.shields.io/github/watchers/username/projectname?color=%000000)
![GitHub language count](https://img.shields.io/github/languages/count/username/projectname?color=%000000)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/username/projectname?color=%000000)
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Instagram][instagram-shield]][instagram-url]
[![Behance][behance-shield]][behance-url]

# DV300-Term1-Backend

### Description:
This is the ReadMe documantation for the back end of the Skateboard warehouse inventory management webiste.

<!-- HEADER SECTION -->
<h5 align="center" style="padding:0;margin:0;">Eddie Sosera</h5>
<h5 align="center" style="padding:0;margin:0;">21100419</h5>
<h6 align="center">DV300 2024</h6>

</br>

<h5 align="center" style="padding:0;margin:0;">Ungerer Hattingh</h5>
<h5 align="center" style="padding:0;margin:0;">221302</h5>
<h6 align="center">DV300 2024</h6>

</br>

## Table of Contents

1. [Authers](#authors)
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


### Authors
- [Eddie](https://github.com/eddiesosera)
- [Ungerer](https://github.com/Ungerer221)

<br>

## Front End Link
[Front end Repo](https://github.com/eddiesosera/dv300-term1)

<br>

## Code Structure used 

```Angular``` was the code structure used in the devlopment of the backend.

<br>

## Software Used

A list of all the software that was used in the development of the backend 

- Postgress
    > Is the SQL database 

- Visual Studio Code
    > the coding software

- Postman 
    > To test Http commands To test Functionality

- Insomnia 
    > To test Http commands To test Functionality

<br>

## Linking backend to Database

this is an example of how to link the backend to the postgres Database.

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
>This can be found in both the ormconfig.json file and in the dataSource.ts file in the src folder. 

<br>

## Development Process

### Relational Diagram

This is the relational diagram for the database entity structure.

<img src="ReadMeAssets\database Architecture.png">

> Relational diagram.

<br>

### Setting Up the ```CRUD``` Functionality.

  >This is the crud functionality for the skateboards and their configuration. This being the most complicated example of the ```CRUD``` functionality

  Get all Items

    > [!NOTE]
    > The GET ALL Function in the route.ts file used to get all items in the specific array

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

<br>

## Responsibilities

Who was responsable for developing each part of the backend.

**Eddie**
  - skateboard Route and Model
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
  - Board-Type Route and model
  - Backend ReadMe file

  <!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.\

<!-- LICENSE -->

## Contact

- **Eddie Sosera** - [email@address](mailto:email@address) - [@instagram_handle](https://www.instagram.com/instagram_handle/)
- **Ungerer Hattingh** - [email@address](mailto:email@address) - [@instagram_handle](https://www.instagram.com/instagram_handle/)
- **Project Link** - https://github.com/eddiesosera/dv300-term1
- **Backend Link** - https://github.com/eddiesosera/dv300-term1-backend

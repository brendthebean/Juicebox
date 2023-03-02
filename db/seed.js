const { 
    client,
    getAllUsers,
    createUser
 } = require('./index.js');

 const createInitialUser = async () => {
    try {
        console.log("Starting to create users...");

        await createUser('alice ','bertie97');
        await createUser('sandra','glamgal');

    }catch(err){
        console.error("Error creating users!");
        throw err;
    }
 }

const dropTables = async () => {
    try{
        console.log("Starting to drop tables...");
        await client.query(`
            DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping tables!");
    }catch(err){
        console.error(err)
        console.log("error dropping tables!");
    }
}

const createTables = async () => {
    try{
        console.log("Starting to build tables...");
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL
            );
        `)
        console.log("Finished building tables!");
    }catch(err){
        console.error(err)
        console.log("Error building tables!");
    }
}

const rebuildDB = async () => {
    try{
       client.connect()

       await dropTables();
       await createTables();
       createInitialUser();
    }catch(err){
        console.error(err)
    }
}

const testDB = async () => {
   try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers: ", users);

    console.log ("Finished databse tests!");
}catch(err){
    console.error(`error testing the database!`, err);
    throw err;
}

}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end);
const { 
    client,
    getAllUsers,
    getAllPosts,
    createUser,
    createPost,
    updateUser,
    updatePost,
    getUserById
 } = require('./index.js');

 const createInitialUser = async () => {
    try {
        console.log("Starting to create users...");

        await createUser('alice ','bertie97', 'ali','NYC');
        await createUser('sandra','glamgal', 'sandy', 'OKC');
        await createUser('benny','bowow', 'ben', 'Portland');

    }catch(err){
        console.error("Error creating users!");
        throw err;
    }
 }

 const createInitialPosts = async () => {
    try {
      const [ alice, sandra, benny ] = await getAllUsers();
  
      console.log("Starting to create posts...")
      await createPost({
        authorId: alice.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them."
      });
  
      /*await createPost({
        authorId: sandra.id,
        title: "How does this work?",
        content: "Seriously, does this even do anything?"
      });*/
  
      await createPost({
        authorId: alice.id,
        title: "Living the Glam Life",
        content: "Do you even? I swear that half of you are posing."
      });
      console.log("Finished creating posts!");
    } catch (error) {
      console.log("Error creating posts!");
      throw error;
    }
  }

const dropTables = async () => {
    try{
        console.log("Starting to drop tables...");

        await client.query(`
            DROP TABLE IF EXISTS posts;
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
                password varchar(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );
        `)
        await client.query(`
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
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
       createInitialPosts();
    }catch(err){
        console.error(err)
    }
}

const testDB = async () => {
    try{
        console.log("Starting to test database...");

        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("Result:", users);

        console.log("Calling updateUser on users[0]");
        const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);

        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Result:", posts);

        console.log("Calling updatePost on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "Updated Content"
        });
        console.log("Result:", updatePostResult);

        console.log("Calling getUserById with 1");
        const albert = await getUserById(1);
        console.log("Result:", albert);

        console.log("Finished database tests!");
    } catch (error) {
        console.log("Error during testDB");
        throw error;
    }

}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end);
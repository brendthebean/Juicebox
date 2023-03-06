const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');

const getAllUsers = async () => {
    const { rows } = await client.query(
        `SELECT id, username, name, location, active FROM users;
        `);
        return rows;
}

const getAllPosts = async () => {
    try{
        const { rows } = await client.query(
            `SELECT * FROM posts;
            `);
            return rows;
    }catch(err){
        throw err;
    }
}

const createUser = async (username, password, name, location) => {
    try{
        const { rows } = await client.query(`
            INSERT INTO users (username, password, name, location) VALUES ('${username}', '${password}','${name}', '${location}')
            ON CONFLICT (username) DO NOTHING RETURNING *;
        `);

        //console.log(rows);
        return rows;
    }catch(err){
        throw err;
    }
}

const createPost = async ({authorId, title, content}) => {
    try{
        const { rows: [post] } = await client.query(`
            INSERT INTO posts ("authorId", title, content) VALUES ('${authorId}', '${title}', '${content}');
        `)
        return post;
    }catch(err){
        throw err;
    }
}

const updateUser = async (id, fields = {}) => {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const {rows: [ user ]} = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return user;
    } catch (err) {
      throw err;
    }
  }

  const updatePost = async (id, fields = {}) => {
    // build the set string
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');

      // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }

    try {
        const {rows: [post]} = await client.query(`
          UPDATE posts
          SET ${ setString }
          WHERE id=${ id }
          RETURNING *;
        `, Object.values(fields));
    
        return post;
      } catch (err) {
        throw err;
      }
  }

  const getPostByUser = async (userId) => {
    try {
        const { rows } = await client.query(`
        SELECT * FROM posts
        WHERE "authorId"=${ userId };
      `);
      return rows;
    }catch(err){
        throw err;
    }
  }

  const getUserById = async (userId) => {
    try {
        const { rows: [ user ] } = await client.query(`
          SELECT id, username, name, location, active
          FROM users
          WHERE id=${ userId }
        `);
    
        if (!user) {
          return null
        }
    
        user.posts = await getPostByUser(userId);
    
        return user;
      } catch (error) {
        throw error;
      }
  }

module.exports = {
    client,
    getAllUsers,
    getAllPosts,
    createUser,
    createPost,
    updateUser,
    updatePost,
    getPostByUser,
    getUserById
}
/**
dbManager.js
Authors:
/**
Author: Tyian Lashley
This file handles database connection operation.
*/

const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017/';

const client = new MongoClient(url, { useUnifiedTopology: true });
let db;

async function connect(dbName) {
  try {
    await client.connect();
    const database = client.db(dbName);
    console.log(`Connected to ${dbName}`);
    return database;
  } catch (error) {
    console.error(error);
  }
}

const database = {
  async get(dbName) {
    if (!db) {
      db = await connect(dbName);
    }
    return db;
  },
  
async getCollection(collectionName) {
    if (!db) {
      throw new Error('A database connection has not been established');
    }
    return db.collection(collectionName);
  },
 
  async close() {
    try {
      await client.close();
      console.log('Connection closed');
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = database;
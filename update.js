const User = require('./user');
require('dotenv').config()

var MongoClient = require('mongodb').MongoClient

const uri = process.env.DB_URI;

const client = new MongoClient(uri);

async function update(name,gp,callback) {
  try {
    const database = client.db("Reckno");
    const movies = database.collection("users");

    // create a filter 
    const filter = { username: name };

    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };

    // create a document that sets the data
    const updateDoc = {
      $set: {
        group: gp
      },
    };

    const result = await movies.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );
  } finally {
    await client.close();
  }

  callback(gp)

}
// run().catch(console.dir);


module.exports = {update};

const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

// Helper methods within the Dynamo class/object
// - these helper methods are similar to the model methods in rails that interact with database objects
const Dynamo = {
  // gets an item from the table by ID (primary key)
  async get(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    const item = await documentClient.get(params).promise();

    if (!item || !item.Item) {
      throw Error(
        `There was an error fetching the data for ID of ${ID}, from ${TableName}`
      );
    }

    console.log(item);

    return item.Item;
  },

  //
  async write(item, TableName) {
    // check if data has an ID
    if (!item.ID) {
      throw Error("No ID ont he data");
    }

    const params = {
      TableName,
      Item: item,
    };

    // put data in the dynamo table
    // ? .put is not in the AWS docs?! only putItem
    // ? .put vs .putItem?
    // - .putItem
    //   - overwrites the whole item
    const response = await documentClient.put(params).promise();

    if (!response) {
      throw Error(`There was an error inserting ID of ${item.ID} into table ${TableName}`);
    }

    return item;
  },
};

module.exports = Dynamo;

const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");
const tableName = process.env.tableName;

// takes ID and body from client and adds a new attribute of user item in dynamo table
exports.handler = async (event) => {
  console.log("event", event);

  // what does this pathParameters represent?
  if (!event.pathParameters || !event.pathParameters.ID) {
    // failed without an ID
    return Responses._400({ message: "missing the ID from the path" });
  }

  // get ID from url path
  let ID = event.pathParameters.ID;

  // get body (user data sent from client) from event
  // - JSON.parse('json string') => JS Object
  const user = JSON.parse(event.body);
  console.log("user", user);

  // add a key/value to user object
  user.ID = ID;

  // add user to Dynamo table (if ID doesn't exist)
  // - or overwrite user item with new user item
  // - .write = custom functiont that returns the new user item
  const newUser = await Dynamo.write(user, tableName).catch((err) => {
    console.log("Error in Dynamo write", err);
    return null;
  });

  if (!newUser) {
    return Responses._400({ message: "Failed to write user by ID" });
  }

  return Responses._200({ newUser });
};

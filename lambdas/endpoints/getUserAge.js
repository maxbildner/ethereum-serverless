const Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");
const tableName = process.env.tableName;

exports.handler = async (event) => {
  console.log("event", event);

  // what does this pathParameters represent?
  if (!event.pathParameters || !event.pathParameters.ID) {
    // failed without an ID
    return Responses._400({ message: "missing the ID from the path" });
  }

  // get ID from url path
  let ID = event.pathParameters.ID;

  // get the user in the users table by ID
  const user = await Dynamo.get(ID, tableName).catch((err) => {
    console.log("error in Dynamo get", err);
    return null;
  });

  if (!user) {
    return Responses._400({ message: "Failed to get user by ID" });
  }

  return Responses._200({ user });
};

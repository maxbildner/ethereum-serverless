const Responses = require("../common/API_Responses");

exports.handler = async (event) => {
  console.log("event", event);

  // what does this pathParameters represent?
  if (!event.pathParameters || !event.pathParameters.ID) {
    // failed without an ID
    return Responses._400({ message: "missing the ID from the path" });
  }

  let ID = event.pathParameters.ID;

  if (data[ID]) {
    // return the data
    return Responses._200(data[ID]);
  } else {
    // failed as ID not in the data
    return Responses._400({ message: "No ID in data" });
  }
};

const data = {
  1234: { name: "harry", age: 9, type: "lab" },
  5678: { name: "mosey", age: 1, type: "feta" },
  9012: { name: "blue", age: 3, type: "corgi" },
};

# AWS DYNAMO DB NOTES
- <ins>**DATA TYPES**</ins> JavaScript Syntax
  - [https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
  
- Docs:
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html
- Dynamo <ins>**Table**</ins>
  - Made up of unique items?
- Dynamo <ins>**Item**</ins>
  - An object that can have many key/value pairs
  - Attribute = keys in item
- <ins>**Primary Key** (**Hash Key**)</ins>
  - A unique identifier of an item
  - Has one attribute called **Partition Key**
  - Ex. See “ID” below, with the unique value of 1
  - Each item in the table must have this primary key
  - In a table that only has a partition key, no two items can have the same partition key value
  - Values must be scalar (string, number, or binary. Can’t be object/other data type)
- Other than primary key, the table is schema-less, which means neither attributes or data types need to be defined before you create table (unlike in traditional relational databases)

Example 1 of Users Table with two user items
{
  “ID”: 1,
  “name”: “max”,
  “age”: 29
}
{
  “ID”: 2,
  “name”: “harry”,
  “age”: 9
}

- There are Two different kinds of Primary Keys
  - <ins>**Partition Key** (**hash attribute**)</ins>
    - Simple primary key with one attribute called Partition key
    - The value of this key is used under the hood in a hash function, where the output determines the partition (physical storage location?)
  - Partition Key and <ins>**Sort Key**</ins> (together aka <ins>**Composite Primary Key**</ins>)
    - Made of two attributes:
      - 1st attribute = <ins>**Partition Key**</ins>
      - 2nd attribute = <ins>**Sort Key**</ins>
    - You can have multiple items with the same portion key value (but sort key values must be different)
    - All items with the same partition key value are stored together in sorted order by the sort key value
    - Accessing an item requires both the primary key and the sort key

- <ins>**Secondary Indexes**</ins> (Secondary Key?)
  - Another key/value attribute of an item that is required (if you use it)
  - See example 2 below where “SongTitle” is the Secondary Index and “Artist” is the Primary Key

Example 2 of Music Table
{
  “Artist”: “Avicii”,
  “SongTitle”: “Levels”,
  “Price”: 2.99
}
{
  “Artist”: “Kygo”,
  “SongTitle”: “Firestone”,
  “Price”: 1.99
}

- In the above music example 2, you can query data items by Artist (partition key), or by  
  Artist and SongTitle (partition key and sort key). If you wanted to query the data by Genre and Album title, you would create an index in Genre and AlbumTitle. 

- <ins>**Compound Key**</ins>
  - <ins>**Hash Key**</ins> and <ins>**Range** Key</ins>
- Only need to define a schema for keys (when you create the table)
- Items are accessed using their primary key
- <ins>**Limits**</ins>
  - Table size can’t exceed 10Gb
  - Individual items can’t exceed 400kb

- DynamoDB <ins>**Streams**</ins>
  - A stream creates a reference to a before and after of an item after it has been updated
  - A stream also captures an image of new items added to tables or deleted
  - They disappear after 24 hours
  - You can use streams with AWS Lambda to create a trigger. For example, a table that has users. Every time a new user signs up (i.e. is added to the table, you could send a “welcome” email to each new customer. 
    - Enable stream on a table, then associate that stream with a lambda function

- DynamoDB API
    - Control Plane
    - Data Plane
    - Streams
    - Transactions

- <ins>**Control Plane APIs**</ins>
    - Lets you manage tables, indexes,  streams dependent on tables. Lets you create tables, describe tables (returns info about the table), list tables (returns names of all the tables), update tables (modifies settings of a table or its indexes), and delete tables

- <ins>**Data Plane APIs**</ins>
    - CRUD (Create, Read, Update, Delete) items in a table
    - Ex.
        - putItem = writes single item to table
        - batchWriteItem = writes/deletes up to 25 items to a table (more efficient than multiple single putItem

## QUESTIONS
- Advantages/Disadvantages of dynamo db tables?
- Advantage of partition and sort key (versus just 1 primary key)?
  - Flexibility when querying data. For example 2 above, if you provide only the artist, dynamoDB retrieves all of the songs by that artist. And to retrieve a subset of songs by that artist, you can provide the artist and the songTitle
  - Querying time single primary key vs composite key?
- Can you have a table with items that have different primary keys, but the same sort keys?
- advantages of .putItem()? why use this at all if you could do 
  everything with better performance with .updateItem()?
- Still don’t understand difference between Query vs Scan API’s?


## AWS DynamoDB SDK for javascript
- Docs: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item
- <ins>**DynamoDB.putItem( params )**</ins>
  - Overwrites the whole item (all attributes)
  - Ex. 
    ```userId = 1
    Name= ABC
    Gender= Male```

    if I use PutItem item with
    ```UserId = 1
    Country = India```

    This will replace Name and Gender and now new Item is UserId and Country. 
  - if you want to update an item with .putItem, you need to send
    all the attributes in the parameters
- <ins>**DynamoDB.updateItem( params )**</ins>
  - Only updates passed attributes of the item (better performance than .putItem( )
- You can use .putItem( params) to add a new item to the table as long as the primary key   in the params is unique from the table!


## MISC RESOURCES
- https://gist.github.com/jlafon/d8f91086e3d00c4bff3b
- https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a79a64a389ab1c9f/2018/09/10/dynamodb-partition-key-1.gif
- Cheat Sheet!!!
  - https://www.freecodecamp.org/news/ultimate-dynamodb-2020-cheatsheet/
- TUTORIAL: BACKEND- AWS LAMBDA + DYNAMODB CRUD + GitHub Actions
  - https://www.youtube.com/watch?v=hOcbHz4T0Eg
  - 1- create GitHub secrets from aws secret access key and id
  - 2- create GitHub action folders/yml file


## NEW NOTES
9/8/22
- <ins>**Projection Expression (ProjectionExpression)**</ins>
  - Removing this from a query, will return ALL the attributes/values of a table item

8/30/22
- <ins>**Expression Attribute Values**</ins> (ExpressionAttributeValues)
  - These are placeholder values that you don’t know until the query is run
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeValues.html
  - Ex. Awsinfra/functions/packages/.../Transactions.js / Transactions.get()
    ```
    const tx_query = new QueryCommand({
          TableName: "sdk_transactions",
          IndexName: "step_index",
          KeyConditionExpression: "step = :s AND inserted > :y",
          ExpressionAttributeValues: { ":s": { S: step }, ":y": { N: String(last) } }
      })
      response.data = await dbClient.send(tx_query)
    ```
    - If the .get(“pending”, 0)
    - This gets all the items in the sdk_transactions table where the item step == “pending” AND item inserted > 0
  - Why does dynamo require ExpressionAttributeValues?
    - https://stackoverflow.com/questions/31816906/why-does-dynamodb-require-expressionattributevalue

8/16/22
- Using <ins>**updateItemCommand**, but removing an attribute/value</ins> at the same time!
  - REMOVE
  - https://stackoverflow.com/questions/45170123/remove-nested-attribute-in-dynamodb
  - https://stackoverflow.com/questions/44022584/how-to-set-and-delete-using-a-single-updateexpression-with-dynamo
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.REMOVE
  - Example Syntax:
    - https://github.com/.../awsinfra/commit/2ddad6097aecb67aa7470436f8c3e36a5746768a
    ```
    static async createDraft(body, user_id) {
      let updateParams = {
        TableName: "users",
        Key: {
            user_id: { S: String(user_id) },
            inserted: { N: String(body.inserted) }
        },
        UpdateExpression:
           "collection_name = :cn, chain = :ch, REMOVE royalties_collector_wallet, royalty_fee_basis_points", 
        ExpressionAttributeValues: {
          ":cn": { S: body.collection_name }, 
          ":ch": { S: body.chain }, 
        },
        ReturnValues: "ALL_NEW"
      }
      const updateOrPutItem = new UpdateItemCommand(updateParams)
      return updateOrPutItem
    }
    ```

5/16/22
- <ins>**Projection Expression**</ins> (ProjectionExpression)
  - If you want to return only some attributes from a dynamo query
  - By default operations like GetItem/Query/Scan return all attributes
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html

4/19/22
- <ins>**Condition Expression (ConditionExpression)**</ins>
  - https://www.alexdebrie.com/posts/dynamodb-condition-expressions/
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html
  - Optional parameter when making a query (on write-operations)
  - Expression will be evaluated BEFORE the write. If expression evaluates to false, the write will be aborted

- <ins>**KeyConditionExpression**</ins>
  - This is a key in params when you make a dynamo query
  - It will be evaluated Before doing the query/write, if the expression evaluates to false, the write will be aborted
  - KeyConditionExpression accepts only key attributes, hash key and range key. Any other non-key attribute used in conditions will result in a validation error.
  - https://www.alexdebrie.com/posts/dynamodb-condition-expressions/#:~:text=A%20ConditionExpression%20is%20an%20optional,the%20write%20will%20be%20aborted

4/8/22
- <ins>**Key Condition Expression**</ins> (KeyConditionExpression)
    - This is a key in params when you make a dynamo query
    - It will be evaluated Before doing the query/write, if the expression evaluates to false, the write will be aborted
    - https://www.alexdebrie.com/posts/dynamodb-condition-expressions/#:~:text=A%20ConditionExpression%20is%20an%20optional,the%20write%20will%20be%20aborted
    
- KeyConditionExpression <ins>**Not Equals Operator "<>"**</ins>
  - The KeyConditionExpression doesn't allow not equals for the sort key. However, you can use the "Not Equals i.e. <>" in FilterExpression.
    - https://stackoverflow.com/questions/44998093/why-is-there-no-not-equal-comparison-in-dynamodb-queries

1/31/22
- Syntax <ins>**KeyConditionExpression**</ins>
  - accepts only key attributes, hash key and range key. Any other non-key attribute used in conditions will result in a validation error.
  - https://forums.aws.amazon.com/thread.jspa?threadID=221161


1/27/22
- CAN'T HAVE EMPTY ARRAY OF STRINGS or NUMBERS in DYNAMO DB item values (unless array of map objects)
- CAN HAVE EMPTY ARRAY of MAP

12/10/21
- Dynamo <ins>**Dynamo UPDATE vs PUT**</ins>
  - https://stackoverflow.com/questions/51155814/what-is-the-different-between-put-item-and-update-UPDATE vs PUT
  - https://stackoverflow.com/questions/51155814/what-is-the-different-between-put-item-and-update-






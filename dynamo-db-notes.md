# DYNAMO DB NOTES

- Docs:
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html
- Dynamo **Table**
  - Made up of unique items?
- Dynamo **Item**
  - An object that can have many key/value pairs
  - Attribute = keys in item
- **Primary Key** (**Hash Key**)
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
  - **Partition Key** (**hash attribute**)
    - Simple primary key with one attribute called Partition key
    - The value of this key is used under the hood in a hash function, where the output determines the partition (physical storage location?)
  - Partition Key and **Sort Key** (together aka **Composite Primary Key**)
    - Made of two attributes:
      - 1st attribute = **Partition Key**
      - 2nd attribute = **Sort Key**
    - You can have multiple items with the same portion key value (but sort key values must be different)
    - All items with the same partition key value are stored together in sorted order by the sort key value
    - Accessing an item requires both the primary key and the sort key

- **Secondary Indexes** (Secondary Key?)
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

- **Compound Key**
  - **Hash** and **Range** Key
- Only need to define a schema for keys (when you create the table)
- Items are accessed using their primary key
- **Limits**
  - Table size can’t exceed 10Gb
  - Individual items can’t exceed 400kb

- DynamoDB **Streams**
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

- **Control Plane APIs**
    - Lets you manage tables, indexes,  streams dependent on tables. Lets you create tables, describe tables (returns info about the table), list tables (returns names of all the tables), update tables (modifies settings of a table or its indexes), and delete tables

- **Data Plane APIs**
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
- **DynamoDB.putItem( params )**
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
- **DynamoDB.updateItem( params )**
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
- **KeyConditionExpression** 
  - This is a key in params when you make a dynamo query
  - It will be evaluated Before doing the query/write, if the expression evaluates to false, the write will be aborted
  - KeyConditionExpression accepts only key attributes, hash key and range key. Any other non-key attribute used in conditions will result in a validation error.
  - https://www.alexdebrie.com/posts/dynamodb-condition-expressions/#:~:text=A%20ConditionExpression%20is%20an%20optional,the%20write%20will%20be%20aborted

- KeyConditionExpression **Not Equals Operator "<>"**
  - The KeyConditionExpression doesn't allow not equals for the sort key. However, you can use the "Not Equals i.e. <>" in FilterExpression.
    - https://stackoverflow.com/questions/44998093/why-is-there-no-not-equal-comparison-in-dynamodb-queries

4/19/22
- **Condition Expression (ConditionExpression)**
  - https://www.alexdebrie.com/posts/dynamodb-condition-expressions/
  - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html
  - Optional parameter when making a query (on write-operations)
  - Expression will be evaluated BEFORE the write. If expression evaluates to false, the write will be aborted

5/16/22
- **Projection Expression**
    - If you want to return only some attributes from a dynamo query
    - By default operations like GetItem/Query/Scan return all attributes
    - https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html
    - ProjectionExpression
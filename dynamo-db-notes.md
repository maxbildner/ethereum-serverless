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

- **Compound Key**
  - **Hash** and **Range** Key
- Only need to define a schema for keys (when you create the table)
- Items are accessed using their primary key
- **Limits**
  - Table size can’t exceed 10Gb
  - Individual items can’t exceed 400kb

## QUESTIONS
- Advantage of dynamo db tables?
- Advantage of partition and sort key (versus just 1 primary key)?
  - Flexibility when querying data. For example 2 above, if you provide only the artist, dynamoDB retrieves all of the songs by that artist. And to retrieve a subset of songs by that artist, you can provide the artist and the songTitle
  - Querying time single primary key vs composite key?
- Can you have a table with items that have different primary keys, but the same sort keys?

## MISC RESOURCES
- https://gist.github.com/jlafon/d8f91086e3d00c4bff3b
- https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a79a64a389ab1c9f/2018/09/10/dynamodb-partition-key-1.gif
- Cheat Sheet!!!
  - https://www.freecodecamp.org/news/ultimate-dynamodb-2020-cheatsheet/
- TUTORIAL: BACKEND- AWS LAMBDA + DYNAMODB CRUD + GitHub Actions
  - https://www.youtube.com/watch?v=hOcbHz4T0Eg
  - 1- create GitHub secrets from aws secret access key and id
  - 2- create GitHub action folders/yml file

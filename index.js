const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//Middleware
const cors = require('cors')
app.use(cors());
app.use(express.json());

//Dot env
require("dotenv").config();


//============================MongoDb Conncet Start Form Here============================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2qhmb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const userDataCollection = client.db("todoData").collection("services");
        console.log('Database Connected Successfully');


        //Post Data Task
        app.post('/addData', async (req, res) => {
            const data = req.body;
            const result = await userDataCollection.insertOne(data);
            res.send(result);
        })

        //Get All Data Users
        app.get('/allDataInformation', async (req, res) => {
            const result = await userDataCollection.find({}).toArray();
            res.send(result);
        })


        //delete task
        app.delete('/deleteTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const removeTask = await userDataCollection.deleteOne(filter);
            res.send(removeTask);
        })

        //Update task 
        app.put('/updateTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateTask = req.body;
            const options = { upsert: true };
            const result = {
                $set: {
                    taskName: updateTask.taskName,
                    description: updateTask.description
                }
            }
            const fullUpdate = await userDataCollection.updateOne(filter, result, options);
            res.send(fullUpdate);
        })



    }
    finally {

    }
}
run().catch(console.dir)
//===============================MongoDb Conncet End===============================


app.get('/', (req, res) => {
    res.send('Server Start Successfully...');
})

app.listen(port, () => {
    console.log("server start success done");
})

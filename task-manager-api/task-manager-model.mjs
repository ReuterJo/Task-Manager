// Models for the Task Collection

// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';

// Connect based on the .env file parameters.
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once("open", (err) => {
    if(err){
        res.status(500).json({ error: 'Failed to open the database.' });
    } else  {
        console.log('The database has been opened.');
    }
});

// SCHEMA: Define the collection's schema.
const taskSchema = mongoose.Schema({
	text:               { type: String, required: true },
    done:               { type: Boolean, required: true },
	collapsed:          { type: Boolean, required: true },
    childIds:           { type: Array, required: true },
    childCollapsed:     { type: Boolean, required: true },
});

// Compile the model from the schema 
// by defining the collection name "tasks".
const tasks = mongoose.model('Task', taskSchema);


// CREATE model *****************************************
const createTask = async (text, done, collapsed, childIds, childCollapsed) => {
    const task = new tasks({
        text: text, 
        done: done, 
        collapsed: collapsed,
        childIds: childIds,
        childCollapsed: childCollapsed, 
    });
    return task.save();
}

// RETRIEVE model *****************************************
// Retrieve based on a filter and return a promise.
const retrieveTasks = async () => {
    const query = tasks.find();
    return query.exec();
}

// RETRIEVE by ID
const retrieveTaskByID = async (_id) => {
    const query = tasks.findById({_id: _id});
    return query.exec();
}

// DELETE model based on _id  *****************************************
const deleteTaskById = async (_id) => {
    const result = await tasks.deleteOne({_id: _id});
    return result.deletedCount;
};

// UPDATE model *****************************************************
const updateTask = async (_id, text, done, collapsed, childIds, childCollapsed) => {
    const result = await tasks.replaceOne({_id: _id }, {
        text: text, 
        done: done, 
        collapsed: collapsed,
        childIds: childIds,
        childCollapsed: childCollapsed, 
    });
    return { 
        _id: _id, 
        text: text, 
        done: done, 
        collapsed: collapsed,
        childIds: childIds,
        childCollapsed: childCollapsed, 
    }
}

// EXPORT the variables for use in the controller file.
export { createTask, retrieveTasks, retrieveTaskByID, updateTask, deleteTaskById }
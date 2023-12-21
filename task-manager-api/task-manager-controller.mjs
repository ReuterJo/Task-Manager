// Controllers for the Task Collection

import 'dotenv/config';
import express from 'express';
import * as tasks from './task-manager-model.mjs';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());  // REST needs JSON MIME type.

// CREATE controller ******************************************
app.post ('/tasks', (req,res) => { 
    tasks.createTask(
        req.body.text, 
        req.body.done,
        req.body.collapsed,
        req.body.childIds,
        req.body.childCollapsed,
        )
        .then(task => {
            res.status(201).json(task);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: 'The task was not created.' });
        });
});

// RETRIEVE controller ****************************************************
app.get('/tasks', (req, res) => {
    tasks.retrieveTasks()
        .then(task => { 
            if (task !== null) {
                res.json(task);
            } else {
                res.status(404).json({ Error: 'No tasks found.' });
            }         
         })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: 'Unable to retrive tasks.' });
        });
});

// RETRIEVE by ID controller
app.get('/tasks/:_id', (req, res) => {
    tasks.retrieveTaskByID(req.params._id)
    .then(task => { 
        if (task !== null) {
            res.json(task);
        } else {
            res.status(404).json({ Error: 'Task not found.' });
        }         
     })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: 'Unable to retrieve task.' });
    });

});

// UPDATE controller ************************************
app.put('/tasks/:_id', (req, res) => {
    tasks.updateTask(
        req.params._id, 
        req.body.text, 
        req.body.done,
        req.body.collapsed,
        req.body.childIds,
        req.body.childCollapsed,
    )
    .then(task => {
        res.json(task);
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({ error: 'Unable to update task.' });
    });
});

// DELETE Controller ******************************
app.delete('/tasks/:_id', (req, res) => {
    tasks.deleteTaskById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send({ Success: 'Tasks successfully deleted.' });
            } else {
                res.status(404).json({ Error: 'Task was not found.' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Unable to delete task.' });
        });
});

// Start app and listen to assigned port
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
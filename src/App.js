import './App.css';
import { React, useState } from 'react';
import TaskTree from './components/TaskTree';
import Form from './components/Form';

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const root = tasks[0];
  const taskIds = root.childIds;

  // Adds a task at the top level
  function handleAddTask(text) {
    const newId = nextId++;
    const newTask = {
      id: newId,
      text: text,
      done: false,
      childIds: [],
    };
    const newRoot = {
      ...root,
      childIds: root.childIds.push(newId)
    }
    setTasks({
      newRoot,
      ...tasks,
      [newId]: newTask
    });

  }
      
  // Updates a task
  function handleUpdateTask(taskId, task) {
    setTasks({
      ...tasks,
      [taskId]: task
    });
  }

  // Removes task from displayed tree, but not from the data model
  function handleDeleteTask(taskId, parentId) {
    const parent = tasks[parentId];
    const newParent = {
      ...parent,
      childIds: parent.childIds.filter(id => id !== taskId)
    };
    setTasks({
      ...tasks,
      [parentId]: newParent
    });
  }

  return (
    <>
      <h2>Your Tasks</h2>
      <ul>
        {taskIds.map((id) => (
          <TaskTree 
            key={id}
            id={id}
            parentId={0}
            tasksById={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </ul>
      <Form onAddTask={handleAddTask} />
    </>
  );
}

let nextId = 6;
const initialTasks = {
  0: {id: 0, text: '(Root)', done: true, childIds: [1, 2, 5]},
  1: {id: 1, text: 'Hello world', done: true, childIds: []},
  2: {id: 2, text: 'Goodnight moon', done: false, childIds: [3, 4]},
  3: {id: 3, text: 'Little bunny foo-foo', done: false, childIds: []},
  4: {id: 4, text: 'Making it happen', done: false, childIds: []},
  5: {id: 5, text: 'One day at a time', done: false, childIds: []},
};

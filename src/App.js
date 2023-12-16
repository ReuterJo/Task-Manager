import './App.css';
import { React, useState } from 'react';
import TaskTree from './components/TaskTree';
import Form from './components/Form';

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const root = tasks[0];
  const taskIds = root.childIds;

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleUpdateTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
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

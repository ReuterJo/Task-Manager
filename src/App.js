import './App.css';
import { React, useState } from 'react';
import TaskTree from './components/TaskTree';
import Form from './components/Form';
import FilterButton from './components/FilterButton'

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.done,
}
const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("All");
  const [formText, setFormText] = useState('');
  const [formShow, setFormShow] = useState(false);
  const [taskState, setTaskState] = useState('Displaying');

  const root = tasks[0];
  const taskIds = root.childIds;

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function handleFormText(text) {
    setFormText(text);
  }

  function handleFormShow(bool) {
    setFormShow(bool);
  }

  function handleTaskState(state) {
    setTaskState(state);
  }

  // Adds a task at the top level, make this more generalizable with parentId given as a parameter
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
  
  // Update task
  function handleUpdateTask(taskId, task) {
    setTasks({
      ...tasks,
      [taskId]: task
    });
  }

  // Updates a task, I need to update setTasks a single time, so I need to bundle the changes
  function handleCompleteTask(taskId, task) {
    setTasks((tasks) => ({
      ...tasks,
      [taskId]: task
    }));
    if (task.done && task.childIds.length > 0) {
      task.childIds.map((childId) => handleCompleteTaskHelper(childId, 
        {...tasks[childId],
          done: true,
        }));
    }
  }

  // Helper function that updates child tasks
  function handleCompleteTaskHelper(taskId, task) {
    setTasks((tasks) => ({
      ...tasks,
      [taskId]: task
    }));
    if (task.childIds.length > 0) {
      task.childIds.map((childId) => handleCompleteTaskHelper(childId, 
        {...tasks[childId],
          done: true,
        }));
    }
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
      {filterList}
      <ul>
        {taskIds.map((id) => (
          <TaskTree 
            key={id}
            id={id}
            parentId={0}
            taskState={taskState}
            onUpdateTaskState={handleTaskState}
            tasksById={tasks}
            filter={FILTER_MAP[filter]}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onUpdateFormText={handleFormText}
            onUpdateFormShow={handleFormShow}
          />
        ))}
      </ul>
      <Form
        formText={formText}
        formShow={formShow}
        onUpdateTaskState={handleTaskState}
        onUpdateFormText={handleFormText}
        onUpdateFormShow={handleFormShow}
        onAddTask={handleAddTask}
      />
    </>
  );
}

// Static data for testing purposes
let nextId = 6;
const initialTasks = {
  0: {id: 0, text: '(Root)', done: true, childIds: [1, 2]},
  1: {id: 1, text: 'Hello world', done: true, childIds: []},
  2: {id: 2, text: 'Goodnight moon', done: false, childIds: [3, 4]},
  3: {id: 3, text: 'Little bunny foo-foo', done: false, childIds: [5]},
  4: {id: 4, text: 'Making it happen', done: false, childIds: []},
  5: {id: 5, text: 'One day at a time', done: false, childIds: []},
};

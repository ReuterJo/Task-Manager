import './App.css';
import { React, useState } from 'react';
import TaskTree from './components/TaskTree';
import Form from './components/Form';
import FilterButton from './components/FilterButton'

// Static task data for testing purposes
let nextId = 6;
const initialTasks = {
  0: {id: 0, text: '(Root)', done: false, collapsed: false, childIds: [1, 2], childCollapsed: false},
  1: {id: 1, text: 'Hello world', done: true, collapsed: false, childIds: [], childCollapsed: false},
  2: {id: 2, text: 'Goodnight moon', done: false, collapsed: false, childIds: [3, 4], childCollapsed: false},
  3: {id: 3, text: 'Little bunny foo-foo', done: false, collapsed: false, childIds: [5], childCollapsed: false},
  4: {id: 4, text: 'Making it happen', done: false, collapsed: false, childIds: [], childCollapsed: false},
  5: {id: 5, text: 'One day at a time', done: false, collapsed: false, childIds: [], childCollapsed: false},
};

// Task filter definitions
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.done,
  Completed: (task) => task.done,
}
const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function App() {
  // Define states
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("All");
  const [formText, setFormText] = useState('');
  const [formState, setFormState] = useState('Hidden');
  const [tasksLock, setTasksLock] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);

  // Define root and identify children tasks
  const root = tasks[0];
  const taskIds = root.childIds;

  // Add a new task and update the parent task
  function handleAddTask(parentId, text) {
    const newId = nextId++;
    const parent = tasks[parentId];

    parent.childIds.push(newId)
    const newParent = {
      ...parent,
    }
    setTasks((tasks) => ({
      ...tasks,
      [parentId]: newParent,
    }));

    const newTask = {
      id: newId,
      text: text,
      done: false,
      collapsed: false,
      childIds: [],
      childCollapsed: false,
    };
    setTasks((tasks) => ({
      ...tasks,
      [newId]: newTask,
    }));
  }
  
  // Update task upon edit
  function handleUpdateTask(taskId, task) {
    setTasks((tasks) => ({
      ...tasks,
      [taskId]: task
    }));
  }

  // Complete task and all children tasks
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

  // Helper function that helps complete child tasks
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

  // Collapse children tasks and updates parent task
  function handleCollapseTask(taskId, task) {
    setTasks((tasks) => ({
      ...tasks,
      [taskId]: task
    }));
    if (task.childIds.length > 0) {
      if (task.childCollapsed) {
        task.childIds.map((childId) => handleUpdateTask(childId, 
          {...tasks[childId],
            collapsed: true,
          }));
      }
      else {
        task.childIds.map((childId) => handleUpdateTask(childId, 
          {...tasks[childId],
            collapsed: false,
          }));
      }
    }
  }

  // Delete reference from parent tasks
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

  // Define filter button list
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      setFilter={setFilter}
    />
  ));

  // Define header, filter buttons, tasks tree, and form
  return (
    <>
      <h2>Task Manager - {filter}</h2>
      {filterList}
      <ul>
        {taskIds.map((id) => (
          <TaskTree 
            key={id}
            id={id}
            parentId={0}
            tasksById={tasks}
            filter={FILTER_MAP[filter]}
            tasksLock={tasksLock}
            onUpdateTasksLock={setTasksLock}
            onUpdateActiveTaskId={setActiveTaskId}
            onCompleteTask={handleCompleteTask}
            onCollapseTask={handleCollapseTask}
            onDeleteTask={handleDeleteTask}
            onUpdateFormText={setFormText}
            onUpdateFormState={setFormState}
          />))}
      </ul>
      <Form
        tasksById={tasks}
        activeTaskId={activeTaskId}
        formText={formText}
        formState={formState}
        onUpdateFormText={setFormText}
        onUpdateFormState={setFormState}
        onUpdateActiveTaskId={setActiveTaskId}
        onUpdateTasksLock={setTasksLock}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
      />
    </>
  );
}
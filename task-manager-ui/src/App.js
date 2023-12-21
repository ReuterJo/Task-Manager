import './App.css';
import { React, useState, useEffect } from 'react';
import TaskTree from './components/TaskTree';
import Form from './components/Form';
import FilterButton from './components/FilterButton'

// Static task data for testing purposes
let nextId = 1;
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

  const taskIds = tasks[0].childIds;

  // Define root and identify children tasks
  let rootId;

  const initTasks = async () => {
    if (await loadTasks() === 0){
      const root = {id: 0, text: '(Root)', done: false, collapsed: false, childIds: [], childCollapsed: false};
      rootId = addTask(root);
    } else {
      rootId = tasks[0];
    }
  }

  // Load tasks from database using useEffect
  const loadTasks = async () => {
    const response = await fetch('/tasks')
    const tasks = await response.json();
    setTasks(tasks);
  }

  // Need dependency array, when should this refresh???
  useEffect(() => {
    loadTasks();
  }, []);

  // Add task to the database
  const addTask = async (task) => {
    const response = await fetch('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        id: task.id,
        text: task.text,
        done: task.done,
        collapsed: task.collapsed,
        childIds: task.childIds,
        childCollapsed: task.childCollapsed,
      }),
      headers: {'Content-Type': 'application/json',},
    });

    if (response.status === 201){
      console.log('Add successful');
      const resTask = await response.json();
      return resTask._id;
    } else {
      const errMessage = await response.json();
      console.log(errMessage);
    }
  }

  // Update task in the database 
  const updateTask = async (task) => {
    const response = await fetch(`/tasks/${task._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        _id: task._id,
        id: task.id,
        text: task.text,
        done: task.done,
        collapsed: task.collapsed,
        childIds: task.childIds,
        childCollapsed: task.childCollapsed,          
      }),
      headers: {'Content-Type': 'application/json',},
      });

      if (response.status === 200) {
        console.log('Update successful');
      } else {
        const errMessage = await response.json();
        console.log(errMessage);
      }
  }

  // Add a new task and update the parent task
  async function handleAddTask(parentId, text) {
    const newId = nextId++;

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
    const newTaskId = await addTask(newTask);

    const parent = tasks[parentId];
    parent.childIds.push(newTaskId)
    const newParent = {
      ...parent,
    }
    setTasks((tasks) => ({
      ...tasks,
      [parentId]: newParent,
    }));
    updateTask(newParent);
  }
  
  // Update task upon edit
  function handleUpdateTask(taskId, task) {
    setTasks((tasks) => ({
      ...tasks,
      [taskId]: task
    }));
    updateTask(task);
  }

  // Complete task and all children tasks
  function handleCompleteTask(taskId, task) {
    setTasks((tasks) => ({
      ...tasks,
      [taskId]: task
    }));
    //updateTask(task);

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
    //updateTask(task);

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
    //updateTask(task);

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
    //updateTask(newParent);

    // Need to delete
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
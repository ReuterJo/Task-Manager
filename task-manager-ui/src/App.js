import './App.css';
import { React, useState } from 'react';
import TaskTree from './components/TaskTree';
import Form from './components/Form';
import FilterButton from './components/FilterButton'

// Load tasks from database, and create root if necessary
const loadTasks = async () => {
  const response = await fetch('/tasks')
  const taskList = await response.json();
  let taskObject = {};
  let rootId = null;
  if (taskList.length > 0) {
    taskList.forEach((dbTask) => {taskObject[dbTask._id] = {
      text: dbTask.text,
      done: dbTask.done,
      collapsed: dbTask.collapsed,
      childIds: dbTask.childIds,
      childCollapsed: dbTask.childCollapsed,
    };
    if (dbTask.text === '(Root)') {
      rootId = dbTask._id;
    }});
    return { initialTasks: taskObject, rootId: rootId };
  } else {
    const root = {text: '(Root)', done: false, collapsed: false, childIds: [], childCollapsed: false};
    rootId = await addTask(root)
    taskObject[rootId] = root;
    return { initialTasks: taskObject, rootId: rootId };
  }
}

// Add task to the database
const addTask = async (task) => {
  const response = await fetch('/tasks', {
    method: 'POST',
    body: JSON.stringify({
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
const updateTask = async (taskId, task) => {
  const response = await fetch(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({
      _id: taskId,
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

// Delete task in the database
const deleteTask = async (taskId) => {
  const response = await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
  
  if (response.status === 204) {
    console.log('Delete successful');
  } else {
    const errMessage = await response.json();
    console.log(errMessage);
  }
}

const { initialTasks, rootId } = await loadTasks();

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

  // Add a new task and update the parent task
  async function handleAddTask(parentId, text) {
    const newTask = {
      text: text,
      done: false,
      collapsed: false,
      childIds: [],
      childCollapsed: false,
    };
    const newTaskId = await addTask(newTask);
    setTasks((tasks) => ({
      ...tasks,
      [newTaskId]: newTask,
    }));

    const parent = tasks[parentId];
    parent.childIds.push(newTaskId)
    const newParent = {
      ...parent,
    }
    updateTask(parentId, newParent);
    setTasks((tasks) => ({
      ...tasks,
      [parentId]: newParent,
    }));
  }
  
  // Update task upon edit
  function handleUpdateTask(taskId, task) {
    updateTask(taskId, task);
    setTasks((tasks) => ({
      ...tasks,
      [taskId]: task
    }));
  }

  // Complete task and all children tasks
  function handleCompleteTask(taskId, task) {
    updateTask(taskId, task);
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
    updateTask(taskId, task);
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
    updateTask(taskId, task);
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
    
    updateTask(parentId, newParent);
    setTasks((tasks) => ({
      ...tasks,
      [parentId]: newParent
    }));

    deleteTask(taskId);
    setTasks((tasks) => {
      delete tasks[taskId];
      return tasks;
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
        {tasks[rootId].childIds.length > 0 &&
          <ul>
            {tasks[rootId].childIds.map((id) => (
              <TaskTree 
                key={id}
                id={id}
                parentId={rootId}
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
        }
      <Form
        rootId={rootId}
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
import { React, useState, useEffect } from 'react';
import TaskTree from './components/TaskTree';
import Form from './components/Form';
import FilterButton from './components/FilterButton'
import { loadTasks, addTask, updateTask, deleteTask } from './routing/routes';
import ButtonGroup from '@mui/material/ButtonGroup';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TaskIcon from '@mui/icons-material/Task';

// Task filter definitions
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.done,
  Completed: (task) => task.done,
}
const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function App() {
  // Define states
  const [rootId, setRootId] = useState(null);
  const [tasks, setTasks] = useState({});
  const [filter, setFilter] = useState("All");
  const [formText, setFormText] = useState('');
  const [formState, setFormState] = useState('Hidden');
  const [tasksLock, setTasksLock] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);

  // Load tasks from database upon mounting
  useEffect(() => {
    loadTasks(setRootId, setTasks);
  }, []);

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
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  // Define header, filter buttons, tasks tree, and form
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{m: 5, p: 5}}>
          <h2>Task Manager <TaskIcon /></h2>
          <ButtonGroup>
            {filterList}
          </ButtonGroup>
            {rootId !== null &&
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
        </Paper>
      </Container>
    </>
  );
}
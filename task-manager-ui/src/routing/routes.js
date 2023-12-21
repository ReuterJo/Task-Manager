// Load tasks from database, and create root if necessary
const loadTasks = async (setRootId, setTasks) => {
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
    } else {
      const root = {text: '(Root)', done: false, collapsed: false, childIds: [], childCollapsed: false};
      rootId = await addTask(root)
      taskObject[rootId] = root;
    }
    setRootId(rootId);
    setTasks(taskObject);
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

export {loadTasks, addTask, updateTask, deleteTask}
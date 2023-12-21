import React from 'react';

export default function Task({task, taskId, parentId, tasksLock, onUpdateTasksLock, onUpdateActiveTaskId, onComplete, onCollapse, onDelete, onUpdateFormText, onUpdateFormState}) {
    let taskOptions;
    let showSubtasks;

    // Show tasks options enabled if tasks are not locked
    taskOptions = (
        <>
            <button 
                onClick={() => {
                    onUpdateTasksLock(true);
                    onUpdateFormText(task.text);
                    onUpdateActiveTaskId(taskId);
                    onUpdateFormState('Edit Task');
            }}>
                Edit
            </button>
            <button onClick={() => onDelete(taskId, parentId)}>Delete</button>
            <button 
                onClick={() => {
                    onUpdateTasksLock(true);
                    onUpdateFormText('');
                    onUpdateActiveTaskId(taskId);
                    onUpdateFormState('Add Subtask');
            }}>
                Add Subtask
            </button>
        </>
    );

    if (task.childIds.length > 0 && task.childCollapsed) {
        showSubtasks = (
            <button
                onClick={() => {
                    onCollapse(taskId, {
                        ...task,
                        childCollapsed: false,
                    });
                }}>
                Show subtasks
            </button>
        );
    }
    
    if (task.childIds.length > 0 && !task.childCollapsed) {
        showSubtasks = (
            <button
                onClick={() => {
                    onCollapse(taskId, {
                        ...task,
                        childCollapsed: true,
                    });
                }}>
                Hide subtasks
            </button>
        );
    }
    
    // Otherwise show task options disabled
    if (tasksLock) {
        taskOptions = (
            <>
                <button disabled>Edit</button>
                <button disabled>Delete</button>
                <button disabled>Add Subtask</button>
            </>
        );

        if (task.childIds.length > 0 && task.childCollapsed) {
            showSubtasks = (
                <button disabled>Show subtasks</button>
            );
        }

        if (task.childIds.length > 0 && !task.childCollapsed) {
            showSubtasks = (
                <button disabled>Hide subtasks</button>
            );
        }
    }

    return (
        <label>
            <input 
                type="checkbox"
                checked={task.done}
                onChange={(e) => {
                    onComplete(taskId, {
                        ...task,
                        done: e.target.checked,
                    });
                }}
            />
            {task.text}
            {taskOptions}
            {showSubtasks}
        </label>
    );
}
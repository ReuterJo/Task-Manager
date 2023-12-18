import React from 'react';

export default function Task({task, parentId, taskState, onUpdateTask, onUpdateActiveTaskId, onComplete, onDelete, onUpdateText, onUpdateState}) {

    let taskContent;
    switch (taskState) {
        case 'Editing':
            taskContent = (
                <>
                    {task.text}
                    <button disabled>Edit</button>
                    <button disabled>Delete</button>
                    <button disabled>Add Subtask</button>
                </>
            );
            break;
        case 'Adding':
            taskContent = (
                <>
                    {task.text}
                    <button disabled>Edit</button>
                    <button disabled>Delete</button>
                    <button disabled>Add Subtask</button>
                </>
            );
            break;
        default:
            taskContent = (
                <>
                    {task.text}
                    <button 
                        onClick={() => {
                            onUpdateTask('Editing');
                            onUpdateText(task.text);
                            onUpdateActiveTaskId(task.id);
                            onUpdateState('Edit Task');
                        }}
                    >
                        Edit
                    </button>
                    <button onClick={() => onDelete(task.id, parentId)}>Delete</button>
                    <button 
                        onClick={() => {
                            onUpdateTask('Adding');
                            onUpdateText('');
                            onUpdateState('Add Subtask');
                        }}
                    >
                        Add Subtask
                    </button>
                </>
            );
    }
    return (
        <label>
            <input 
                type="checkbox"
                checked={task.done}
                onChange={(e) => {
                    onComplete(task.id, {
                        ...task,
                        done: e.target.checked,
                    });
                }}
            />
            {taskContent}
        </label>
    );
}
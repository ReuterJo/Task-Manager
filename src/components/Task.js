import { React, useState } from 'react';

export default function Task({task, parentId, onComplete, onUpdate, onAdd, onDelete}) {
    const [taskState, setTaskState] = useState('Displaying');

    let taskContent;
    let subtaskContent = (
        <>
        </>
    );
    switch (taskState) {
        case 'Editing':
            taskContent = (
                <>
                    <input
                        value={task.text}
                        onChange={(e) => {
                            onUpdate(task.id, {
                                ...task,
                                text: e.target.value,
                            });
                        }}  
                    />
                    <button onClick={() => setTaskState('Displaying')}>Save</button>
                </>
            );
            break;
        case 'Adding':
            taskContent = (
                <>
                    {task.text}
                </>
            );
            subtaskContent = (
                <>
                    <ul>
                        <li>{task.text}</li>
                    </ul>
                </>
            );
            break;
        default:
            taskContent = (
                <>
                    {task.text}
                    <button onClick={() => setTaskState('Editing')}>Edit</button>
                </>
            );
    }
    return (
        <>
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
                <button onClick={() => onDelete(task.id, parentId)}>Delete</button>
                <button onClick={() => {setTaskState('Adding');}}>Add Subtask</button>
            </label>
            <label>
                {subtaskContent}
            </label>
        </>
    );
}
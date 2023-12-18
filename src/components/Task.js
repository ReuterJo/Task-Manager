import React from 'react';

export default function Task({task, parentId, taskState, onUpdateTask, onComplete, onDelete, onUpdateText, onUpdateShow}) {

    let taskContent;
    switch (taskState) {
        case 'Editing':
            taskContent = (
                <>
                    {task.text}
                    <button
                        disabled 
                        onClick={() => {
                            onUpdateTask('Editing');
                            onUpdateText(task.text);
                            onUpdateShow(true);
                        }}
                    >
                        Edit
                    </button>
                    <button disabled onClick={() => onDelete(task.id, parentId)}>Delete</button>
                    <button
                        disabled 
                        onClick={() => {
                            onUpdateTask('Adding');
                            onUpdateText('');
                            onUpdateShow(true);
                        }}
                    >
                        Add Subtask
                    </button>
                </>
            );
            break;
        case 'Adding':
            taskContent = (
                <>
                    {task.text}
                    <button
                        disabled 
                        onClick={() => {
                            onUpdateTask('Editing');
                            onUpdateText(task.text);
                            onUpdateShow(true);
                        }}
                    >
                        Edit
                    </button>
                    <button disabled onClick={() => onDelete(task.id, parentId)}>Delete</button>
                    <button
                        disabled 
                        onClick={() => {
                            onUpdateTask('Adding');
                            onUpdateText('');
                            onUpdateShow(true);
                        }}
                    >
                        Add Subtask
                    </button>
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
                            onUpdateShow(true);
                        }}
                    >
                        Edit
                    </button>
                    <button onClick={() => onDelete(task.id, parentId)}>Delete</button>
                    <button 
                        onClick={() => {
                            onUpdateTask('Adding');
                            onUpdateText('');
                            onUpdateShow(true);
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
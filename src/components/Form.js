import React from 'react';

export default function Form({activeTaskId, onUpdateActiveTaskId, tasksById, formText, formState, onUpdateTaskState, onUpdateFormText, onUpdateFormState, onAddTask, onUpdateTask}) {
    
    const activeTask = tasksById[activeTaskId];
    let formContent;
    switch (formState) {
        case 'Add Task':
            formContent = (
                <>
                    <input
                        placeholder="Add task"
                        value={formText}
                        onChange={(e) => onUpdateFormText(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            onUpdateFormText('');
                            onUpdateFormState('Hidden');
                            onAddTask(0, formText);
                            onUpdateTaskState('Displaying');
                        }}>
                        Add
                    </button>
                    <button onClick={() => {
                            onUpdateFormText('');
                            onUpdateFormState('Hidden');
                            onUpdateTaskState('Displaying');
                        }}>
                        Cancel
                    </button>
                </>
            );
            break;
        case 'Edit Task':
            formContent = (
                <>
                    <input
                        placeholder="Edit task"
                        value={formText}
                        onChange={(e) => onUpdateFormText(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            onUpdateFormText('');
                            onUpdateFormState('Hidden');
                            onUpdateTask(activeTaskId, {
                                ...activeTask,
                                text: formText,
                            });
                            onUpdateActiveTaskId(null);
                            onUpdateTaskState('Displaying');
                        }}>
                        Save
                    </button>
                    <button onClick={() => {
                            onUpdateFormText('');
                            onUpdateFormState('Hidden');
                            onUpdateTaskState('Displaying');
                        }}>
                        Cancel
                    </button>
                </>
            );
            break;
        case 'Add Subtask':
            formContent = (
                <>
                    <input
                        placeholder="Add subtask"
                        value={formText}
                        onChange={(e) => onUpdateFormText(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            onUpdateFormText('');
                            onUpdateFormState('Hidden');
                            onAddTask(activeTaskId, formText);
                            onUpdateTaskState('Displaying');
                        }}>
                        Add
                    </button>
                    <button onClick={() => {
                            onUpdateFormText('');
                            onUpdateFormState('Hidden');
                            onUpdateTaskState('Displaying');
                        }}>
                        Cancel
                    </button>
                </>
            );
            break;
        default:
            formContent = (
                <button onClick={() => onUpdateFormState('Add Task')}>
                    Add
                </button>
            );
    }
    return (
        <>
            {formContent}
        </>
    );
}
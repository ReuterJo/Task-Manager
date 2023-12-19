import React from 'react';

export default function Form({tasksById, activeTaskId, formText, formState, onUpdateFormText, onUpdateFormState, onUpdateActiveTaskId, onUpdateTasksLock, onAddTask, onUpdateTask}) {
    const activeTask = tasksById[activeTaskId];
    let formContent;

    // Display form according to state
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
                            onUpdateTasksLock(false);
                        }}>
                        Add
                    </button>
                    <button onClick={() => {
                            onUpdateFormText('');
                            onUpdateFormState('Hidden');
                            onUpdateTasksLock(false);
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
                            onUpdateTasksLock(false);
                        }}>
                        Save
                    </button>
                    <button onClick={() => {
                            onUpdateFormText('');
                            onUpdateFormState('Hidden');
                            onUpdateTasksLock(false);
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
                            onUpdateTasksLock(false);
                        }}>
                        Add
                    </button>
                    <button onClick={() => {
                            onUpdateFormText('');
                            onUpdateFormState('Hidden');
                            onUpdateTasksLock(false);
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
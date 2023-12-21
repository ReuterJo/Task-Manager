import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function Form({rootId, tasksById, activeTaskId, formText, formState, onUpdateFormText, onUpdateFormState, onUpdateActiveTaskId, onUpdateTasksLock, onAddTask, onUpdateTask}) {
    const activeTask = tasksById[activeTaskId];
    let formContent;

    // Display form according to state
    switch (formState) {
        case 'Add Task':
            formContent = (
                <>
                    <TextField
                        variant="standard" 
                        placeholder="Add task"
                        value={formText}
                        onChange={(e) => onUpdateFormText(e.target.value)}
                    />
                    <ButtonGroup>
                        <Button
                            variant='contained'
                            onClick={() => {
                                onUpdateFormText('');
                                onUpdateFormState('Hidden');
                                onAddTask(rootId, formText);
                                onUpdateTasksLock(false);
                            }}>
                            Add
                        </Button>
                        <Button
                            variant='contained'
                            onClick={() => {
                                onUpdateFormText('');
                                onUpdateFormState('Hidden');
                                onUpdateTasksLock(false);
                            }}>
                            Cancel
                        </Button>
                    </ButtonGroup>
                </>
            );
            break;
        case 'Edit Task':
            formContent = (
                <>
                    <TextField
                        variant="standard" 
                        placeholder="Edit task"
                        value={formText}
                        onChange={(e) => onUpdateFormText(e.target.value)}
                    />
                    <ButtonGroup>
                        <Button
                            variant='contained'
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
                        </Button>
                        <Button 
                            variant='contained'
                            onClick={() => {
                                onUpdateFormText('');
                                onUpdateFormState('Hidden');
                                onUpdateTasksLock(false);
                            }}>
                            Cancel
                        </Button>
                    </ButtonGroup>
                </>
            );
            break;
        case 'Add Subtask':
            formContent = (
                <>
                    <TextField
                        variant="standard" 
                        placeholder="Add subtask"
                        value={formText}
                        onChange={(e) => onUpdateFormText(e.target.value)}
                    />
                    <ButtonGroup>
                        <Button
                            variant='contained'
                            onClick={() => {
                                onUpdateFormText('');
                                onUpdateFormState('Hidden');
                                onAddTask(activeTaskId, formText);
                                onUpdateTasksLock(false);
                            }}>
                            Add
                        </Button>
                        <Button 
                            variant='contained'
                            onClick={() => {
                                onUpdateFormText('');
                                onUpdateFormState('Hidden');
                                onUpdateTasksLock(false);
                            }}>
                            Cancel
                        </Button>
                    /</ButtonGroup>
                </>
            );
            break;
        default:
            formContent = (
                <Button 
                    variant='contained'
                    onClick={() => onUpdateFormState('Add Task')}>
                    Add
                </Button>
            );
    }
    return (
        <>
            {formContent}
        </>
    );
}
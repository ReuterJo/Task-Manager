import React from 'react';

export default function Form({formText, formShow, onUpdateTaskState, onUpdateFormText, onUpdateFormShow, onAddTask}) {
    if (formShow) {
        return (
            <>
                <input
                    placeholder="Add task"
                    value={formText}
                    onChange={(e) => onUpdateFormText(e.target.value)}
                />
                <button
                    onClick={() => {
                        onUpdateFormText('');
                        onUpdateFormShow(false);
                        onAddTask(formText);
                        onUpdateTaskState('Displaying');
                    }}>
                    Add
                </button>
                <button onClick={() => {
                        onUpdateFormText('');
                        onUpdateFormShow(false);
                        onUpdateTaskState('Displaying');
                    }}>
                    Cancel
                </button>
            </>
        );
    }
    else {
        return (
            <button onClick={() => onUpdateFormShow(true)}>
                Add
            </button>
        );
    }
}
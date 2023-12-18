import { React, useState } from 'react';

export default function Form({onAddTask}) {
    const [text, setText] = useState('');
    const [showForm, setShowForm] = useState(false);

    if (showForm) {
        return (
            <>
                <input
                    placeholder="Add task"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    onClick={() => {
                        setText('');
                        setShowForm(false);
                        onAddTask(text);
                    }}>
                    Add
                </button>
                <button onClick={() => {
                        setText('');
                        setShowForm(false);
                    }}>
                    Cancel
                </button>
            </>
        );
    }
    else {
        return (
            <button onClick={() => setShowForm(true)}>
                Add
            </button>
        );
    }
}
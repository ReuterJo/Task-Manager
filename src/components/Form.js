import { React, useState } from 'react';

export default function Form({onAddTask}) {
    const [text, setText] = useState('');
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
                    onAddTask(text);
                }}>
                Add
            </button>
        </>
    );
}
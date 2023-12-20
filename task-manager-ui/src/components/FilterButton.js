import React from 'react';

export default function FilterButton({name, setFilter}) {
    return (
        <button
            type="button"
            onClick={() => setFilter(name)}>
            {name}
        </button>
    );
}
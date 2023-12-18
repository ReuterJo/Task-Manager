import React from 'react';

export default function FilterButton(props) {
    return (
        <button
            type="button"
            onClick={() => props.setFilter(props.name)}>
            {props.name}
        </button>
    );
}
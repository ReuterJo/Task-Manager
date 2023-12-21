import React from 'react';
import Button from '@mui/material/Button';

export default function FilterButton({name, isPressed, setFilter}) {
    if (isPressed) {
        return (
            <Button
                variant='contained'
                type="button"
                onClick={() => setFilter(name)}>
                {name}
            </Button>
        );
    } else {
        return (
            <Button
                variant='outlined'
                type="button"
                onClick={() => setFilter(name)}>
                {name}
            </Button>
        );
    }
}
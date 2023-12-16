import React from 'react';
import Task from './Task'

export default function TaskTree({id, parentId, tasksById, onUpdateTask, onDeleteTask}) {
    const task = tasksById[id];
    const childIds = task.childIds;
    return (
        <li>
            <Task 
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
            />
            {childIds.length > 0 && 
                <ul>
                    {childIds.map((childId) => (
                        <TaskTree
                            key={childId}
                            id={childId}
                            parentId={id}
                            tasksById={tasksById}
                            onUpdateTask={onUpdateTask}
                            onDeleteTask={onDeleteTask}
                        />
                    ))}
                </ul>
            }
        </li>
    );
}
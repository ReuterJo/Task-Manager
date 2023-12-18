import React from 'react';
import Task from './Task'

export default function TaskTree({id, parentId, tasksById, filter, onCompleteTask, onUpdateTask, onDeleteTask}) {
    const task = tasksById[id];
    const childIds = task.childIds;
    if (filter(task)) {
        return (
            <li>
                <Task 
                    task={task}
                    parentId = {parentId}
                    onComplete={onCompleteTask}
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
                                filter={filter}
                                onCompleteTask={onCompleteTask}
                                onUpdateTask={onUpdateTask}
                                onDeleteTask={onDeleteTask}
                            />
                        ))}
                    </ul>
                }
            </li>
        );
    }
}
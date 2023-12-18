import React from 'react';
import Task from './Task'

export default function TaskTree({id, parentId, taskState, onUpdateTaskState, tasksById, filter, onCompleteTask, onDeleteTask, onUpdateFormText, onUpdateFormShow}) {
    const task = tasksById[id];
    const childIds = task.childIds;
    if (filter(task)) {
        return (
            <li>
                <Task 
                    task={task}
                    parentId={parentId}
                    taskState={taskState}
                    onUpdateTask={onUpdateTaskState}
                    onComplete={onCompleteTask}
                    onDelete={onDeleteTask}
                    onUpdateText={onUpdateFormText}
                    onUpdateShow={onUpdateFormShow}
                />
                {childIds.length > 0 && 
                    <ul>
                        {childIds.map((childId) => (
                            <TaskTree
                                key={childId}
                                id={childId}
                                parentId={id}
                                taskState={taskState}
                                onUpdateTaskState={onUpdateTaskState}
                                tasksById={tasksById}
                                filter={filter}
                                onCompleteTask={onCompleteTask}
                                onDeleteTask={onDeleteTask}
                                onUpdateFormText={onUpdateFormText}
                                onUpdateFormShow={onUpdateFormShow}
                            />
                        ))}
                    </ul>
                }
            </li>
        );
    }
}
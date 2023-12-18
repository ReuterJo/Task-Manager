import React from 'react';
import Task from './Task'

export default function TaskTree({id, parentId, taskState, onUpdateTaskState, onUpdateActiveTaskId, tasksById, filter, onCompleteTask, onDeleteTask, onUpdateFormText, onUpdateFormState}) {
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
                    onUpdateActiveTaskId={onUpdateActiveTaskId}
                    onComplete={onCompleteTask}
                    onDelete={onDeleteTask}
                    onUpdateText={onUpdateFormText}
                    onUpdateState={onUpdateFormState}
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
                                onUpdateActiveTaskId={onUpdateActiveTaskId}
                                tasksById={tasksById}
                                filter={filter}
                                onCompleteTask={onCompleteTask}
                                onDeleteTask={onDeleteTask}
                                onUpdateFormText={onUpdateFormText}
                                onUpdateFormState={onUpdateFormState}
                            />
                        ))}
                    </ul>
                }
            </li>
        );
    }
}
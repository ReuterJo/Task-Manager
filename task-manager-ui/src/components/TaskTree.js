import React from 'react';
import Task from './Task'

export default function TaskTree({id, parentId, tasksById, filter, tasksLock, onUpdateTasksLock, onUpdateActiveTaskId, onCompleteTask, onCollapseTask, onDeleteTask, onUpdateFormText, onUpdateFormState}) {    
    console.log(tasksById);
    const task = tasksById[id];
    const childIds = task.childIds;

    // Show task if selected for by filter and not collapsed, and display children
    if (filter(task) && !task.collapsed) {
        return (
            <li>
                <Task 
                    task={task}
                    taskId={id}
                    parentId={parentId}
                    tasksLock={tasksLock}
                    onUpdateTasksLock={onUpdateTasksLock}
                    onUpdateActiveTaskId={onUpdateActiveTaskId}
                    onComplete={onCompleteTask}
                    onCollapse={onCollapseTask}
                    onDelete={onDeleteTask}
                    onUpdateFormText={onUpdateFormText}
                    onUpdateFormState={onUpdateFormState}
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
                                tasksLock={tasksLock}
                                onUpdateTasksLock={onUpdateTasksLock}
                                onUpdateActiveTaskId={onUpdateActiveTaskId}
                                onCompleteTask={onCompleteTask}
                                onCollapseTask={onCollapseTask}
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
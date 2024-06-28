import React, { useState, useEffect } from 'react';
import ToDoItem from './todo-item'; // Adjust the import based on your file structure
import { streamTodos } from '@/lib/firebase';

const ToDoList = ({ userId }: {userId: String}) => {
  const [todos, setTodos] = useState<any>([]);

  useEffect(() => {
    const unsubscribe = streamTodos(userId, setTodos);

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="overflow-x-auto">
        {todos.length === 0 ? (
           <p className="text-gray-500 text-center py-4">No todos available.</p>
        ) :
          todos.map((todo:any) => (
            <ToDoItem
              key={todo.id}
              onToggleComplete={() => {}}
              onDelete={() => {}}
              onEdit={() => {}}
              todo={todo}
            />
          )
        )}
    </div>
  );
};

export default ToDoList;

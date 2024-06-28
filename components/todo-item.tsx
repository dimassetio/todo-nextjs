import React, { useState } from 'react';
import Image from 'next/image';
import { FaCheck, FaEdit, FaTrash, FaImage, FaTimes } from 'react-icons/fa';
import ToDoForm from '@/components/todo-form'; // Import the ToDoForm component
import { completeTodo, updateTodo, deleteTodo, uploadFile } from '@/lib/firebase'; // Import deleteTodo function
import { toast } from 'react-toastify';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    imageUrl?: string;
  };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string, newDescription: string) => void; // Update onEdit callback to accept newDescription
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // State to store uploaded image file

  const handleToggleComplete = async () => {
    const newStatus = !todo.isCompleted;
    await completeTodo(todo.id, newStatus);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      try {
        await deleteTodo(todo.id);
        onDelete(todo.id); // Trigger parent onDelete callback
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditTodo = async (newTitle: string, newDescription: string) => {
    const data = {
      title: newTitle,
      description: newDescription,
    };

    try {
      await updateTodo(todo.id, data);
      onEdit(todo.id, newTitle, newDescription); // Trigger parent onEdit callback
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmitImageUpload = async () => {
    
    if (!imageFile) {
      closeImageDialog();
      return;
    }
  
    try {
      // Upload file to Firebase Storage
     
      const imageUrl = await uploadFile(imageFile);

      // Update Firestore document with the new image URL
      await updateTodo(todo.id, { imageUrl });
  
      // Close the image dialog
      closeImageDialog();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image: '+error);
    }
  };

  const openImageDialog = () => {
    setIsImageDialogOpen(true);
  };

  const closeImageDialog = () => {
    setIsImageDialogOpen(false);
    setImageFile(null);
  };

  return (
    <div className="flex items-center justify-between p-3 mb-3 bg-gray-800 rounded">
      <div className="flex-grow flex items-center">
        <div className="bg-gray-200 rounded-sm w-5 mx-2 md:mx-4 h-5 flex flex-shrink-0 justify-center items-center relative">
          <input
            placeholder="checkbox"
            type="checkbox"
            checked={todo.isCompleted}
            onChange={handleToggleComplete}
            className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
          />
          <div className="check-icon bg-indigo-700 text-white rounded-sm">
            {todo.isCompleted && <FaCheck className="icon icon-tabler icon-tabler-check" />}
          </div>
        </div>
        <div>
          <div className={`font-semibold text-lg ${todo.isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
            {todo.title}
          </div>
          <div className={`text-gray-500 ${todo.isCompleted ? 'line-through text-gray-500' : ''}`}>
            {todo.description}
          </div>
        </div>
      </div>
      {todo.imageUrl &&
        <Image
          className="mx-4"
          src={todo.imageUrl || '/logo.svg'} // Replace with appropriate placeholder image URL
          alt="Task Image"
          width={64}
          height={64}
          priority
        />
      }
      <div className="md:flex md:space-x-2 items-center ">
        <button
          onClick={openImageDialog}
          className="relative px-3 py-1 my-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <FaImage />
        </button>
        <button
          onClick={handleEditClick}
          className="relative px-3 py-1 my-2 bg-amber-500 text-white rounded hover:bg-amber-600 flex items-center"
        >
          <FaEdit />
        </button>
        <button
          onClick={handleDelete}
          className="relative px-3 py-1 my-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
        >
          <FaTrash />
        </button>
        
      </div>
      {isEditing && (
        <ToDoForm
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSubmit={handleEditTodo}
          initialTitle={todo.title}
          initialDescription={todo.description}
        />
      )}
      {isImageDialogOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-gray-700 p-5 rounded-lg shadow-lg w-96">
          <div className="flex items-center justify-between mb-5">
          <h1 className="text-white text-2xl">Task Form</h1>
          <button
            type="button"
            onClick={closeImageDialog}
            className="p-3 rounded-full text-white hover:bg-indigo-500"
          >
            <FaTimes />
          </button>
        </div>
          {imageFile ? (
            <div className="mb-4">
              <p className="font-semibold">Selected Image Preview:</p>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Selected Task Image"
                className="mt-2 rounded-lg"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          ) : (
            todo.imageUrl && (
              <div className="mb-4">
                <p className="font-semibold">Previous Image:</p>
                <img
                src={todo.imageUrl}
                alt="Selected Task Image"
                className="mt-2 rounded-lg"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              </div>
            )
          )}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <div className="mt-4 flex justify-end">
              <button
                onClick={
                  handleSubmitImageUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;

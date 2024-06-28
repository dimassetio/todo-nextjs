import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { auth } from '@/lib/firebase';
import { toast } from 'react-toastify';

interface ToDoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
  initialiD?: string; 
  initialTitle?: string; 
  initialDescription?: string; 
}

const ToDoForm: React.FC<ToDoFormProps> = ({ isOpen, onClose, onSubmit, initialTitle = '', initialDescription = '' }) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription]);

  const close = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('Failed to load user id');
    }

    onSubmit(title, description);
    setTitle('');
    setDescription('');
    onClose();
    toast.success('Data Updated successfully')
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 shadow flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-gray-700 m-2 p-4 md-p-10 rounded-lg shadow-xl w-96">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-white text-2xl">Task Form</h1>
          <button
            type="button"
            onClick={close}
            className="p-3 rounded-full text-white hover:bg-indigo-500"
          >
            <FaTimes />
          </button>
        </div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 rounded outline-none text-white placeholder-gray-500"
        />
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded outline-none text-white placeholder-gray-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ToDoForm;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import Image from "next/image";


import NavBar from '@/components/navbar';
import ToDoForm from '@/components/todo-form';
import ToDoItem from '@/components/todo-item';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToDoList from '@/components/todo-list';



function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null); 
        router.push('/sign-in'); 
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const addTask = async (title:String, description:string)=>{
    var uid = user?.uid;
    if(uid == null){
        throw new Error('Failed to load user id');
    }
    const todoData = {
        userId: uid,
        title,
        description,
        imageUrl: null,
        isCompleted: false
      };
  
      try {
        const response = await fetch('/api/addTodo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(todoData)
        });
  
        if (!response.ok) {
          throw new Error('Failed to add todo');
        }
  
        const result = await response.json();
        console.log('Todo added with ID:', result.id);
      } catch (error) {
        console.error('Error adding todo:', error);
      }
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className='bg-gray-900 min-h-screen text-white sm:px-6 w-full'>   
      <ToastContainer/>
      <NavBar userEmail={user?.email ?? ''} onSignOut={handleSignOut} />
      <div className="">
        <div className="px-4 md:px-10 py-4 md:py-7 text-white">
            <div className="flex items-center justify-between">
                <p tabIndex={0} className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-200">Your Tasks</p>
                <button onClick={() => setIsDialogOpen(true)} className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
                  <p className="text-sm font-medium leading-none text-white">Add Task</p>
              </button>
            </div>
        </div>
        <div className="overflow-x-auto">          
            {user?.uid ? (
                <ToDoList userId={user.uid} />
            ) : (
                <div className=""></div>
            )}
        </div>  
      </div>
      <ToDoForm
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={addTask}
      />
    </div>
  );
}

export default Home;
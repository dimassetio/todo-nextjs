import { initializeApp, getApps, firebase, getApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {getFirestore, collection, query, where, orderBy, getDocs, doc, updateDoc, onSnapshot, deleteDoc} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)
const firestore = getFirestore(app)
const storage = getStorage(app);

const streamTodos = (userId, setTodos) => {
  const q = query(
    collection(firestore, 'todos'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const updatedTodos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setTodos(updatedTodos);
  });
};

const updateTodo = async (id, data) => {
  const todoRef = doc(firestore, 'todos', id);
  await updateDoc(todoRef, data);
}

const deleteTodo = async (id, data) => {
  const todoRef = doc(firestore, 'todos', id);
  await deleteDoc(todoRef);
}

const completeTodo = async (id, isCompleted) => {
  const todoRef = doc(firestore, 'todos', id);
  await updateDoc(todoRef, {
    isCompleted: isCompleted,
  });
};

const uploadFile = async (file) => {
  const storageRef = ref(storage, 'todos/' + file.name);
  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);
  console.log('File uploaded successfully!', downloadURL);

  return downloadURL;
};

export {app, auth, firestore, storage, firebaseConfig, streamTodos, completeTodo, updateTodo, deleteTodo, uploadFile}


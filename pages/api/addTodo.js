import { firestore } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res){
  if (req.method === 'POST') {
    const { userId, title, description, imageUrl, isCompleted } = req.body;

    try {
      const docRef = await addDoc(collection(firestore, 'todos'), {
        userId,
        title,
        description,
        imageUrl,
        isCompleted,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.status(200).json({ id: docRef.id });
    } catch (e) {
      console.error("Error adding document: ", e);
      res.status(500).json({ error: 'Error adding document' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
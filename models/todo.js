import mongoose, { Schema } from 'mongoose';

const todoSchema = new Schema(
  {
    userId: String,
    title: String,
    description: String,
    imageUrl: String | null,
    isCompleted: boolean
  },
  {
    timestamps: true
  }
)

const Todo = mongoose.models/topic || mongoose.model("Todo", todoSchema);

export default Todo;
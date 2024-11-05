import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  rating: {
    average: number;
    count: number;
  };
  title: string;
  author: string;
  publishedDate: Date;
  publisher: string;
  description: string;
  coverImage: string;
  tags: string[];
  initialQty: number;
  qty: number;
}

const BookSchema: Schema = new Schema({
  rating: {
    average: { type: Number, required: true, default: 0 },
    count: { type: Number, required: true, default: 0 }
  },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  publisher: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  tags: [{ type: String }],
  initialQty: { type: Number, required: true },
  qty: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IBook>('Book', BookSchema);

import mongoose, { Schema, Document } from 'mongoose';

interface IRating {
  average: number;
  count: number;
}

export interface IBook extends Document {
  title: string;
  author: string;
  publishedDate: Date;
  publisher: string;
  description: string;
  coverImage: string;
  rating: IRating;
  tags: string[];
  initialQty: number;
  qty: number;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  publisher: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  tags: [{ type: String }],
  initialQty: { type: Number, required: true },
  qty: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IBook>('Book', BookSchema);

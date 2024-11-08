import mongoose, { Schema, Document } from 'mongoose';

export interface IBorrow extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  borrowedAt: Date;
  returnedAt?: Date;
  isReturned: boolean;
}

const BorrowSchema: Schema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  borrowedAt: { 
    type: Date, 
    default: Date.now 
  },
  returnedAt: { 
    type: Date,
    default: null
  },
  isReturned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IBorrow>('Borrow', BorrowSchema);

import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  estimatedPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  specialInstructions: {
    type: String,
    default: '',
  },
});

const CartSchema = new mongoose.Schema(
  {
    items: [CartItemSchema], // Array of cart items
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming there's a User model
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0, // Can be calculated before saving
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate totalPrice dynamically
CartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.estimatedPrice * item.quantity;
  }, 0);
  next();
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
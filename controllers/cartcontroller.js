import Cart from "../models/cartModel.js";
import usermodel from "../models/userModel.js";

const addtocart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.body.userid });

    if (!cart) {
      cart = new Cart({ userId: req.body.userid, items: [] });
    }

    let itemIndex = cart.items.findIndex((item) => item.itemName === req.body.itemName);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += req.body.quantity || 1;
    } else {
      cart.items.push({
        itemName: req.body.itemName,
        estimatedPrice: req.body.estimatedPrice,
        quantity: req.body.quantity || 1,
        specialInstructions: req.body.specialInstructions || "",
      });
    }

    await cart.save();
    res.json({ success: true, message: "Added to cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

const removecart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.body.userid });

    if (!cart) {
      return res.json({ success: false, message: "Cart not found" });
    }

    let itemIndex = cart.items.findIndex((item) => item.itemName === req.body.itemName);

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
    }

    await cart.save();
    res.json({ success: true, message: "Removed from cart", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};

const getcart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.body.userid });

    if (!cart) {
      return res.json({ success: false, message: "Cart not found", cart: { items: [], totalPrice: 0 } });
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

// New controller to clear the entire cart
const clearcart = async (req, res) => {
  try {
    let cart = await Cart.findOneAndUpdate(
      { userId: req.body.userid },
      { items: [], totalPrice: 0 },
      { new: true }
    );

    if (!cart) {
      return res.json({ success: false, message: "Cart not found" });
    }

    res.json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error clearing cart" });
  }
};

export { addtocart, removecart, getcart, clearcart };
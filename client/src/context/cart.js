import { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "../context/auth"; // <--- Added to track login/logout state



const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [auth, setAuth] = useAuth(); // <--- Track login/logout state



  useEffect(() => {
    let existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) setCart(JSON.parse(existingCartItem));
  }, []);


 // NEW: Clear cart on logout and save cart on login
 useEffect(() => {
  if (!auth?.token) {
    // If user logs out, clear the cart and localStorage
    setCart([]); // <--- Clears cart in the state
    localStorage.removeItem("cart"); // <--- Removes cart from localStorage
  } else {
    // If user logs in, restore cart from localStorage
    let existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) setCart(JSON.parse(existingCartItem)); // <--- Reloads cart from localStorage
  }
}, [auth?.token]); // <--- Trigger when the auth token changes



  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };

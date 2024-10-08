// ProductCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(
      (item) => item._id === product._id
    );

    let updatedCart;

    if (existingItemIndex !== -1) {
      updatedCart = cart.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item Added to cart");
  };

  return (
    <div className="card m-2" key={product._id}>
      <img
        src={`${process.env.REACT_APP_API_URL}/api/v1/product/product-photo/${product._id}`}
        className="card-img-top"
        // alt={`${product._id}`}
        alt={product.name}
      />
      <div className="card-body">
        <div className="card-name-price">
          <h5 className="card-title">{product.name}</h5>
          <h5 className="card-title card-price">
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h5>
        </div>
        <p className="card-text ">{product.description.substring(0, 60)}...</p>
        <div className="card-name-price">
          <button
            className="btn btn-info ms-1"
            onClick={() => navigate(`/product/${product.slug}`)}
          >
            More Details
          </button>
          <button
            className="btn btn-dark ms-1"
            onClick={() => addToCart(product)}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

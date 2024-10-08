import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import ProductCard from "./../components/ProductCard";
import axios from "axios";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  const getPrductsByCat = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log("Error fetching products by category", error);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container mt-5 category">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "60vh" }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <h4 className="text-center mb-4">Category - {category?.name}</h4>

            <h6 className="text-center mb-4">
              {products?.length} result(s) found
            </h6>
            <div className="row">
              {products?.map((p) => (
                <div className="col-md-4 mb-4" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;

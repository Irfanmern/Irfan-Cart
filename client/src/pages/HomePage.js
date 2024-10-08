import React, { useState, useEffect } from "react";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import axios from "axios";
import Layout from "./../components/Layout/Layout";
import ProductCard from "./../components/ProductCard";
import { AiOutlineReload } from "react-icons/ai";

import "../styles/Homepage.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //Get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetFilters = () => {
    setChecked([]);
    setRadio("");
    getAllProducts();
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts(); // Fetch initial products
  }, []);

  //Get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //Get Total Count of products
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  //Load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleFilter = (value, id) => {
    if (value) {
      setChecked([...checked, id]);
    } else {
      setChecked(checked.filter((c) => c !== id));
    }
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  // Handle price filter
  const handlePriceFilter = (e) => {
    const value = e.target.value;
    setRadio(value === radio ? "" : value); // Toggle radio button
  };

  //Get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"All Products - Best offers "}>
      {/* banner image */}
      <div
        id="carouselExampleInterval"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="1000">
            <img
              src="/images/shopping-sale-promoti.webp"
              className="banner-img"
              alt="bannerimage"
              width={"100%"}
            />
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img
              src="/images/Banner2.jpg"
              className="banner-img"
              alt="bannerimage"
              width={"100%"}
            />
          </div>
          <div className="carousel-item">
            <img
              src="/images/Banner3.jpg"
              className="banner-img"
              alt="bannerimage"
              width={"100%"}
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* banner image */}

      <div className="container-fluid row mt-3 home-page">
        {/* Below is filtur code  */}

        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
                checked={checked.includes(c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={handlePriceFilter} value={radio}>
              {Prices?.map((p, index) => (
                <div key={index}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>

          <div className="d-flex flex-column">
            <button className="btn btn-danger" onClick={resetFilters}>
              RESET FILTERS
            </button>
          </div>
        </div>

        {/* Above is filter code  */}

        {/* Below is the Card  */}
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>

          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <ProductCard product={p} key={p._id} />
            ))}
          </div>

          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "60vh", width: "100%" }}
                  >
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

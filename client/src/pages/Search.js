import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import "../styles/Homepage.css";
import "../styles/CategoryProductStyles.css";
import ProductCard from "./../components/ProductCard";

const Search = () => {

  
  const [values, setValues] = useSearch();



  return (
    <Layout>
      <div className="container mt-3 category">
        <h4 className="text-center">Search Resuts</h4>
        <h6 className="text-center">
          {values?.results.length < 1
            ? "No Products Found"
            : `Found ${values?.results.length}`}
        </h6>
        <div className="row">
          <div className="col-md-12 offset-1">
            <div className="d-flex flex-wrap">
              {values?.results.map((p) => (
                <ProductCard product={p} key={p._id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;

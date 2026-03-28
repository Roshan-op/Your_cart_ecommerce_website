import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Product from "../components/Product";
import ProductCarousel from "../components/ProductCarousel";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import HeroBanner from "../components/HeroBanner";
import TopFilter from "../components/TopFilter";


function HomeScreen({ history }) {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages } = productList;

  let keyword = history.location.search;

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  const handleSearch = (q) => {
    const search = q ? `?keyword=${encodeURIComponent(q)}` : '';
    dispatch(listProducts(search));
  }

  return (
    <div>
      {!keyword && <ProductCarousel />}
      {!keyword && <HeroBanner />}
      <TopFilter onSearch={handleSearch} />
      <h1 className="container">Latest products</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="container">
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center mt-3">
            <Paginate page={page} pages={pages} keyword={keyword} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;

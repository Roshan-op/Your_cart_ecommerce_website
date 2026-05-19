import React from "react";
import { Card, Button } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

function Product({ product }) {
  return (
    <Card className="my-3 p-3 product-card">
      <Link to={`/product/${product._id}`}>
        <div className="product-image-wrapper">
          <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
          <div className="image-overlay" />
        </div>
      </Link>
      <div className="product-badges">
        {product.countInStock > 10 && <div className="badge badge-new">Top</div>}
        {product.price && product.price < 1000 && <div className="badge badge-sale">Sale</div>}
      </div>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
              color={"#f8e825"}
            />
          </div>
        </Card.Text>
        <Card.Text className="my-3" as="h3">Rs.{product.price}</Card.Text>
        <div className="quick-actions">
          <Link to={`/product/${product._id}`} className="btn btn-outline-secondary btn-sm">View</Link>
          <Button variant="primary" size="sm">Add</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Product;
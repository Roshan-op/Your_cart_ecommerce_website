import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { useCart } from "../context/CartContext";
import Message from "../components/Message";

function CartScreen({ match, history }) {
  const { cartItems, addToCart, removeFromCart } = useCart();

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message variant="info">
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={`${item._id}-${item.selectedSize}-${item.selectedGender}`} className="py-3">
                <div className="cart-item-card d-flex align-items-center">
                  <div className="cart-thumb me-3">
                    <Image src={item.image} alt={item.name} rounded className="cart-img" />
                  </div>
                  <div className="flex-grow-1">
                    <Link to={`/product/${item._id}`} className="cart-title d-block mb-1">{item.name}</Link>
                    <div className="cart-price mb-2">Rs.{item.price}</div>
                    {item.selectedSize && <div style={{ fontSize: '0.85em', color: '#666' }}>Size: <strong>{item.selectedSize}</strong></div>}
                    {item.selectedGender && <div style={{ fontSize: '0.85em', color: '#666' }}>Gender: <strong>{item.selectedGender}</strong></div>}
                  </div>

                  <div className="qty-controls d-flex flex-column align-items-center">
                    <button
                      className="qty-btn"
                      onClick={() => addToCart(item, item.qty + 1, item.selectedSize, item.selectedGender)}
                      aria-label={`Increase quantity for ${item.name}`}
                    >
                      +
                    </button>
                    <div className="qty-count">{item.qty}</div>
                    <button
                      className="qty-btn"
                      onClick={() => {
                        if (item.qty > 1) addToCart(item, item.qty - 1, item.selectedSize, item.selectedGender);
                      }}
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      −
                    </button>
                  </div>

                  <div className="ms-3">
                    <Button variant="light" onClick={() => removeFromCart(item._id)} aria-label={`Remove ${item.name}`}>
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4} className="d-none d-md-block">
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
              </h2>
              <div className="cart-subtotal">Rs.
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </div>
            </ListGroup.Item>

            <ListGroup.Item>
              <div className="d-grid">
                <Button
                  type="button"
                  className="checkout-btn btn-primary"
                  size="lg"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                  aria-label="Proceed to checkout"
                >
                  Proceed To Checkout
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>

      {/* Mobile sticky checkout bar */}
      {cartItems.length > 0 && (
        <div className="mobile-checkout-bar d-md-none">
          <div className="mobile-checkout-left">
            <div className="muted">Subtotal</div>
            <div className="fw-bold">Rs.{cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}</div>
          </div>
          <div className="mobile-checkout-right">
            <Button className="checkout-btn w-100" size="lg" onClick={checkoutHandler} aria-label="Proceed to checkout">Checkout</Button>
          </div>
        </div>
      )}
    </Row>
  );
}

export default CartScreen;

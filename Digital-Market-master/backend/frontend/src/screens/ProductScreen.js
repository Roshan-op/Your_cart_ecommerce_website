import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  listProductsDetails,
  createProductReview,
  listProductRecommend,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

function ProductScreen({ match, history }) {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [mainImage, setMainImage] = useState("");

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productRecommend = useSelector(state=>state.productRecommend)
  const { loading:loadingRecommend, error:errorRecommend, products } = productRecommend

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }

    dispatch(listProductsDetails(match.params.id));
    dispatch(listProductRecommend(match.params.id))
  }, [dispatch, match, successProductReview]);

  useEffect(() => {
    if (product && product.image) {
      setMainImage(product.image);
    }
    // Set first available size as default
    if (product && product.available_sizes) {
      const sizes = product.available_sizes.split(',').map(s => s.trim());
      if (sizes.length > 0) {
        setSelectedSize(sizes[0]);
      }
    }
    // Set gender if product has one
    if (product && product.gender) {
      setSelectedGender(product.gender);
    }
  }, [product]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}&size=${selectedSize || ''}&gender=${selectedGender || ''}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(match.params.id, { rating, comment }));
  };

  const getAvailableSizes = () => {
    if (product && product.available_sizes) {
      return product.available_sizes.split(',').map(s => s.trim());
    }
    return [];
  };

  const getAdditionalImages = () => {
    if (product && product.additional_images) {
      try {
        return JSON.parse(product.additional_images);
      } catch {
        return [];
      }
    }
    return [];
  };

  const genderDisplay = {
    'male': '👨 Male',
    'female': '👩 Female',
    'both': '👥 Unisex/Both'
  };

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <div style={{ marginBottom: '15px' }}>
                <Image src={mainImage} alt={product.name} fluid />
              </div>
              
              {getAdditionalImages().length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                  <Image
                    src={product.image}
                    alt="Main"
                    style={{
                      width: '80px',
                      height: '80px',
                      cursor: 'pointer',
                      border: mainImage === product.image ? '2px solid #f8e825' : '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                    onClick={() => setMainImage(product.image)}
                  />
                  {getAdditionalImages().map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`Product ${idx + 1}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        cursor: 'pointer',
                        border: mainImage === img ? '2px solid #f8e825' : '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              )}
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color={"#f8e825"}
                  />
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Brand:</strong> {product.brand}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Gender:</strong> {genderDisplay[product.gender] || genderDisplay['both']}
                </ListGroup.Item>

                <ListGroup.Item>Price: Rs.{product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>Rs.{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <>
                      {/* Size Selection */}
                      {getAvailableSizes().length > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>
                              <strong>Size:</strong>
                            </Col>
                          </Row>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                            {getAvailableSizes().map((size) => (
                              <Button
                                key={size}
                                variant={selectedSize === size ? 'warning' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setSelectedSize(size)}
                                style={{ padding: '6px 12px' }}
                              >
                                {size}
                              </Button>
                            ))}
                          </div>
                        </ListGroup.Item>
                      )}

                      {/* Quantity Selection */}
                      <ListGroup.Item>
                        <Row>
                          <Col>Qty</Col>
                          <Col xs="auto" className="my-1">
                            <Form.Select
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </Form.Select>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      disabled={
                        product.countInStock === 0 || product.countInStock < 0 || (getAvailableSizes().length > 0 && !selectedSize)
                      }
                      type="button"
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <h1>Recommended Products</h1>
            {loadingRecommend ? <Loader /> : errorRecommend ? <Message variant='danger'>{errorRecommend} </Message> :
              (
                products.map(product => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Card className='my-3 rounded'>
                      <Link to={`/product/${product._id}`}>
                        <Card.Img src={product.image} varient='top' width="193" height="450" />
                        <Card.Title as='h2'>
                          <strong>{product.name}</strong>
                        </Card.Title>
                      </Link>
                    </Card>
                  </Col>
                ))
              )} 
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <h4>Reviews</h4>
              {product.reviews.length === 0 && (
                <Message variant="info">No Reviews</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} color="#f8e825" />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h4>Write a review</h4>
                  {loadingProductReview && <Loader />}
                  {successProductReview && (
                    <Message variant="success">Review Submitted</Message>
                  )}
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="5"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                        className="mt-3"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message variant="info">
                      Please <Link to="/login">login</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Carousel,
  ListGroup,
  Card,
  Button,
  Container,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../actions/productActions";

import style from "../styles/ProductDetails.module.scss";

import { listCategories } from "../actions/categoryActions";

const regex = /\\n|\\r\\n|\\n\\r|\\r/g;
const ProductScreen = ({ match }) => {
  const dispatch = useDispatch();

  const [properties, setProperties] = useState([]);
  const [images, setImages] = useState([]);

  const [propertyLabel, setPropertyLabel] = useState([]);

  const productDetails = useSelector((state) => state.productDetails);
  const { product } = productDetails;
  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  const settings = {
    dots: true,
    lazyLoad: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    className: style.slider,
    arrows: true,
    centerMode: true,
  };
  useEffect(() => {
    dispatch(listCategories());
  }, []);
  useEffect(() => {
    if (!product.name || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id));
    } else {
      setImages(product.image);
      setProperties(product.properties);
    }
  }, [dispatch, product, match]);

  useEffect(() => {
    if (product.name && categories.length) {
      setPropertyLabel(
        categories.find((x) => x.path === product.category).properties
      );
    }
  }, [product, categories]);

  return (
    <div className={style.body}>
      {/*<Link className="btn btn-light my-3" to="/">
        Go Back
  </Link>*/}
      {productDetails.loading ? (
        <h2>Loading...</h2>
      ) : productDetails.error ? (
        <h3>{productDetails.error}</h3>
      ) : (
        <Container>
          <Row>
            <Col md={7}>
              <Carousel className={style.slider}>
                {images.map((image) => (
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src={`/cdn/cdn/${image.link}`}
                      alt={image.alt}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>

            <Col md={5} className={style.sticky_col}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>*Profile*</Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Trạng thái:</Col>
                      <Col>
                        {product.countInStock > 0 ? "Còn hàng" : "Hết hàng"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Liên lạc với người bán
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={7}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item className={style.price}>
                  Giá : {product.price} ₫
                </ListGroup.Item>
                <ListGroup.Item className={style.description}>
                  Mô tả:
                  {product.description}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6>Chi tiết</h6>
                </ListGroup.Item>
                <ListGroup.Item className={style.prop_container}>
                  {console.log(propertyLabel)}
                  {propertyLabel.map((prop) => (
                    <div className={style.property}>
                      <img src={`/cdn/cdn/${prop.image.link}`}></img>
                      <span>
                        {prop.name} :{" "}
                        {properties.find((x) => x._id === prop._id).value}
                      </span>
                    </div>
                  ))}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default ProductScreen;

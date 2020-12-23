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
import Slider from "react-slick";

import style from "../styles/ProductDetails.module.scss";
import { faAlignCenter } from "@fortawesome/free-solid-svg-icons";
const ProductScreen = ({ match }) => {
  const dispatch = useDispatch();

  const [properties, setProperties] = useState([]);
  const [images, setImages] = useState([]);
  let [sliderItem, setSliderItem] = useState([]);

  const [propertyLabel, setPropertyLabel] = useState([]);

  const productDetails = useSelector((state) => state.productDetails);
  const { product } = productDetails;

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
    const getProductDetails = async () => {
      return await dispatch(listProductDetails(match.params.id)).then(() =>
        console.log(product)
      );
    };
    getProductDetails();
  }, [dispatch, match]);

  useEffect(() => {
    if (productDetails.loading == false) {
      setImages(product.image);
      setProperties(product.properties);
      setPropertyLabel(product.category.properties);
    }
  }, [dispatch, productDetails.loading]);

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
                <ListGroup variant="flush">
                  {propertyLabel.map((prop) => (
                    <ListGroup.Item>
                      <Row>
                        <Col>{prop.name}</Col>
                        <Col>
                          {properties.find((x) => x.key === prop.key).value}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
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
                  {product.price} ₫
                </ListGroup.Item>
                <ListGroup.Item>Mô tả: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default ProductScreen;

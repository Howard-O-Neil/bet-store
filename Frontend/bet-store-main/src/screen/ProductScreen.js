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
import Loader from "../components/Loader";
import Message from "../components/Message";
import Axios from "axios";
import {switchToMessage, repalceCurrentReceiver} from "../actions/chatBoxAction";

import {openChatBox} from "../actions/chatBoxAction";
import {GetProfilebyAccountID} from "../actions/profileAction"

const regex = /\\n|\\r\\n|\\n\\r|\\r/g;
const ProductScreen = ({ match }) => {
  // chat support
  const accountState = useSelector((state) => state.chatAccountInfo);
  const view = useSelector((state) => state.viewControl);

  //
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
      document.title = product.name;
      setImages(product.image);
      setProperties(product.properties);
    }
  }, [dispatch, product, match]);

  useEffect(() => {
    if (product.name && categories.length) {
      const cat = categories.find((x) => x.path === product.category);
      if (cat) setPropertyLabel(cat.properties);
      else dispatch(listCategories());
    }
  }, [product, categories]);



  const profile = useSelector( state=>state);

  /// minh handle

  const [infoSeller, setinfoSeller] = useState({isLoadding:true});
  const getProfileGlobal = useSelector(state => state.getProfileGlobal);

  useEffect(() => {
    if(productDetails.loading === false && productDetails.product !== { image: [], properties: [] } && productDetails.error !== null){
      dispatch(GetProfilebyAccountID(product.user)) // dien id vao day
    }
    
  }, [dispatch, product.user, productDetails.error, productDetails.loading, productDetails.product])
  
  useEffect(() => {
    if(infoSeller.isLoadding === true && getProfileGlobal.IsFetching === true&&infoSeller.payload === null){
      setinfoSeller({isLoadding:false, payload:getProfileGlobal.Payload})
    }
  }, [getProfileGlobal.IsFetching, getProfileGlobal.Payload, infoSeller.isLoadding, infoSeller.payload])
  
  
  return (
    <div className={style.body}>
      {/*<Link className="btn btn-light my-3" to="/">
        Go Back
  </Link>*/}
      {productDetails.loading ? (
        <Loader />
      ) : productDetails.error ? (
        <Message variant="danger">{productDetails.error}</Message>
      ) : (
        <Container>
          <Row>
            <Col md={7}>
              <ListGroup variant="flush">
                <ListGroup.Item>
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
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={5} className={style.sticky_col}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      {/* profile */}
                      <div className = {style.UserInfo}>
                        <div className = {style.img}>
                          <img src = "/cdn/cdn/10b51ddc2fdc2b3dfc078dfbe252e0e315122020.svg"></img>                          
                        </div>
                        <div className = {style.info}>
                          <p>Ng?????i b??n</p>
                          <p style = {{fontWeight: 'bold'}}>{(product.price/1000000)%2==1?"admin20":"admin20"}</p>
                        </div>
                      </div>

                      { infoSeller.isLoadding === false
                      ?<div>
                        <div>
                          <img alt = "avatar" src = {`/cdn/cdn/${infoSeller.payload.avatar}`}/>
                        </div>
                        <div>
                          <p>
                            Th??ng tin ng?????i b??n
                          </p>
                          <p>
                            {infoSeller.payload.name + " " + infoSeller.payload.surname}
                          </p>
                        </div>
                      </div>
                      :<p>??ang t???i ...</p>
                      }
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tr???ng th??i:</Col>
                      <Col>
                        {product.countInStock > 0 ? "C??n h??ng" : "H???t h??ng"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={e => {
                        if (sessionStorage.getItem("token") == null) {
                          alert("Ban ph???i ????ng nh???p tr?????c");
                          return;
                        }
                        if (accountState.id == product.user) {
                          alert("B???n kh??ng th??? chat v???i ch??nh b???n")
                        }
                        dispatch(openChatBox(true));
                        dispatch(repalceCurrentReceiver(product.user));
                        dispatch(switchToMessage());
                      }}
                    >
                      Li??n l???c v???i ng?????i b??n
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
                  Gi?? :{" "}
                  {new Intl.NumberFormat("vi-VI", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </ListGroup.Item>
                <ListGroup.Item className={style.description}>
                  M?? t???:
                  {product.description}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6>Chi ti???t</h6>
                </ListGroup.Item>
                <ListGroup.Item className={style.prop_container}>
                  {console.log(propertyLabel)}
                  {propertyLabel.map((prop) => (
                    <div className={style.property}>
                      <img src={`/cdn/cdn/${prop.image.link}`}></img>
                      <span>
                        {prop.name} :{" "}
                        {properties.find((x) => x._id === prop._id) &&
                          properties.find((x) => x._id === prop._id).value}
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

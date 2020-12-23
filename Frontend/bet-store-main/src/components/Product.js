import React from "react";
import style from "../styles/ProductDisplay.module.scss";
import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";
const Product = ({ product }) => {
  /*<Card>
      <Link to={`/product/${product._id}`}>
        {/* <Card.Img src={`/cdn/cdn/${product.image[0].link}`} variant="top" /> *
        <Card.Img
          src="https://dummyimage.com/250x250.jpg/5fa2dd/ffffff"
          variant="top"
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="h6">{product.price} ₫</Card.Text>
      </Card.Body>
    </Card>*/
  return (
    <div className={style.product_card}>
      <Link to={`/product/${product._id}`}>
        <div className={style.product_image}>
          <img src="https://dummyimage.com/250x250.jpg/5fa2dd/ffffff" />
        </div>
      </Link>
      <div className={style.product_info}>
        <h5>{product.name}</h5>
        <h6 className={style.price}>{product.price} ₫</h6>
        <div className={style.time}>
          -
          <ReactTimeAgo date={product.updatedAt} locale="vi" /> -
        </div>
      </div>
    </div>
  );
};

export default Product;

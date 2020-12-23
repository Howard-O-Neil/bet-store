import React from "react";
import { Link } from "react-router-dom";
import { Card, Container, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import style from "../styles/Category.module.scss";
const Category = ({ category }) => {
  return (
    <div className={style.category_items}>
      <a href="" title={category.name}>
        <img
          src="https://static.chotot.com/storage/chapy-pro/newcats/v8/1000.png"
          alt="alt"
        />
        <br />
        <span>{category.name}</span>
      </a>
    </div>
    /*<Container className={style.category} fluid>
      <Link to={`/category/${category._id}`}>
        {/* <Card.Img src={`/cdn/cdn/${product.image[0].link}`} variant="top" /> 
        <Image
          className={style.image}
          src="http://dummyimage.com/168x168.bmp/ff4444/ffffff"
          roundedCircle
        />
      </Link>
      <br />
      <Link className={style.categoryName} to={`/category/${category._id}`}>
        {category.name}
      </Link>
    </Container>*/
  );
};

export default Category;

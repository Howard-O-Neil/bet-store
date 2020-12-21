import React from "react";
import { Link } from "react-router-dom";
import { Card, Container, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Category = ({ category }) => {
  return (
    <div>
      <Link to={category.fullPath} title={category.name}>
        <img
          src="https://static.chotot.com/storage/chapy-pro/newcats/v8/1000.png"
          alt="alt"
        />
      </Link>
      <br />
      <span>{category.name}</span>
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

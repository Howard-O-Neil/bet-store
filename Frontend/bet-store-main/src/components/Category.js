import React from "react";
import { Link } from "react-router-dom";
import { Card, Container, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Category = ({ category }) => {
  return (
    <div>
      {category && (
        <>
          <Link to={`mua-ban${category.path}`} title={category.name}>
            <img
              src={`/cdn/cdn/${category.image.link}`}
              alt={category.image.alt}
            />
          </Link>
          <br />
          <span>{category.name}</span>
        </>
      )}
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

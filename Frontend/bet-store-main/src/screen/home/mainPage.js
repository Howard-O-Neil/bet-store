import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row } from "react-bootstrap";
import Product from "../../components/Product";
import Category from "../../components/Category";
import { listRandomProducts } from "../../actions/productActions";
import style from "../../styles/ProductDisplay.module.scss";
import { listCategories, resetCategory } from "../../actions/categoryActions";
import Carousel from "react-grid-carousel";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { LinkContainer } from "react-router-bootstrap";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [initialCategoryLoad, setInitialCategorylLoad] = useState(false);
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    document.title = "Bet Store";

    dispatch(listCategories({ parent: "" }));
    dispatch(listRandomProducts({}));
    setInitialCategorylLoad(true);
  }, []);
  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;
  return (
    <>
      <div className="container">
        <div className={style.categoryContainer}>
          <div className={style.category_header}>
            <h4 className={style.title}>Danh mục</h4>
          </div>

          {!initialCategoryLoad || loadingCategories ? (
            <Loader />
          ) : errorCategories ? (
            <Message variant="danger">{errorCategories}</Message>
          ) : (
            <Carousel
              cols={5}
              rows={2}
              gap={10}
              responsiveLayout={[
                {
                  breakpoint: 1200,
                  cols: 3,
                },
                {
                  breakpoint: 990,
                  cols: 2,
                },
                {
                  breakpoint: 500,
                  cols: 1,
                },
              ]}
              loop
            >
              {categories.map((category) => (
                <Carousel.Item>
                  <Category category={category} />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </div>
        <div className={`${style.productContainer} container`}>
          <div className={style.titleGroup}>
            <h4 className={style.title}>Sản phẩm</h4>
          </div>
          <div>
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <Row>
                {products.map((product) => (
                  <Product product={product} />
                ))}
              </Row>
            )}
          </div>
        </div>
      </div>
      <LinkContainer to="/mua-ban">
        <Button className={style.button} type="button" variant="primary">
          Xem Thêm
        </Button>
      </LinkContainer>
    </>
  );
};

export default HomeScreen;

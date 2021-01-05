import React, { useEffect, useState } from "react";
import Carousel from "react-grid-carousel";
import { useDispatch, useSelector } from "react-redux";
import ReactTimeAgo from "react-time-ago";
import { LinkContainer } from "react-router-bootstrap";
import { listCategories } from "../actions/categoryActions";
import {
  listProducts,
  loadDataIntoFilter,
  loadExactPage,
  loadNewPage,
  shuffleProduct,
  sortByAlphabet,
  sortByPrice,
} from "../actions/productActions";
import style from "../styles/CategoryView.module.scss";
import Loader from "../components/Loader";
import Message from "../components/Message";

const CategoryViewScreen = ({ match, location }) => {
  const keyword = new URLSearchParams(location.search).get("q");
  const category = match.params.category || "";
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  const [cats, setCats] = useState([]);

  useEffect(() => {
    if (categories.length) setCats([...categories]);
  }, [categories]);

  const productList = useSelector((state) => state.productList);
  const {
    loading,
    error,
    products,
    filteredProducts,
    filteredPages,
    currentPage,
    totalPages,
  } = productList;

  useEffect(() => {
    dispatch(listCategories({ parent: category }));
    dispatch(listProducts({ body: { category: category, keyword: keyword } }));
  }, [dispatch, keyword]);

  useEffect(() => {
    dispatch(loadDataIntoFilter({ countPerPage: 10 }));
    dispatch(shuffleProduct);
    dispatch(loadExactPage({ page: 1 }));
  }, [products]);

  const handleSubCategoryClick = (path) => {
    dispatch(listCategories({ parent: path }));
    dispatch(listProducts({ body: { category: path } }));
  };

  const nextPage = () => {
    dispatch(loadNewPage({ page: 1 }));
  };

  const previousPage = () => {
    dispatch(loadNewPage({ page: -1 }));
  };

  const goToPage = (page) => {
    dispatch(loadExactPage({ page }));
  };
  const sortByInput = (e) => {
    let value = e.target.value;
    let direction = value.endsWith("asc") ? "asc" : "desc";

    if (value.startsWith("price")) {
      dispatch(sortByPrice({ direction }));
    } else {
      dispatch(sortByAlphabet({ direction }));
    }
  };
  return (
    <div className={style.body}>
      <div className={`container ${style.catContainer}`}>
        {loadingCategories ? (
          <Loader />
        ) : errorCategories ? (
          <Message variant="danger">{errorCategories}</Message>
        ) : (
          <Carousel cols={6} rows={1} gap={3} loop>
            {cats &&
              cats.map((category) => (
                <Carousel.Item>
                  <div
                    className={`${style.subCategory}`}
                    onClick={() => handleSubCategoryClick(category.path)}
                  >
                    <img src={`/cdn/cdn/${category.image.link}`}></img>
                    <br />
                    <span>{category.name}</span>
                  </div>
                </Carousel.Item>
              ))}
          </Carousel>
        )}
      </div>

      <div className="container">
        <div className="d-flex justify-content-end">
          <select
            className={`custom-select col-sm-4 `}
            onChange={(e) => {
              sortByInput(e);
            }}
          >
            <option value="" disabled selected>
              Sort by
            </option>

            <option value="alphabet_asc">Name - A-Z</option>
            <option value="alphabet_desc">Name - Z-A</option>

            <option value="price_asc">Price - Lowest to Highest</option>
            <option value="price_desc">Price - Highest to Lowest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        filteredProducts &&
        filteredProducts.map((product) => (
          <LinkContainer to={`/product/${product._id}`}>
            <div className={`container  ${style.product}`}>
              <div className="media">
                <img
                  className="mr-3 mt-2 mb-2"
                  src={`/cdn/cdn/${product.image[0].link}`}
                ></img>
                <div className="media-body mt-2">
                  <h6>{product.name}</h6>
                  <p>
                    {new Intl.NumberFormat("vi-VI", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </p>
                  <i class="fas fa-clock"></i>
                  <ReactTimeAgo date={product.updatedAt} locale="vi" />
                </div>
              </div>
            </div>
          </LinkContainer>
        ))
      )}
      <div className="container">
        <nav
          className="d-flex justify-content-center"
          aria-label="Page navigation"
        >
          <ul className="pagination">
            <li
              className={`page-item ${currentPage === 1 && "disabled"}`}
              onClick={() => {
                currentPage !== 1 && previousPage();
              }}
            >
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </a>
            </li>
            {[...Array(filteredPages)].map((value, index) => (
              <li
                className={`page-item ${currentPage === index + 1 && "active"}`}
                onClick={() => goToPage(index + 1)}
              >
                <a className="page-link">{index + 1}</a>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages && "disabled"
              }`}
              onClick={() => {
                currentPage !== totalPages && nextPage();
              }}
            >
              <a className="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CategoryViewScreen;

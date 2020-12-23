import React, { useEffect } from "react";
import Carousel from "react-grid-carousel";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../actions/categoryActions";
import {
  listProducts,
  loadExactPage,
  loadNewPage,
  sortByAlphabet,
  sortByPrice,
} from "../actions/productActions";
import style from "../styles/CategoryView.module.scss";

const CategoryViewScreen = ({ match }) => {
  const category = match.params.category || "";
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  const productList = useSelector((state) => state.productList);
  const {
    loading,
    error,
    filteredProducts,
    filteredPages,
    currentPage,
    totalPages,
  } = productList;

  useEffect(() => {
    dispatch(listCategories({ parent: category }));
    dispatch(listProducts({ category: category }));
  }, [dispatch]);

  const handleSubCategoryClick = (path) => {
    //dispatch(listCategories({ parent: "/xe-co" }));
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
          <h2>Loading...</h2>
        ) : errorCategories ? (
          <h3>{errorCategories}</h3>
        ) : (
          <Carousel cols={6} rows={1} gap={3} loop>
            {categories.map((category) => (
              <Carousel.Item>
                <div
                  className={`${style.subCategory}`}
                  onClick={() => handleSubCategoryClick(category.fullPath)}
                >
                  <img src="http://dummyimage.com/100x100.png/cc0000/ffffff"></img>
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
        <h2>Loading...</h2>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        filteredProducts &&
        filteredProducts.map((product) => (
          <div className={`container  ${style.product} tile is-parent is-3`}>
            <div className="media tile is-child box">
              <img
                className="mr-3 mt-2 mb-2"
                src="http://dummyimage.com/100x100.png/cc0000/ffffff"
              ></img>
              <div className="media-body">
                {product.name}
                <p>{product.price}</p>
              </div>
            </div>
          </div>
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

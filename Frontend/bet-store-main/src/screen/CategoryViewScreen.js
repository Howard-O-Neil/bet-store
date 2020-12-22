import React, { useEffect } from "react";
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

const CategoryViewScreen = ({ match, location }) => {
  const category = location.pathname;
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
  } = productList;

  useEffect(() => {
    dispatch(listCategories({ parent: category }));
    dispatch(listProducts({ category: category }));
  }, [dispatch, location]);

  const handleSubCategoryClick = (path) => {
    //dispatch(listCategories({ parent: "/xe-co" }));
    dispatch(listProducts({ body: { category: path } }));
    console.log(location);
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
      <div
        className={`container ${style.subCategoryContainer} ${style.section}`}
      >
        {categories.map((subCategory) => (
          <div
            className={style.subCategory}
            onClick={() => handleSubCategoryClick(subCategory.fullPath)}
          >
            <img src="http://dummyimage.com/100x100.png/cc0000/ffffff"></img>

            <h5>{subCategory.name}</h5>
          </div>
        ))}
      </div>
      <div className="field is-grouped" style={{ alignItems: "center" }}>
        <div className="control">
          <div className="select">
            <select
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

        <div className="control" style={{ minWidth: "300px" }}>
          <input
            onChange={(e) => {
              this.filterByInput(e);
            }}
            style={{ width: "100%" }}
            placeholder="Filter by"
            type="text"
          />
        </div>
      </div>
      <div className="container">
        <nav className="pagination" role="navigation" aria-label="pagination">
          <button
            className="button pagination-previous"
            onClick={() => {
              previousPage();
            }}
          >
            Previous
          </button>
          <button
            className="button pagination-next"
            onClick={() => {
              nextPage();
            }}
          >
            Next page
          </button>
          <ul className="pagination-list">
            {[...Array(filteredPages)].map((value, index) => (
              <button
                className={`button pagination-link ${
                  currentPage === index + 1 ? "is-current" : ""
                }`}
                aria-label="Page 1"
                onClick={() => goToPage(index + 1)}
                aria-current="page"
              >
                {index + 1}
              </button>
            ))}
          </ul>
        </nav>
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
    </div>
  );
};

export default CategoryViewScreen;

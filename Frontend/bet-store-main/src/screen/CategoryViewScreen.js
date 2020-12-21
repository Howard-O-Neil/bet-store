import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../actions/categoryActions";
import { listProducts } from "../actions/productActions";
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
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listCategories({ parent: category }));
    dispatch(listProducts({ category: category }));
  }, [dispatch, location]);

  const handleSubCategoryClick = (path) => {
    //dispatch(listCategories({ parent: "/xe-co" }));
    dispatch(listProducts({ category: path }));
    console.log(location);
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

      {products.map((product) => (
        <div className={`container  ${style.product}`}>
          <div className="media">
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
      ))}
    </div>
  );
};

export default CategoryViewScreen;

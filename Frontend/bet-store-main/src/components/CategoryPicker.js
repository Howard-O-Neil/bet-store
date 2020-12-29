import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listCategories } from "../actions/categoryActions";
import style from "../styles/CategoryList.module.scss";

const CategoryPicker = ({ selectedPath, selectedPathName, setPath }) => {
  const dispatch = useDispatch();

  const [subCategoryList1, setSubCategoryList1] = useState([]);
  const [subCategoryList2, setSubCategoryList2] = useState([]);

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  const handleMainCategoryClick = (e) => {
    setSubCategoryList1(
      categories.filter((category) => {
        if (category.parent === e.target.id) return category;
      })
    );
    setPath(0, e.target.outerText, e.target.id);
  };

  useEffect(() => {
    console.log(selectedPathName);
    console.log(selectedPath);
  }, [selectedPathName]);

  const handleSubCategory1Click = (e) => {
    setSubCategoryList2(
      categories.filter((category) => {
        if (category.parent === e.target.id) return category;
      })
    );
    setPath(1, e.target.outerText, e.target.id);
  };

  const handleSubCategory2Click = (e) => {
    setPath(2, e.target.outerText, e.target.id);
  };

  const items = 10;
  return (
    <div className="container">
      <div className={style.catSelect}>
        <div
          className={`list-group list-group-flush overflow-auto ${style.catList}`}
        >
          {loadingCategories ? (
            <h2>Loading...</h2>
          ) : errorCategories ? (
            <h3>{errorCategories}</h3>
          ) : (
            categories.map(
              (category) =>
                category.parent === "" && (
                  <li
                    class={`list-group-item d-flex justify-content-between align-items-center ${
                      selectedPath.includes(category.path)
                        ? "active " + style.list_item_selected
                        : style.list_item
                    }`}
                    onClick={handleMainCategoryClick}
                    id={category.path}
                  >
                    {category.name}
                  </li>
                )
            )
          )}
        </div>
        <div
          className={`list-group list-group-flush overflow-auto ${style.catList}`}
        >
          {subCategoryList1.map((category) => (
            <li
              class={`list-group-item d-flex justify-content-between align-items-center ${
                selectedPath.includes(category.path)
                  ? "active " + style.list_item_selected
                  : style.list_item
              }`}
              onClick={handleSubCategory1Click}
              id={category.path}
            >
              {category.name}
            </li>
          ))}
        </div>
        <div
          className={`list-group list-group-flush overflow-auto ${style.catList}`}
        >
          {subCategoryList2.map((category) => (
            <li
              class={`list-group-item d-flex justify-content-between align-items-center ${
                selectedPath.includes(category.path)
                  ? "active " + style.list_item_selected
                  : style.list_item
              }`}
              onClick={handleSubCategory2Click}
              id={category.path}
            >
              {category.name}
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPicker;

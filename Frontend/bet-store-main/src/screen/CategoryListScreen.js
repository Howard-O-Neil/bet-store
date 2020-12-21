import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listCategories } from "../actions/categoryActions";
import style from "../styles/CategoryList.module.scss";

const CategoryListScreen = () => {
  const dispatch = useDispatch();

  const [subCategoryList1, setSubCategoryList1] = useState([]);
  const [subCategoryList2, setSubCategoryList2] = useState([]);
  const [selectedPathName, setSelectedPathName] = useState([]);
  const [selectedPath, setSelectedPath] = useState([]);
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
  const setPath = (pos, pathName, path) => {
    selectedPathName[pos] = pathName;
    setSelectedPathName(selectedPathName.slice(0, pos + 1));
    setSelectedPath(path);
  };

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
      <h1>Danh mục</h1>
      {selectedPathName.map((path, index) =>
        index == 0 ? <span>{path}</span> : <span>{" > " + path}</span>
      )}
      {selectedPath}
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
                    class={`list-group-item d-flex justify-content-between align-items-center ${style.list_item}`}
                    onClick={handleMainCategoryClick}
                    id={category.path}
                  >
                    {category.name}
                    <i
                      className={`fas fa-chevron-right ${style.arrow_icon}`}
                    ></i>
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
              class={`list-group-item d-flex justify-content-between align-items-center ${style.list_item}`}
              onClick={handleSubCategory1Click}
              id={category.path}
            >
              {category.name}
              <i className={`fas fa-chevron-right ${style.arrow_icon}`}></i>
            </li>
          ))}
        </div>
        <div
          className={`list-group list-group-flush overflow-auto ${style.catList}`}
        >
          {subCategoryList2.map((category) => (
            <li
              class={`list-group-item d-flex justify-content-between align-items-center ${style.list_item}`}
              onClick={handleSubCategory2Click}
              id={category.path}
            >
              {category.name}
              <i className={`fas fa-chevron-right ${style.arrow_icon}`}></i>
            </li>
          ))}
        </div>
        {/*<div class={`list-group ${style.catList}`}>
          <a href="#" class="list-group-item list-group-item-action">
            Dapibus ac facilisis in
          </a>
          <a href="#" class="list-group-item list-group-item-action">
            Dapibus ac facilisis in
          </a>
        </div>
        <div class={`list-group ${style.catList}`}>
          <a href="#" class="list-group-item list-group-item-action">
            Dapibus ac facilisis in
          </a>
          <a href="#" class="list-group-item list-group-item-action">
            Dapibus ac facilisis in
          </a>
                </div>*/}
      </div>
    </div>
  );
};

export default CategoryListScreen;

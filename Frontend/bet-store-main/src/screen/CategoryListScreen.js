import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { listCategories } from "../actions/categoryActions";
import { LinkContainer } from "react-router-bootstrap";

import style from "../styles/CategoryList.module.scss";

const CategoryListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const [sortedCategory, setSortedCategory] = useState([]);
  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  useEffect(() => {
    setSortedCategory(
      categories.sort((a, b) => {
        var textA = a.path;

        var textB = b.path;
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      })
    );
  }, [categories]);

  const createCategoryHandler = () => {
    history.push("/category/new");
  };

  return (
    <div className="container">
      <button
        type="button"
        class="btn btn-primary"
        onClick={createCategoryHandler}
      >
        <i className="fas fa-plus"></i> Thêm danh mục
      </button>

      <div className="table table-hover table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên danh mục</th>

            <th scope="col">Số thuộc tính</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {sortedCategory.map((category, index) => (
            <tr key={category._id}>
              <th scope="row">
                {[...Array(category.path.split("/").length - 2)].map(
                  (value) => (
                    <i class="fas fa-arrow-circle-right">&nbsp;</i>
                  )
                )}
              </th>
              <td className={`${category.parent === "" ? style.root_cat : ""}`}>
                {category.name}
              </td>

              <td>{category.properties.length}</td>
              <td>
                <LinkContainer to={`/category/${category._id}/edit`}>
                  <Button variant="light" className="btn-sm">
                    <i className="fas fa-edit"></i>
                  </Button>
                </LinkContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </div>
    </div>
  );
};

export default CategoryListScreen;

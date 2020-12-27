import React, { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  listCategories,
  listCategoryDetails,
  createCategory,
  updateCategory,
} from "../actions/categoryActions";

import ImageUpload from "../components/ImageUpload";
import style from "../styles/CategoryEdit.module.scss";

const CategoryEditScreen = ({ match, edit }) => {
  const isEdit = edit || false;
  const id = match.params.id;
  const dispatch = useDispatch();

  const [properties, setProperties] = useState([]);
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [parent, setParent] = useState("");

  const [image, setImage] = useState([]);
  const [defaultImage, setDefaultImage] = useState([]);
  const [imagePrview, setImagePreview] = useState([]);

  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyDefaultImage, setPropertyDefaultImages] = useState([]);
  const [propertyImagePreview, setPropertyImagePreview] = useState([]);

  const categoryDetails = useSelector((state) => state.categoryDetails);
  const {
    loading: loadingCategory,
    error: errorCategory,
    category,
  } = categoryDetails;

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  useEffect(() => {
    if (id) {
      if (!category.name || category._id !== id) {
        dispatch(listCategoryDetails(id));
      } else {
        setName(category.name);
        setPath(category.path);
        setParent(category.parent);
        setDefaultImage(category.image);
        handlePropImage(category.properties);
        setProperties(category.properties);
        console.log(category);
      }
    }

    dispatch(listCategories());
  }, [dispatch, category]);

  const handlePropImage = (prop) => {
    let tempArr = [];
    Object.values(prop).map((x) => {
      tempArr = [...tempArr, x.image];
    });
    setPropertyDefaultImages(tempArr);
    console.log(tempArr);
  };

  const onPropertyChange = (i, event) => {
    let values = [...properties];
    values[i].name = event.target.value;
    setProperties(values);
  };

  const onCategoryChange = (e) => {
    setParent(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const category = {
      name: name,
      path: parent + path,
      image: defaultImage,
      properties: properties,
      parent: parent,
    };
    const imagesToUpload = new FormData();
    for (var x = 0; x < image.length; x++) {
      imagesToUpload.append("files", image[x], image[x].name);
    }
    if (!isEdit) {
      for (var x = 0; x < propertyImages.length; x++) {
        imagesToUpload.append(
          "files",
          propertyImages[x],
          propertyImages[x].name
        );
      }
      dispatch(createCategory(category, imagesToUpload));
    } else {
      dispatch(updateCategory(id, category, imagesToUpload, propertyImages));
    }
    //dispatch(createCategory(category, imagesToUpload));
  };
  const onAddPropety = (e) => {
    setProperties([...properties, { name: "", image: {} }]);
  };

  const onImageChange = (event) => {
    if (defaultImage) {
      setDefaultImage();
      console.log("del");
    }
    setImage([...event.target.files]);
  };
  const onReset = () => {
    console.log(defaultImage);
  };
  const deleteImage = () => {
    setImage([]);
  };

  const deleteDefaultImage = (index) => {
    setDefaultImage([]);
    // console.log("deldefault");
    //console.log(defaultImage);
  };

  const onPropertyImageChange = (index, event) => {
    if (propertyDefaultImage[index]) {
      deletePropertyDefaultImage(index);
    }
    let propImg = [...propertyImages];
    propImg[index] = event.target.files[0];
    setPropertyImages(propImg);
  };

  const deletePropertyImage = (index) => {
    let arr = [...propertyImages];
    arr[index] = undefined;
    setPropertyImages(arr);
    console.log(propertyImages);
  };

  const deletePropertyDefaultImage = (index) => {
    let arr = [...propertyDefaultImage];
    arr[index] = undefined;
    setPropertyDefaultImages(arr);
    console.log(index);
  };
  useEffect(() => {
    setPropertyImagePreview(
      propertyImages.map(
        (file) =>
          file &&
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
      )
    );
  }, [propertyImages]);

  useEffect(() => {
    setImagePreview(
      image.map((x) =>
        Object.assign(x, {
          preview: URL.createObjectURL(x),
        })
      )
    );
  }, [image]);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      imagePrview.forEach((picture) => URL.revokeObjectURL(picture.preview));
    },
    [imagePrview]
  );

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      propertyImagePreview.forEach(
        (picture) => picture && URL.revokeObjectURL(picture.preview)
      );
    },
    [propertyImagePreview]
  );

  return (
    <div className="container">
      <Container className={style.form_section}>
        <h1>Chỉnh sửa danh mục</h1>
        {loadingCategory || loadingCategories ? (
          <h3>Loading</h3>
        ) : errorCategory || errorCategories ? (
          <h3>{errorCategory}</h3>
        ) : (
          <>
            <Form>
              <Form.Group controlId="name">
                <Form.Label>Tên danh mục</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Nhập tên danh mục"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="path">
                <Form.Label>Đường dẫn danh mục</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập đường dẫn danh mục"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="parent">
                <Form.Label>Danh mục cha</Form.Label>
                <Form.Control as="select" onChange={(e) => onCategoryChange(e)}>
                  <option value="" selected>
                    root
                  </option>
                  {categories.map((x) =>
                    x.parent === category.path ? (
                      <option value={x.path} selected>
                        {x.name}
                      </option>
                    ) : (
                      <option value={x.path}>{x.name}</option>
                    )
                  )}
                </Form.Control>
              </Form.Group>
            </Form>
            <Form.Group controlId="image">
              <Form.Label>Hình ảnh hiển thị</Form.Label>
              <ImageUpload
                defaultImages={isEdit && defaultImage ? [defaultImage] : []}
                images={imagePrview}
                onChange={onImageChange}
                onDel={deleteImage}
                onDelDefault={deleteDefaultImage}
                multiple={false}
              ></ImageUpload>
            </Form.Group>

            <Form.Group controlId="properties">
              {properties.map((property, index) => (
                <div key={index}>
                  <Form.Label>Thuộc tính {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên thuộc tính"
                    value={property.name}
                    onChange={(e) => onPropertyChange(index, e)}
                  ></Form.Control>
                  <ImageUpload
                    defaultImages={
                      propertyDefaultImage[index] && [
                        propertyDefaultImage[index],
                      ]
                    }
                    images={
                      propertyImagePreview[index] && [
                        propertyImagePreview[index],
                      ]
                    }
                    onChange={(e) => onPropertyImageChange(index, e)}
                    onDel={(e) => deletePropertyImage(index)}
                    onDelDefault={(e) => deletePropertyDefaultImage(index)}
                    multiple={false}
                  ></ImageUpload>
                </div>
              ))}
            </Form.Group>
            <br />
          </>
        )}
      </Container>

      <Container className={style.btn_container}>
        <button
          className={`btn btn-outline-dark ${style.button}`}
          onClick={onReset}
        >
          Reset
        </button>
        <button className={`btn btn-outline-dark ${style.button}`}>Hủy</button>
        <button
          className={`btn btn-primary ${style.button}`}
          onClick={submitHandler}
        >
          Lưu
        </button>
        <button
          className={`btn btn-primary ${style.button}`}
          onClick={onAddPropety}
        >
          Thêm thuộc tính
        </button>
      </Container>
    </div>
  );
};

export default CategoryEditScreen;

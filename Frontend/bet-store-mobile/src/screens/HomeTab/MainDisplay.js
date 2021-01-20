import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { listRandomProducts } from "../../actions/productActions";
import { listCategories } from "../../actions/categoryActions";
import { NodeAPI, CDNAPI } from "../../../define";
import ReactTimeAgo from "react-time-ago";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import "intl";
import "intl/locale-data/jsonp/vi";
import TimeAgo from "../../components/TimeAgo";

const MainDisplay = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

  const trimCategoryName = (name) => {
    if (name.length > 21) {
      return name.slice(0, 21) + "...";
    }
    return name;
  };
  const trimProductName = (name) => {
    if (name.length > 40) {
      return name.slice(0, 40) + "...";
    }
    return name;
  };

  useEffect(() => {
    dispatch(listRandomProducts({}));
    dispatch(listCategories({ parent: "" }));
  }, [dispatch]);
  return (
    <ScrollView style={{ backgroundColor: "#f4f4f4" }}>
      <View style={styles.categoryContainer}>
        <Text style={styles.header}>Khám phá danh mục</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={true}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.categories}>
            {categories &&
              categories.map((category) => (
                <View style={styles.category} key={category._id}>
                  <Image
                    style={styles.categoryImage}
                    source={{ uri: `${CDNAPI}/cdn/${category.image.link}` }}
                  ></Image>
                  <Text style={styles.categoryText}>
                    {trimCategoryName(category.name)}
                  </Text>
                </View>
              ))}
          </View>
        </ScrollView>
      </View>
      {
        <View style={styles.productContainer}>
          <Text style={styles.header}>Tin đăng mới</Text>
          <View>
            <View style={styles.products}>
              {products &&
                products.map((product) => (
                  <View style={styles.product} key={product._id}>
                    <Image
                      style={styles.productImage}
                      source={{ uri: `${CDNAPI}/cdn/${product.image[0].link}` }}
                    ></Image>
                    <Text style={styles.productText}>
                      {trimProductName(product.name)}
                    </Text>
                    <Text style={styles.price}>
                      {new Intl.NumberFormat("vi-VI", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </Text>
                    <Text style={styles.time}>
                      <TimeAgo date={product.updatedAt} locale="vi"></TimeAgo>
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: "#fff",
  },
  header: {
    marginVertical: 10,
    marginLeft: 6,
    fontWeight: "bold",
  },
  categories: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    height: 260,
  },
  category: {
    borderStyle: "solid",
    width: 130,
    height: 130,
    borderWidth: 0,
    borderColor: "black",
    position: "relative",
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  categoryImage: {
    width: 70,
    height: 70,
    marginLeft: "auto",
    marginRight: "auto",
  },
  categoryText: {
    textAlign: "center",
    fontSize: 15,
  },
  productContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
  },
  products: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  product: {
    borderStyle: "solid",
    width: "50%",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: "#f4f4f4",
    position: "relative",
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  productImage: {
    width: "90%",
    height: 160,
    marginLeft: "auto",
    marginRight: "auto",
    resizeMode: "cover",
    borderRadius: 5,
  },
  productText: {
    textAlign: "left",
    marginLeft: 10,

    marginTop: 5,

    fontSize: 15,
    minHeight: 40,
  },
  price: {
    marginLeft: 10,
    color: "red",
    fontWeight: "bold",
  },
  time: {
    marginVertical: 5,
    marginLeft: 10,
  },
});

export default MainDisplay;

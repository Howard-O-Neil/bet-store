import { FontAwesome, Fontisto, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextBase,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import { Screen } from "react-native-screens";
import { SvgUri } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { CDNAPI } from "../../define";
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
import TimeAgo from "../components/TimeAgo";

const GRID_MODE = "0";
const LIST_MODE = "1";

const CategoryDetailsScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const category = route.params.category || "";
  const keyword = route.params.keyword || "";
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
    products,
    filteredProducts,
    filteredPages,
    currentPage,
    totalPages,
  } = productList;

  const [viewMode, setViewMode] = useState(GRID_MODE);
  useEffect(() => {
    dispatch(loadDataIntoFilter({ countPerPage: 10 }));
    dispatch(shuffleProduct);
    dispatch(loadExactPage({ page: 1 }));
  }, [products]);
  useEffect(() => {
    dispatch(listCategories({ parent: category }));
    dispatch(listProducts({ category: category, keyword: keyword }));
  }, [dispatch, keyword]);

  useEffect(() => {
    dispatch(loadDataIntoFilter({ countPerPage: 10 }));
    dispatch(shuffleProduct);
    dispatch(loadExactPage({ page: 1 }));
  }, [products]);

  const handleSubCategoryClick = (path) => {
    dispatch(listCategories({ parent: path }));
    dispatch(listProducts({ category: path }));
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
  const sortByInput = (value) => {
    let direction = value.endsWith("asc") ? "asc" : "desc";

    if (value.startsWith("price")) {
      dispatch(sortByPrice({ direction }));
    } else {
      dispatch(sortByAlphabet({ direction }));
    }
  };

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
  const handleToggleGridView = () => {
    if (viewMode === GRID_MODE) setViewMode(LIST_MODE);
    else setViewMode(GRID_MODE);
  };
  return (
    <Screen>
      <ScrollView style={{ backgroundColor: "#f4f4f4" }}>
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categories}>
              {categories &&
                categories.map((category) => (
                  <TouchableOpacity
                    style={styles.category}
                    key={category._id}
                    onPress={() => handleCategoryClick(category.path)}
                  >
                    {category.image.link.slice(-4) !== ".svg" ? (
                      <Image
                        style={styles.categoryImage}
                        source={{
                          uri: `${CDNAPI}/cdn/${category.image.link}`,
                        }}
                      ></Image>
                    ) : (
                      <SvgUri
                        style={styles.categoryImage}
                        uri={`${CDNAPI}/cdn/${category.image.link}`}
                      />
                    )}
                    <Text style={styles.categoryText}>
                      {trimCategoryName(category.name)}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
        <View style={styles.optionsContainer}>
          <DropDownPicker
            items={[
              { label: "Name - A-Z", value: "alphabet_asc" },
              { label: "Name - Z-A", value: "alphabet_desc" },
              { label: "Price - Lowest to Highest", value: "price_asc" },
              { label: "Price - Highest to Lowest", value: "price_desc" },
            ]}
            containerStyle={styles.dropdown}
            onChangeItem={(item) => sortByInput(item.value)}
            defaultValue={null}
            placeholder="Sort by"
          ></DropDownPicker>
          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => handleToggleGridView()}
          >
            <MaterialIcons
              name={viewMode === GRID_MODE ? "grid-on" : "grid-off"}
              size={40}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.productContainer}>
          <View>
            <View style={styles.products}>
              {filteredProducts &&
                filteredProducts.map((product) => (
                  <View
                    style={
                      viewMode === GRID_MODE
                        ? styles.productGrid
                        : styles.productList
                    }
                    key={product._id}
                  >
                    <Image
                      style={
                        viewMode === GRID_MODE
                          ? styles.productImage
                          : styles.productImageList
                      }
                      source={{
                        uri: `${CDNAPI}/cdn/${product.image[0].link}`,
                      }}
                    ></Image>
                    <View style={viewMode !== GRID_MODE && styles.info}>
                      <Text style={styles.productText}>
                        {viewMode === GRID_MODE
                          ? trimProductName(product.name)
                          : product.name}
                      </Text>
                      <Text style={styles.price}>
                        {new Intl.NumberFormat("vi-VI", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </Text>
                      <Text style={styles.time}>
                        <FontAwesome name="clock-o"> </FontAwesome>
                        <TimeAgo date={product.updatedAt} locale="vi"></TimeAgo>
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: "#fff",
  },

  categories: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
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
    marginTop: 10,
  },
  products: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  productGrid: {
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
  productList: {
    borderStyle: "solid",
    width: "100%",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: "#f4f4f4",
    position: "relative",
    paddingVertical: 7,
    paddingHorizontal: 5,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  productImage: {
    width: "90%",
    height: 160,
    marginLeft: "auto",
    marginRight: "auto",
    resizeMode: "cover",
    borderRadius: 5,
  },
  productImageList: {
    width: 100,
    height: 100,

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
    color: "grey",
  },
  optionsContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  info: {
    width: "75%",
  },
  gridButton: {},
  dropdown: {
    width: "90%",
  },
});

export default CategoryDetailsScreen;

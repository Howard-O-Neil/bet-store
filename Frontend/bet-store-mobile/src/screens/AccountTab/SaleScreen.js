import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
import { showMessage } from "react-native-flash-message";

import { Screen } from "react-native-screens";
import { useDispatch, useSelector } from "react-redux";
import { CDNAPI } from "../../../define";
import { listCategories } from "../../actions/categoryActions";
import {
  deleteProduct,
  listProducts,
  loadDataIntoFilter,
  loadExactPage,
  loadNewPage,
  shuffleProduct,
  sortByAlphabet,
  sortByPrice,
} from "../../actions/productActions";
import TimeAgo from "../../components/TimeAgo";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
  PRODUCT_LIST_RESET,
  PRODUCT_UPDATE_RESET,
} from "../../constants/productConstants";

const SaleScreen = ({ navigation }) => {
  const dispatch = useDispatch();
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
  const profile = useSelector((state) => state.profile);
  const {
    Payload: { accountID },
  } = profile;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: createLoading,
    error: createError,
    success: createSuccess,
  } = productCreate;
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
  } = productUpdate;

  useEffect(() => {
    dispatch(loadDataIntoFilter({ countPerPage: 10 }));
    dispatch(shuffleProduct);
    dispatch(loadExactPage({ page: 1 }));
  }, [products]);
  useEffect(() => {
    dispatch({ type: PRODUCT_LIST_RESET });
    if (createSuccess) dispatch({ type: PRODUCT_CREATE_RESET });
    if (successDelete) dispatch({ type: PRODUCT_DELETE_RESET });
    if (updateSuccess) dispatch({ type: PRODUCT_UPDATE_RESET });
    dispatch(listProducts({ user: accountID }));
  }, [dispatch, successDelete, createSuccess, updateSuccess]);

  useEffect(() => {
    dispatch(loadDataIntoFilter({ countPerPage: 10 }));
    dispatch(shuffleProduct);
    dispatch(loadExactPage({ page: 1 }));
  }, [products]);

  useEffect(() => {
    if (!loadingDelete) {
      if (!successDelete) {
        if (errorDelete) {
          showMessage({
            message: "Không thành công\n" + errorDelete,
            type: "danger",
            icon: "danger",
          });
        }
      } else {
        showMessage({
          message: "Thành công\n",
          type: "success",
          icon: "success",
        });
      }
    }
  }, [dispatch, loadingDelete]);

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

  const handlePlusButton = () => {
    navigation.navigate("NewProduct");
  };

  const handleEditButton = (product) => {
    navigation.navigate("EditProduct", { product: product, edit: true });
  };
  const handleDelButton = (id) => {
    Alert.alert(
      "Thông báo",
      "Bạn có chắc muốn xóa sản phẩm",
      [
        { text: "OK", onPress: () => dispatch(deleteProduct(id)) },
        {
          text: "Không",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <Screen>
      <View>
        <View style={styles.productList}>
          <TouchableOpacity
            onPress={handlePlusButton}
            style={[styles.productImageList, styles.plusButton]}
          >
            <AntDesign
              style={styles.plusIcon}
              name="plus"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <View style={[styles.info, styles.btnText]}>
            <Text>Thêm sản phẩm</Text>
          </View>
        </View>
      </View>
      {filteredProducts && filteredProducts.length > 0 && (
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
        </View>
      )}
      <ScrollView style={{ backgroundColor: "#f4f4f4" }}>
        <View style={styles.productContainer}>
          <View>
            <View style={styles.products}>
              {filteredProducts &&
                filteredProducts.map((product) => (
                  <View style={styles.productList} key={product._id}>
                    <Image
                      style={styles.productImageList}
                      source={{
                        uri: `${CDNAPI}/cdn/${product.image[0].link}`,
                      }}
                    ></Image>
                    <View style={styles.info}>
                      <Text style={styles.productText}>{product.name}</Text>
                      <Text style={styles.price}>
                        {new Intl.NumberFormat("vi-VI", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </Text>
                      <Text style={styles.time}>
                        <FontAwesome name="clock-o"> </FontAwesome>
                        {"Đã đăng "}
                        <TimeAgo date={product.updatedAt} locale="vi"></TimeAgo>
                      </Text>
                    </View>
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        style={[styles.button, styles.editButton]}
                        onPress={() => handleEditButton(product)}
                      >
                        <View style={styles.center}>
                          <AntDesign name="edit" size={24} color="black" />
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.button, styles.delButton]}
                        onPress={() => handleDelButton(product._id)}
                      >
                        <View style={styles.center}>
                          <FontAwesome name="trash" size={24} color="white" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </View>

        {!filteredProducts ||
          (!filteredProducts.length > 0 && (
            <View
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                flex: 1,
                justifyContent: "center",
                flexWrap: "wrap",
                flexDirection: "row",
              }}
            >
              <FontAwesome5 name="box-open" size={24} color="black" />
              <Text> Chưa có sản phẩm</Text>
            </View>
          ))}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    backgroundColor: "#fff",
    marginTop: 10,
  },
  products: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  plusButton: {
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  plusIcon: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  boxIcon: {},
  btnText: {
    justifyContent: "center",
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
    backgroundColor: "#fff",
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
  dropdown: {
    width: "100%",
    height: 50,
  },
  buttons: {
    position: "absolute",
    right: 0,
    bottom: 45,
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 5,
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: 5,
  },
  editButton: {
    borderWidth: 1,
    borderStyle: "dashed",
  },
  delButton: {
    backgroundColor: "#ff4d4d",
  },
  center: {
    marginTop: "auto",
    marginBottom: "auto",
  },
});

export default SaleScreen;

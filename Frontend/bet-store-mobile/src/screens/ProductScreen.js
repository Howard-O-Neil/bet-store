import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { Screen } from "react-native-screens";
import { useDispatch, useSelector } from "react-redux";
import { SliderBox } from "react-native-image-slider-box";
import { CDNAPI } from "../../define";
import { FontAwesome } from "@expo/vector-icons";
import TimeAgo from "../components/TimeAgo";
import { ScrollView } from "react-native-gesture-handler";
import { listCategories } from "../actions/categoryActions";
import { listProducts, listRandomProducts } from "../actions/productActions";
import ProductCard from "../components/ProductCard";
const ProductScreen = () => {
  const route = useRoute();
  const product = route.params.product;

  const dispatch = useDispatch();

  const [properties, setProperties] = useState([]);
  const [images, setImages] = useState([]);
  const [propertyLabel, setPropertyLabel] = useState([]);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const [randProducts, setRandProduct] = useState([]);

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;
  const handleImage = (img) => {
    let imageList = [];
    img.map(
      (image) => (imageList = [...imageList, `${CDNAPI}/cdn/${image.link}`])
    );
    setImages(imageList);
  };
  useEffect(() => {
    setProperties(product.properties);
    handleImage(product.image);
    dispatch(listCategories({ path: product.category }));
    dispatch(
      listRandomProducts({ category: product.category, countPerPage: 5 })
    );
  }, [product]);

  useEffect(() => {
    if (categories && categories.length)
      setPropertyLabel(categories[0].properties);
  }, [categories]);

  useEffect(() => {
    if (products) setRandProduct(products);
  }, [products]);
  return (
    <Screen style={{ backgroundColor: "#fff" }}>
      <ScrollView onS>
        <SliderBox
          images={images}
          sliderBoxHeight={320}
          resizeMethod={"resize"}
          ImageComponentStyle={styles.image}
        ></SliderBox>
        <View style={styles.section}>
          <Text style={styles.name}>{product.name}</Text>
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
        <View style={styles.section}>
          <Text>Profile</Text>
        </View>
        <View style={styles.section}>
          <Text>{product.description}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.propertyContainer}>
            {propertyLabel &&
              propertyLabel.map((label) => (
                <View style={styles.property}>
                  <Image
                    style={styles.propertiesImage}
                    source={{ uri: `${CDNAPI}/cdn/${label.image.link}` }}
                  ></Image>
                  <Text style={styles.propText}>
                    {label.name} :{" "}
                    {properties.find((x) => x._id === label._id) &&
                      properties.find((x) => x._id === label._id).value}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        <ScrollView horizontal>
          {randProducts &&
            randProducts.length > 0 &&
            randProducts.map((product) => (
              <ProductCard {...product}></ProductCard>
            ))}
        </ScrollView>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
  },
  price: {
    color: "red",
    fontWeight: "bold",
    marginBottom: 5,
  },
  name: {
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 20,
  },
  time: {
    marginBottom: 5,

    color: "grey",
  },
  section: {
    borderBottomWidth: 0.3,
    borderBottomColor: "grey",
    marginHorizontal: 10,
    paddingVertical: 5,
  },
  propertyContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  property: {
    display: "flex",
    width: "50%",

    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  propertiesImage: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  propText: {
    paddingLeft: 4,
  },
});

export default ProductScreen;

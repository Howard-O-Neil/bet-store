import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import { useDispatch } from "react-redux";
import { PRODUCT_LIST_RESET } from "../constants/productConstants";
import AppTextInput from "./AppTextInput";

const SearchBar = (props) => {
  const dispatch = useDispatch();
  const route = useRoute();

  const navigation = useNavigation();
  const handleSearch = () => {
    dispatch({ type: PRODUCT_LIST_RESET });
    if (route.name !== "Category")
      navigation.navigate("Category", { category: "", keyword: keyword });
    else navigation.setParams({ keyword: keyword, category: "" });
  };
  const [keyword, setKeyword] = useState(
    route.params && route.params.keyword ? route.params.keyword : ""
  );
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.bar}
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
      ></TextInput>

      <TouchableOpacity style={styles.btn} onPress={handleSearch}>
        <AntDesign name="search1" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
  },
  btn: {},
  bar: {
    width: "90%",
  },
});
export default SearchBar;

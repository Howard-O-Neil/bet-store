import React from "react";
import { View, StyleSheet, Image } from "react-native";

import AppText from "./Text";
import colors from "../config/colors";
import { CDNAPI } from "../../define";

function ProductCard({ name, price, image }) {
  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{ uri: `${CDNAPI}/cdn/${image[0].link}` }}
      />
      <View style={styles.detailsContainer}>
        <AppText style={styles.title}>{name}</AppText>
        <AppText style={styles.price}>
          {new Intl.NumberFormat("vi-VI", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
    width: 250,
    margin: 10,
    borderWidth: 0.5,
  },
  detailsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  image: {
    width: 250,
    height: 180,
    resizeMode: "cover",
  },
  price: {
    color: "red",
    fontWeight: "bold",
  },
  title: {
    marginBottom: 7,
    minHeight: 50,
  },
});

export default ProductCard;

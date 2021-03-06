import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Screen } from "react-native-screens";
import AppButton from "../components/AppButton";
import AppFormField from "../components/AppFormField";
import AppTextInput from "../components/AppTextInput";
import Text from "../components/Text";
import * as Yup from "yup";
import AppFormPicker from "../components/AppFormPicker";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../actions/categoryActions";
import * as ImagePicker from "expo-image-picker";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { uploadImage } from "../actions/imageActions";
import { createProduct, updateProduct } from "../actions/productActions";
import { create } from "yup/lib/Reference";
import { Modal } from "react-native-paper";
import { showMessage } from "react-native-flash-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CDNAPI } from "../../define";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Ten san pham"),
  price: Yup.number().required().label("Gia"),
  countInStock: Yup.number().required().label("So luong"),
  description: Yup.string().required().label("Mo ta"),
});
const AddProductScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const edit = (route && route.params && route.params.edit) || false;
  const product = edit ? route.params.product : {};

  const [modalVisible, setModalVisible] = useState(false);
  const [selectImageDialog, setSelectImageDialog] = useState(false);
  const [images, setImages] = useState(null);
  const [initialCategory, setInitialCategory] = useState(null);
  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = categoryList;

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

  const profile = useSelector((state) => state.profile);
  const {
    Payload: { accountID },
  } = profile;
  useEffect(() => {
    dispatch(listCategories());
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          console.log("Khoong truy cap dc");
        }
      }
    })();
  }, []);
  useEffect(() => {
    const foundCat =
      edit && categories && categories.find((x) => x.path === product.category);
    if (foundCat) {
      setInitialCategory(foundCat);
    }
  }, [categories]);

  const HandleCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,

      quality: 1,
      allowsMultipleSelection: true,
    });
    // let result = await ImagePicker.launchCameraAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   quality: 1,
    //   aspect: [1, 1]
    // });

    if (result.cancelled) return;

    let localUri = result.uri;
    let filename = localUri.split("/").pop();
    if (filename == undefined) return;
    let match = /\.(\w+)$/.exec(filename == undefined ? "" : filename);
    let type = match ? `image/${match[1]}` : `image`;

    let query = {
      uri: localUri,
      name: filename,
      type,
    };
    setImages(query);
    setSelectImageDialog(false);
  };

  const HandleLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
      allowsMultipleSelection: true,
    });

    if (result.cancelled) return;

    let localUri = result.uri;
    let filename = localUri.split("/").pop();
    if (filename == undefined) return;
    let match = /\.(\w+)$/.exec(filename == undefined ? "" : filename);
    let type = match ? `image/${match[1]}` : `image`;

    let query = {
      uri: localUri,
      name: filename,
      type,
    };
    setImages(query);
    setSelectImageDialog(false);
  };
  const getDefaultProp = (id) => {
    const result = product.properties.find((x) => x._id === id).value;

    return result ? result : "";
  };
  const handleNewProduct = (values) => {
    let newProduct = { ...values };
    let handledProp = [];
    if (newProduct.properties) {
      Object.entries(newProduct.properties).map((prop) => {
        handledProp.push({
          _id: prop[0],
          value: prop[1],
        });
      });
      newProduct.properties = handledProp;
    }
    newProduct.category = values.category.path;
    newProduct.user = accountID;

    dispatch(createProduct(newProduct, images));
  };
  const handleUpdate = (values) => {
    let productToUpdate = { ...values };
    if (!productToUpdate.category)
      productToUpdate.category = initialCategory.path;
    let props = [...product.properties];
    if (productToUpdate.properties) {
      Object.entries(productToUpdate.properties).map((prop) => {
        props.find((x) => x._id === prop[0]).value = prop[1];
      });
    }
    productToUpdate.properties = props;
    productToUpdate.user = product.user;
    productToUpdate.image = product.image;

    dispatch(updateProduct(product._id, productToUpdate, images));
  };

  useEffect(() => {
    if (!updateLoading && !createLoading) {
      if (updateSuccess || createSuccess) {
        showMessage({
          message: "Th??nh c??ng\n",
          type: "success",
          icon: "success",
        });
        navigation.goBack();
      } else {
        if (updateError || createError) {
          showMessage({
            message: "Kh??ng th??nh c??ng\n" + updateError || createError,
            type: "danger",
            icon: "danger",
          });
        }
      }
    }
    console.log(updateLoading);
  }, [dispatch, createLoading, updateLoading]);

  return (
    <Screen>
      {selectImageDialog && (
        <View style={styles.BoxSelect}>
          <TouchableOpacity
            style={{
              height: Dimensions.get("window").height,
            }}
            onPress={() => setSelectImageDialog(false)}
          >
            <View
              style={{ opacity: 0.5, backgroundColor: "grey", flex: 1 }}
            ></View>
          </TouchableOpacity>

          <View
            style={{
              justifyContent: "center",
              position: "absolute",
              alignSelf: "center",
              borderRadius: 10,
              overflow: "hidden",
              borderColor: "grey",
              borderWidth: 1,
            }}
          >
            <TouchableOpacity onPress={HandleCamera}>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  padding: 10,
                  alignSelf: "center",
                  width: 250,
                  backgroundColor: "white",
                }}
              >
                <Ionicons
                  style={{ fontSize: 24, marginRight: 6 }}
                  name="camera"
                  color="#d35400"
                />
                <Text style={{ fontSize: 24 }}>Ch???p ???nh</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={HandleLibrary}>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  padding: 10,
                  alignSelf: "center",
                  borderColor: "grey",
                  width: 250,
                  borderTopWidth: 1,
                  backgroundColor: "white",
                }}
              >
                <Ionicons
                  style={{ fontSize: 24, marginRight: 6 }}
                  name="library"
                  color="#d35400"
                />
                <Text style={{ fontSize: 24 }}>L???y t??? th?? vi???n</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <Formik
          initialValues={{
            name: edit ? product.name : "",
            price: edit ? product.price : "",
            countInStock: edit ? product.countInStock : 0,
            description: edit ? product.description : "",
            category: edit && initialCategory ? initialCategory : null,
            properties: null,
          }}
          onSubmit={(values) =>
            edit ? handleUpdate(values) : handleNewProduct(values)
          }
          //validationSchema={validationSchema}
        >
          {({ handleSubmit, values, initialValues }) => (
            <>
              <AppFormField
                placeholder="T??n s???n ph???m"
                clearButtonMode="while-editing"
                name="name"
                defaultValue={edit && product.name}
              />

              <AppFormField
                placeholder="Gi??"
                keyboardType="number-pad"
                name="price"
                defaultValue={edit && product.price.toString()}
              ></AppFormField>

              <AppFormField
                placeholder="S??? l?????ng"
                keyboardType="number-pad"
                name="countInStock"
                defaultValue={edit && product.countInStock.toString()}
              ></AppFormField>

              <AppFormField
                placeholder="M?? t???"
                multiline
                numberOfLines={10}
                name="description"
                defaultValue={edit && product.description}
              ></AppFormField>
              <Text>Danh m???c</Text>
              <AppFormPicker
                items={categories}
                name="category"
                placeholder="Danh m???c"
                selectedItem={
                  edit &&
                  categories &&
                  categories.find((x) => x.path === product.category)
                }
              />
              <View>
                {edit && initialCategory
                  ? initialCategory.properties.map((prop) => (
                      <AppFormField
                        placeholder={prop.name}
                        name={`properties.${prop._id}`}
                        key={prop._id}
                        defaultValue={edit && getDefaultProp(prop._id)}
                      ></AppFormField>
                    ))
                  : values.category &&
                    values.category.properties.map((prop) => (
                      <AppFormField
                        placeholder={prop.name}
                        name={`properties.${prop._id}`}
                        key={prop._id}
                        defaultValue={edit && getDefaultProp(prop._id)}
                      ></AppFormField>
                    ))}
              </View>
              <View style={styles.imageContainer}>
                {images ? (
                  <Image
                    source={{
                      uri: images.uri,
                    }}
                    style={styles.images}
                  />
                ) : product && product.image ? (
                  <Image
                    source={{
                      uri: `${CDNAPI}/cdn/${product.image[0].link}`,
                    }}
                    style={styles.images}
                  />
                ) : (
                  <Entypo
                    style={styles.imageIcon}
                    name="image"
                    size={30}
                    color="black"
                  />
                )}
              </View>
              <AppButton
                title="Ch???n h??nh ???nh"
                onPress={() => setSelectImageDialog(true)}
              ></AppButton>

              <AppButton title="L??u" onPress={handleSubmit}></AppButton>
            </>
          )}
        </Formik>
      </ScrollView>
      <Modal
        visible={createLoading || updateLoading ? true : false}
        animationType="slide"
        onDismiss={() => setModalVisible(false)}
      >
        <View>
          <View style={styles.centeredView}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    backgroundColor: "#fff",
  },
  BoxSelect: {
    flex: 1,
    height: "100%",
    width: Dimensions.get("window").width,
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 5,
    backgroundColor: "transparent",
    //backgroundColor:'yellow',
  },
  imageContainer: {
    flex: 1,
    borderColor: "grey",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 5,
    justifyContent: "center",
    alignContent: "center",
    minHeight: 300,
    position: "relative",
  },
  images: {
    width: "100%",
    height: 300,

    resizeMode: "contain",
  },
  imageIcon: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AddProductScreen;

import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper'
import { useDispatch, useSelector } from 'react-redux';
import { CDNAPI } from '../../define';
import { GetSlider } from '../actions/sliderAction';
import { AppState } from '../store';

const SliderMain: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const getSlider = useSelector((state: AppState) => state.getSlider)
  

  useEffect(() => {

    console.log(`getSlidsdsder: ${getSlider.Error} + ${getSlider.IsFetching} + ${isLoading}`)
    if (getSlider.Error == "" && getSlider.IsFetching == false && isLoading)
      {
        console.log(getSlider)
        setisLoading(false);
      }
  }, [getSlider])
  useEffect(() => {
    dispatch(GetSlider())
    setisLoading(true)
  }, [])

  return (
    <View>
     {
       !isLoading 
       ?<Swiper
        height={200} autoplay loop>
        {
          getSlider.Payload.map(
            (item, index) => {
              return (
                <View key = {index}>
                  <Image
                    style={styles.image}
                    source={{ uri: `${CDNAPI}/cdn/${item.link}` }}
                  />
                </View>
              );
            }
          )
        }
      </Swiper>
      :<ActivityIndicator size="large" color="#0000ff" style = {{height:200}}/>
      }
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
  }
});

export default SliderMain;
import { View, Text } from 'react-native';
import React from 'react';
import { colors } from '../../src/utils/color';
import NoDataFound from '../NoDataFound/NoDataFound';

const StoreProductsDetails = () => {
  return (
    <View style={{flex:1,backgroundColor:colors.white,padding:5}}>
      <View style={{flexDirection:'row'}}>
        <Text>Total Products: 0</Text>
      <Text style={{fontWeight:'bold',fontSize:14}}>  (05/10/2024  to 05/05/2024 ) </Text>
       </View>

       <NoDataFound />
    </View>
  );
};

export default StoreProductsDetails;
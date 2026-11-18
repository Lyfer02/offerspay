import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {colors} from '../../src/utils/color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';
import NoDataFound from '../NoDataFound/NoDataFound';
import IconComponent from '../IconComponent';

const ManageBankDetails = () => {
  return (
    <View style={{backgroundColor: colors.white, flex: 1}}>
      <View style={{padding: 10, flexDirection: 'row',backgroundColor:colors.lightGray
        ,margin:5,borderRadius:5
      }}>
        <Text style={{textAlign: 'justify'}}>*Note:
          Please Enter the bank details of the individuals whose PAN details
          have been added in My Profile section .Furthermore ,you are limited to
          changing your bank details ,only three times per month ,you must wait
          until the next month to add new bank account information.
        </Text>
      </View>
      <NoDataFound />

      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            maxWidth:550,
            margin: 10,
            paddingHorizontal:12,
            paddingVertical:4,
            alignSelf:'center',
            borderColor: colors.colorPrimary,
            backgroundColor: colors.whitedull,
          },
          defaultStyleSheet.shadowProvider,
        ]}>
        <IconComponent name="add" size={28} color={colors.colorPrimary} />
        <Text
          style={{color: colors.colorPrimary, fontWeight: 'bold', padding: 10}}>
          Add Bank Details
        </Text>
      </View>
    </View>
  );
};
export default ManageBankDetails;

const styles = StyleSheet.create({
  noDatafound: {
    height: 250,
    width: 250,
    resizeMode: 'contain',
  },
});

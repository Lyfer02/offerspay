import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { colors } from '../../src/utils/color'
import NoDataFound from '../NoDataFound/NoDataFound'

const AllInvoices = () => {
  return (
    <View style={{flex:1,backgroundColor:colors.white,padding:10}}>
      <Text>Total Invoices : 0</Text>
      <NoDataFound />

    </View>
  )
}

export default AllInvoices;
const styles=StyleSheet.create({
  
  noDatafound:{
    height:250,
    width:250,
    resizeMode:'contain'
  },
})
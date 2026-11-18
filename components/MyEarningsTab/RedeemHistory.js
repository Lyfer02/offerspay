import { View, Text } from 'react-native'
import React from 'react'
import NoDataFound from '../NoDataFound/NoDataFound'
import { colors } from '../../src/utils/color'

const RedeemHistory = () => {
  return (
    <View style={{flex:1,backgroundColor:colors.white,padding:10}}>

      <NoDataFound />
    </View>
  )
}

export default RedeemHistory
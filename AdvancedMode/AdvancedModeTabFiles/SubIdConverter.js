import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../src/utils/color'

const SubIdConverter = () => {
  return (
    <View style={styles.main}>
      <Text allowFontScaling={false} style={styles.text}>This Feature is not enabled for you </Text>
      <Text allowFontScaling={false} style={styles.text}>Please Mail us at <Text allowFontScaling={false} style={[styles.boldText,styles.text]}>offersPay@gmail.com </Text>to enable this feature </Text>
    </View>
  )
}

export default SubIdConverter

const styles = StyleSheet.create({
  main:{alignItems:'center',padding:20,backgroundColor:colors.white,flex:1},
  text:{fontSize:14,paddingVertical:5,color:colors.black},
  boldText:{fontWeight:'900'},

})
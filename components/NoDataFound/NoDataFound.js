import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react';

const NoDataFound = () => {
  return (
    <View style={{ justifyContent: 'center',
    flex:1, alignItems: 'center'}}>
        <Image
          style={styles.noDatafound}
          source={require('../../src/assets/no_data_found.jpg')}
        />
      </View>
  )
}

const styles=StyleSheet.create({
    noDatafound: {
        height: 250,
        width: 250,
        resizeMode: 'contain',
      },
})

export default NoDataFound
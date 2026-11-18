import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TelegramContentSteps = ({item}) => {
  return (
    <View style={{padding:10}}>
      <Text style={{fontSize: 18}}>{item.step} : {item.description}</Text>
      {item.image && (
        <View style={{alignItems: 'center', padding: 10,overflow:'hidden'}}>
          <Image
            style={styles.publicImage}
            source={item.image}
          />
        </View>
      )}
    </View>
  )
}

export default TelegramContentSteps

const styles = StyleSheet.create({
  publicImage: {
    height: 350,
    width:'100%',
    maxWidth:1024,
    resizeMode: 'contain',
  },
})
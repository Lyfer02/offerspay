import { FlatList, ImageBackground, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../../src/utils/color'
import { TelegramBotData } from '../TrendingStoresItemData'
import TelegramContentSteps from './TelegramContentSteps'
import Fontisto from 'react-native-vector-icons/Fontisto';

const TelegramBotPage = () => {
  
  const youtubeVideoId = 'dQw4w9WgXcQ'; 
    // Function to open YouTube link
    const openYouTubeLink = () => {
      const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
      Linking.openURL(youtubeUrl).catch(err => console.error('Failed to open YouTube link', err));
    };
  
    // Get the YouTube thumbnail URL
    const youtubeThumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
  
  return (
    <ScrollView>
    <View style={{flex:1,backgroundColor:colors.white,padding:10,justifyContent:'center'}}>
      <Text style={{fontSize:18,fontWeight:'bold'}}> Steps For Bot Configuration</Text>
      
      
      {/* Touchable area to open YouTube link */}
      <TouchableOpacity 
          style={styles.youtubeContainer}
          onPress={openYouTubeLink} // Open YouTube link on press
        >
          <ImageBackground
            source={{uri: youtubeThumbnailUrl}}
            style={styles.youtubeThumbnail}
         >
            <View style={styles.iconContainer}>
              <Fontisto 
                name='youtube-play'
                size={25} // Make the icon larger
                color={colors.white}
              />
            </View>
         </ImageBackground>
        </TouchableOpacity>
      <FlatList
      showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <Text style={styles.title}>Steps For Configuration</Text>
        )}
        data={TelegramBotData}
        renderItem={({ item }) => <TelegramContentSteps item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View></ScrollView>
  )
}

export default TelegramBotPage

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  listContainer: {
    paddingBottom: 20,  // Ensure there is space at the bottom for smooth scrolling
  }, youtubeContainer: {
    width: '90%',
    height: 170,
    backgroundColor: colors.lightRed,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf:'center',
    alignItems: 'center',
    marginVertical: 20,
    overflow: 'hidden', // Ensures the thumbnail fits within the container
  },
  youtubeThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the thumbnail covers the entire area
    justifyContent: 'center', // Centers the icon vertically
    alignItems: 'center', // Centers the icon horizontally
  },
  iconContainer: {
    justifyContent: 'center', // Centers the icon vertically
    alignItems: 'center', // Centers the icon horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent background for better contrast
    borderRadius: 10, // Makes the background circular
    padding: 5, // Adds padding to the icon
  },
})
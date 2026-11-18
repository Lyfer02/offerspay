import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../../src/utils/color'
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';
import IconComponent from '../../components/IconComponent';

const UrlReplacer = () => {
  const openUrl = url => {
    Linking.openURL(url).catch(err =>
      console.error('An error occurred while opening the URL', err),
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
      showsVerticalScrollIndicator={false}>
    <View
    style={{
      flex: 1,
      backgroundColor: colors.white,
      paddingHorizontal: 10,
      paddingBottom: 20,
      paddingTop: 10,
    }}
    >
      {/* Replace button  start here  */}
     <View style={{maxWidth:720,width:'100%',alignSelf:'center'}}>
               <TouchableOpacity
     activeOpacity={0.7}
     style={[styles.replaceBtn,{backgroundColor:colors.colorPrimaryLite},defaultStyleSheet.shadowProvider]}>
     
    <IconComponent
    size={28}
    name='swap-horizontal'
    color={colors.colorPrimary}
    />
     <Text style={[styles.replaceBtnText,{color:colors.colorPrimary}]}>Replace Keywords</Text>
     </TouchableOpacity>

      {/* Remove button  start here  */}
      <TouchableOpacity
     activeOpacity={0.7}
      style={[styles.replaceBtn,{backgroundColor:colors.lightRed},defaultStyleSheet.shadowProvider]}>
     
     <IconComponent
     size={28}
     name='close'
     color={colors.red}
     />
      <Text style={[styles.replaceBtnText,{color:colors.red}]}>Remove Keywords</Text>
      </TouchableOpacity>

      </View>
      <Text style={styles.HeadingTitle}>How Does URL Replacer Work? </Text>
      <Text>
      In the particular URL, You can "Replace" & "Remove" any Keyword with your target keywords by using a URL replacer
      </Text>

      <Text style={styles.textContainer}>
        <Text style={styles.HeadingText}> Replace Keywords: </Text>You can "Replace" any keyword in the URL, with your preferred keyword
      </Text>

      <Text style={styles.textContainer}>
        <Text style={styles.HeadingText}> Eg: </Text> I have set the keyword in the "Replace Keywords"  extrape = deal
      </Text>
    
    <Text style={styles.HeadingText}>
    Actual URL :
    </Text>

<TouchableOpacity
activeOpacity={0.7}
onPress={()=>{openUrl('https://www.flipkart.com/misfit-boat-t50-trimmer-160-mins-runtime-40-length-settings/p/itmb00e030788c7b?pid=TMRG368SFVHU2CR2&keywords=extrape&ascutog=extrape')}}
>
    <Text style={styles.linkText}>
    https://www.flipkart.com/misfit-boat-t50-trimmer-160-mins-runtime-40-length-settings/p/itmb00e030788c7b?pid=TMRG368SFVHU2CR2&keywords=extrape&ascutog=extrape
    </Text></TouchableOpacity>


    <Text style={styles.HeadingText}>
    Replaced keyword URL:
    </Text>

    <TouchableOpacity
activeOpacity={0.7}
onPress={()=>{openUrl('https://www.flipkart.com/misfit-boat-t50-trimmer-160-mins-runtime-40-length-settings/p/itmb00e030788c7b?pid=TMRG368SFVHU2CR2&keywords=deal&ascutog=deal')}}
>

    <Text style={styles.linkText}>
    https://www.flipkart.com/misfit-boat-t50-trimmer-160-mins-runtime-40-length-settings/p/itmb00e030788c7b?pid=TMRG368SFVHU2CR2&keywords=deal&ascutog=deal </Text>

    </TouchableOpacity>



    <Text style={styles.HeadingTitle}>How does URL Replacer help to Remove Keywords? </Text>
     

      <Text style={styles.textContainer}>
        <Text style={styles.HeadingText}> Remove keywords: </Text>You can "Remove" any keyword in the URL, and customize it to be null
      </Text>

     
    
    <Text style={styles.HeadingText}>
    Actual URL :
    </Text>


    <TouchableOpacity
activeOpacity={0.7}
onPress={()=>{openUrl('https://www.flipkart.com/misfit-boat-t50-trimmer-160-mins-runtime-40-length-settings/p/itmb00e030788c7b?pid=TMRG368SFVHU2CR2&keywords=extrape&ascutog=extrape')}}
>
    <Text style={styles.linkText}>
    https://www.flipkart.com/misfit-boat-t50-trimmer-160-mins-runtime-40-length-settings/p/itmb00e030788c7b?pid=TMRG368SFVHU2CR2&keywords=extrape&ascutog=extrape</Text>
</TouchableOpacity>

    <Text style={styles.HeadingText}>
    Replaced keyword URL:
    </Text>


    <TouchableOpacity
activeOpacity={0.7}
onPress={()=>{openUrl('https://www.flipkart.com/misfit-boat-t50-trimmer-160-mins-runtime-40-length-settings/p/itmb00e030788c7b?pid=TMRG368SFVHU2CR2&keywords=&ascutog=')}}
>
    <Text style={styles.linkText}>
    https://www.flipkart.com/misfit-boat-t50-trimmer-160-mins-runtime-40-length-settings/p/itmb00e030788c7b?pid=TMRG368SFVHU2CR2&keywords=&ascutog=</Text>
</TouchableOpacity>
    
    </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default UrlReplacer

const styles = StyleSheet.create({
  replaceBtn:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal:12,
    paddingVertical:8,
    marginTop:8,
    borderRadius:5,
    borderBottomWidth:1,
    borderBottomColor:colors.lightGray,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  replaceBtnText:{

    fontSize:16,
    marginStart:5,
    fontWeight:'700',
  },
  HeadingText: {
    color: colors.black,
    fontWeight: '600',
    marginVertical:5,
  },
  HeadingTitle:{
    
    color: colors.black,
    fontWeight: '600',
    fontSize:18,
    marginVertical:8
  },
  textContainer:{
    marginVertical:5
  },
  linkText:{
    marginVertical:5,
    color:colors.navyBlue
  }
})
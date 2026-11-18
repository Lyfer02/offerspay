import { Image, ScrollView, StyleSheet, Text,  View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { colors } from '../src/utils/color';
import { AboutUsSecondContainer, partnersList } from '../components/TrendingStoresItemData';
import LandingFooter from './Components/LandingFooter';
import LandingHeader from './Components/LandingHeader';

const AboutUs = () => {
    const navigation = useNavigation();

    
  return (
    <ScrollView >
    <View style={{backgroundColor:colors.white}}>
      {/* Header */}
      <LandingHeader /> 


<View style={styles.aboutUsMainContainer}>

<Text style={{fontWeight:'600',
    fontSize:18,margin:20,padding:20,
}}> Share A Deal and Start Earning 25k per Month</Text>


<Text style={{textAlign:'center',
    fontSize:16,margin:20,padding:20,
    maxWidth:1600,
}}> ExtraPe as a platform seeks to provide its users and visitors with an extra, rather a passive source of income which can surely aid and assist them generating a few bucks, distinct from the regular source of income. We at ExtraPe host the deals available on multiple e-commerce website so that you can click on the deal you wish to grasp. Further, on sharing that particular deal to your friend or somebody you wish to share, you will be receiving the commission if the person (to whom you shared) uses the deal and shop using it. Provided, that the deal hosted on our website can be shared via any social media platform, be it Instagram, Facebook, WhatsApp and even on the E-mails. Hence, this simple task can let you earn money by just sharing. Someone has rightly said that ‘Sharing is Caring’ but the todays modern rule and our ideology suggests that “Sharing is Earning”.</Text>


<Text style={{fontWeight:'600',
    fontSize:18,margin:20,padding:20,
}}> ExtraPe focuses on assisting users in earning money by sharing shopping offers from sites such as:</Text>


<View style={{
              margin: 10,
              flexDirection: 'row'
            }}>
              {partnersList.map((list) => (
                <View key={list.id} style={{margin: 10}}>
                  <Image 
                    style={{height: 60, width: 120, resizeMode: 'contain'}}
                    source={list.image}
                    resizeMethod='resize'
                  />
                </View>
              ))}
            </View>


<Text  style={{fontWeight:'600',
    fontSize:20,margin:20,
}}>
Start Making Money Today on This Amazing Platform!
</Text>

<Text  style={{fontWeight:'200',
    fontSize:14,margin:20,
}}>
Let me explain why ExtraPe is the most reliable Affiliate Marketing platform for earning money right now
</Text>

<View style={styles.aboutusSecondContainer}>

        {AboutUsSecondContainer.map((list)=>(
            <View key={list.id} style={{margin: 10,alignContent:'center',
                alignItems:'center'
            }}>
            <Image 
              style={{height: 120, width: 200, resizeMode: 'contain'}}
              source={list.image}
              resizeMethod='resize'
            />
            <Text style={{textAlign:'center',fontWeight:'bold',
                marginVertical:12
            }}>{list.title}</Text>
            <Text 
            style={{textAlign:'center',
                marginVertical:12
            }}
            >{list.description}</Text>
          </View>
        ))}
</View>

</View>


          {/* Footer starts From here */}
         <LandingFooter />

    </View>
    </ScrollView>
  )
}

export default AboutUs;
const styles = StyleSheet.create({
    
      aboutUsMainContainer:{
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        paddingVertical:50,paddingHorizontal:20,
        backgroundColor:colors.white,
      },
})
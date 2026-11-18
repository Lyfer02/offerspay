import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PrivacyAndPolicy,} from '../components/TrendingStoresItemData'
import LandingHeader from './Components/LandingHeader'
import LandingFooter from './Components/LandingFooter'
import { color } from '@rneui/base'
import { colors } from '../src/utils/color'

const PrivacyPolicy = () => {
  return (
    <ScrollView  
    showsVerticalScrollIndicator={false}>
    <View style={styles.main}>
        <LandingHeader />

<View  style={{ padding:20}}> 
        <Text style={[styles.textTitle,{textAlign:'center'}]}>Privacy and Policy</Text>

        {PrivacyAndPolicy.map((list)=>(
            <View>
                <Text style={styles.textTitle}>{list.heading}</Text>

                {list.description.map((paragraph ,paragraphIndex)=>(

                    <Text style={styles.titleDescription}>{paragraph}</Text>

                ))}
                
            </View>
        ))}

</View>

<LandingFooter
 />
    </View>
    </ScrollView>
  )
}

export default PrivacyPolicy

const styles = StyleSheet.create({
    main:{
        width:'100%',
        backgroundColor:colors.white,

    },
    textTitle:{
        fontSize:18,
        fontWeight:'700',
        margin:10,
    },
    titleDescription:{
        margin:10,
        fontSize:18,
        textAlign:'justify',
    }

})
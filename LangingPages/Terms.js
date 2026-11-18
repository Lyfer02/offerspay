import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TermsAndConditions } from '../components/TrendingStoresItemData';
import LandingHeader from './Components/LandingHeader';
import LandingFooter from './Components/LandingFooter';
import { colors } from '../src/utils/color';

const Terms = () => {
  return (
    <ScrollView  
    showsVerticalScrollIndicator={false}>
    <View style={styles.main}>
        <LandingHeader />

<View  style={{ padding:20}}> 
        <Text style={[styles.textTitle,{textAlign:'center'}]}>Terms and  Conditions</Text>

        {TermsAndConditions.map((list)=>(
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

export default Terms;

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
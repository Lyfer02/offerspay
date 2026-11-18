import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import defaultStyleSheet from '../src/styles/defaultStylesSheet'
import { colors } from '../src/utils/color'
import IconComponent from './IconComponent'


const WalletComponent = () => {
  return (
    <View>
       {/* Wallet Starts from here  */}

      <View style={[styles.walletContainer, defaultStyleSheet.shadowProvider]}>
        <View style={styles.walletContainerUpper}>
          <View style={styles.walletTextContainer}>
            <View style={{flex: 1, margin: 5}}>
              <Text style={styles.walletText}>My Wallet</Text>
              <Text style={styles.walletText}>₹ 0</Text>
            </View>
          </View> 

           <View
            style={[
              styles.walletLogoContainer,
              defaultStyleSheet.shadowProvider,
            ]}>
            <IconComponent name={'wallet'} size={30} color={colors.colorPrimary} />
          </View> 

          {/* Wallet Redeem  Button  */}

           <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.txtButton}> REDEEM</Text>
          </TouchableOpacity> 
        </View> 

         <View style={styles.walletContainerBottom}> 

          {/* Wallet feature containes starts here  */}
           <View style={styles.walletContainerBottom}>
            <View
              style={{
                alignContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <View
                style={[
                  styles.walletFeatureContainer,
                  defaultStyleSheet.shadowProvider,
                ]}>
                <IconComponent
                  name="qrcode-scan"
                  size={30}
                  color={colors.colorPrimary}
                />
              </View>

              <Text style={{fontWeight: 'bold'}}>Pay</Text>
            </View>

            <View
              style={{
                alignContent: 'center',
                alignItems: 'center',
                margin: 10,
              }}>
              <View
                style={[
                  styles.walletFeatureContainer,
                  defaultStyleSheet.shadowProvider,
                ]}>
                <IconComponent
                  name="bank-transfer"
                  size={38}
                  color={colors.colorPrimary}
                />
              </View>

              <Text style={{fontWeight: 'bold'}}>Transfer</Text>
            </View> 

            {/* History feature  is shown here  */}
             <View
              style={{
                alignContent: 'center',
                alignItems: 'center',
                margin: 10,
              }}>
              <View
                style={[
                  styles.walletFeatureContainer,
                  defaultStyleSheet.shadowProvider,
                ]}>
                <IconComponent
                  name="history"
                  size={38}
                  color={colors.colorPrimary}
                />
              </View>

              <Text style={{fontWeight: 'bold'}}>History</Text>
            </View> 
          </View> 
          <IconComponent
            name={'arrow-forward-circle'}
            size={35}
            color={colors.colorPrimary}
          />
         </View>
      </View>

      {/*  Wallet Ends here  */}
    </View>
  )
}

export default WalletComponent;

const styles = StyleSheet.create({
    walletContainer: {
        width: 'auto',
        height: 160,
        borderRadius: 20,
        margin: 15,
        backgroundColor: 'white',
      },
      walletContainerUpper: {
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
      },
      walletContainerBottom: {
        flex: 1,
        flexDirection: 'row',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 5,
      },
      walletTextContainer: {
        flex: 1,
      },
      walletText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
      },
      walletLogoContainer: {
        width: 40,
        height: 40,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        backgroundColor: colors.white,
      },
})
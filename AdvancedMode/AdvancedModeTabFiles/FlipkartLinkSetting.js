import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../src/utils/color';
import {Picker} from '@react-native-picker/picker';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';

const FlipkartLinkSetting = () => {
  const [selectedValue, setSelectedValue] = useState('fkrt.co');
  const [isFocused, setIsFocused] = useState(false);
  const [flipkartLink, setFlipkartLink] = useState('fkrt.co');

  // Function to handle focus state
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Function to update the flipkart link
  const updateLink = text => {
    setFlipkartLink(text);
  };

  return (
    <TouchableWithoutFeedback onPress={handleBlur}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          paddingHorizontal: 10,
          paddingBottom: 20,
          paddingTop: 10,
          maxWidth:1024,
          alignSelf:'center',
          margin:5
        }}>
        <Text style={styles.defaultText}>
          Choose flipkart link type among fkrt.co, fkrt.it and dl.flipkart.com.
          By default, we are considering fkrt.co. If you wish to use fkrt.it,
          select fkrt.it from the below dropdown or dl.flipkart.com, select
          dl.flipkart.com from the below dropdown, and click on update.
        </Text>

<View style={{maxWidth:450}}>
        <Text>
          <Text style={[styles.HeadingText, {fontSize: 16}]}>
            {' '}
            Current Link Type :
          </Text>
          <Text style={styles.selectedLink}> {flipkartLink}</Text>
        </Text>

        {/* Wrapper View for Picker with dynamic border color */}
        <View
          style={[
            styles.pickerContainer,
            {borderColor: isFocused ? colors.colorPrimary : colors.gray},
            defaultStyleSheet.shadowProvider,
          ]}>
          <Picker
          style={{paddingHorizontal:12, paddingVertical:8 }}
            selectedValue={selectedValue}
            onValueChange={itemValue => setSelectedValue(itemValue)}
            onFocus={handleFocus} // Change border to blue when focused
            onBlur={handleBlur} // Change border to gray when blurred
          >
            <Picker.Item label="fkrt.co" value="fkrt.co"  />
            <Picker.Item label="fkrt.it" value="fkrt.it" />
            <Picker.Item label="dl.flipkart.com" value="dl.flipkart.com" />
          </Picker>
        </View>

        {/* update button  */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            updateLink(selectedValue);
          }}
          style={defaultStyleSheet.submitButtonContainer}>
          <Text style={defaultStyleSheet.submitButtonText}>Update</Text>
        </TouchableOpacity>

        </View>

        <View style={styles.textContainer}>
          <Text style={{textAlign: 'justify'}}>
            <Text style={[styles.HeadingText,]}> fkrt.co :</Text>
            <Text style={styles.defaultText}>
              {' '}
              If you choose "fkrt.co" option for link creation. You can see the
              detailed analytics report in the MyActivity section
            </Text>
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={{textAlign: 'justify'}}>
            <Text style={[styles.HeadingText,]}> fkrt.it :</Text>
            <Text style={styles.defaultText}>
              {' '}
              Whereas, if you choose the "fkrt.it" option for link creation. You
              can't see detailed analytics. But your earnings will be added
              directly into my earnings section
            </Text>
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={{textAlign: 'justify'}}>
            <Text style={[styles.HeadingText, ]}>
              {' '}
              dl.flipkart.com :
            </Text>
            <Text style={styles.defaultText}>
              {' '}
              Whereas, if you choose the "dl.flipkart.com" option for link
              creation. You can't see detailed analytics. But your earnings will
              be added directly into my earnings section
            </Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FlipkartLinkSetting;

const styles = StyleSheet.create({
  HeadingText: {
    color: colors.black,
    fontWeight: '600',
  },
  defaultText: {
    color: colors.black,
    textAlign: 'justify',
    padding: 5,
  },
  selectedLink: {
    color: colors.colorPrimary,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderRadius: 5,
    marginVertical: 10,
    padding:8,
    backgroundColor: colors.white,
    marginHorizontal: 8,
  },
  textContainer: {
    marginTop: 20,
  },
});

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../src/utils/color';
import IconComponent from '../../components/IconComponent';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';

const AddAmazonTag = () => {
  const [inputText, setInputText] = useState('');
  const [savedTexts, setSavedTexts] = useState([]);
  const [isSavedText, setIsSavedText] = useState(false);
  const [isInputDisabled, setInputDisabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const disclaimerPoints = [
    'To use the ExtraPe Link converter tool for your Amazon Associates Account you need to have either ExtraPe Amazon Affiliate Tag or your own tag in the Amazon Tag section.',
    'Sample Amazon Tag: "amazontag-21" (amazon tag should end with "-21")',
    'Once the tag is assigned/added, You can start converting the Amazon links where your input links are converted into your Amazon Associates Affiliate link with the tag mentioned above. Hence it is your sole responsibility which tag is being used in your account if its ExtraPe Amazon Affiliate Tag then you will see that tag above or if you are using your own then it should be correct tag associated with your Amazon Associates Affiliate Program.',
    'In case you have approved ExtraPe Amazon Affiliate Tag, then you will be able track and redeem your earnings through ExtraPe website/app',
    'In case you are using your own Amazon Tag, ExtraPe is only a converter link tool for your Amazon Associates account and will not be responsible for your earnings or tracking issues. Your account earnings and order tracking will happen on your Amazon Associates Dashboard.',
    'You need to configure your Bitly Token to get Bitly links for the converted Links otherwise, links will be normal and not shortened links.',
    'To autopost on Telegram channel you have configured in ExtraPe you need to enable Auto Post for that particular channel'
  ];

  const handleSave = () => {
    if (inputText.trim()) {
      const updatedTags = [...savedTexts, inputText.trim()];
      setSavedTexts(updatedTags);
      setIsSavedText(true);
      setInputDisabled(true);
      setInputText('');
    }
  };

  const removeTags = () => {
    setSavedTexts([]);
    setInputText('');
    setIsSavedText(false);
    setInputDisabled(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.mainContainer}>

          <View style={{maxWidth:720,width:'100%'}}>
          <Text style={styles.HeadingText}>Amazon Tag</Text>

          <View style={[defaultStyleSheet.shadowProvider,{padding:8,marginVertical:8,borderRadius:8,}, styles.disabledInput]}>
          <TextInput
            style={defaultStyleSheet.txtInput}
            value={isInputDisabled ? savedTexts.join(', ') : inputText}
            onChangeText={setInputText}
            placeholder="Add Amazon Tag"
            editable={!isInputDisabled}
          />
          </View>
          

          {!isSavedText && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSave}
              disabled={inputText.trim().length === 0}
              style={[
                styles.submitButtonContainer,
                inputText.trim().length === 0 && styles.disabledButton
              ]}>
              <Text style={[
                styles.submitButtonText,
                inputText.trim().length === 0 && styles.disabledButtonText
              ]}>Save</Text>
            </TouchableOpacity>
          )}

          {isSavedText && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={removeTags}
              style={styles.removeButtonContainer}>
              <Text style={styles.removeButtonText}>
                Remove Saved Tags
              </Text>
            </TouchableOpacity>
          )}

</View>

          <View style={styles.container}>
            <TouchableOpacity 
              style={styles.header} 
              onPress={() => setIsExpanded(!isExpanded)}
            >
              <Text style={styles.headerText}>Disclaimer</Text>
              {isExpanded ? 
                <IconComponent name="chevron-up" size={24} color="#000" /> : 
                <IconComponent name="chevron-down" size={24} color="#000" />
              }
            </TouchableOpacity>
            
            {isExpanded && (
              <View style={styles.content}>
                {disclaimerPoints.map((point, index) => (
                  <View key={index} style={styles.bulletPoint}>
                    <Text style={styles.bulletNumber}>{index + 1}.</Text>
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mainContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 10,
  },
  HeadingText: {
    color: colors.black,
    fontSize:18,
    fontWeight: '600',
  },
  inputAmazonTag: {
    borderColor: '#D3D3D3',
    borderWidth: 1.5,
    borderRadius: 5,
    paddingStart: 10,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 5,
    ...(Platform.OS === 'web'
      ? {
          // Use boxShadow for web
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }
      : {
          // Native-specific shadow properties for iOS and Android
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletNumber: {
    marginRight: 8,
    minWidth: 20,
  },
  bulletText: {
    flex: 1,
    lineHeight: 20,
  },
  submitButtonContainer: {
    backgroundColor: colors.colorPrimary,
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  submitButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  removeButtonContainer: {
    backgroundColor: colors.red,
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  removeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  disabledButtonText: {
    color: '#666',
  }
});

export default AddAmazonTag;
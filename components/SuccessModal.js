// src/components/SuccessModal.js
import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../src/utils/color';
import IconComponent from './IconComponent';
import { ErrorModalService } from '../src/utils/modalService';
import { shareLink, shareToWhatsApp } from '../src/utils/commonFunctions_one';
import LinearGradient from 'react-native-linear-gradient';


const SuccessModal = ({ visible, onClose, data={} }) => {

 // console.log("this is  data",data);
  
  const copyLink = () => {

    Clipboard.setString(data.link);
    // optional toast can be added later
    ErrorModalService.success('Link copied to clipboard!', {
      showCancel: false,
    });

    setTimeout(() => ErrorModalService.hide(), 2000);

  };
 const message = `Share this link : ${data.link} to earn amount on every sucessfull purchase`;
 const image=data.logo || [];
 const title = data.name || "Generated Referral Link";

  const shareWhatsApp = () => {
    shareToWhatsApp(message ,image ,title);
    onClose();
  };

  const shareGeneral = () => {
    shareLink(title,message,image)
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.content}>
              {/* Close */}
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <IconComponent name="close" size={24} color={colors.text} />
              </TouchableOpacity>

              {/* Success Icon */}
              <View style={styles.successIcon}>
                <IconComponent name="checkmark-circle" size={64} color={colors.colorPrimary} />
              </View>

              <Text allowFontScaling={false} style={styles.title}>Your earning link is ready to share</Text>

              {/* Link Box */}
              <View style={styles.linkBox}>
                <Text allowFontScaling={false} style={styles.linkText} numberOfLines={1}>
                  {data.link}
                </Text>
                <TouchableOpacity onPress={copyLink} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
                  <IconComponent name="copy-outline" size={24} color={colors.colorPrimary} />
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <LinearGradient
                                     colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                                     style={styles.whatsappBtn}
                                              
                                    >
                <TouchableOpacity 
                style={[ {alignItems:'center', justifyContent:'center', flex: 1 ,flexDirection:'row',gap:8 ,}]}
            
                onPress={shareWhatsApp}>
                  <IconComponent name="logo-whatsapp" size={20} color={colors.white} />
                  <Text allowFontScaling={false} style={styles.btnText}>Share</Text>
                </TouchableOpacity>
                </LinearGradient>

                <TouchableOpacity style={styles.generalBtn} onPress={shareGeneral}>
                   <IconComponent name="share-social-outline" size={22} color={colors.colorPrimary} />
                             
                  <Text allowFontScaling={false} style={styles.generalBtnText}>Share On</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '100%', maxWidth: 460, paddingHorizontal: 20 },
  content: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16 },
      android: { elevation: 8 },
      web: { cursor: 'default' },
    }),
  },
  closeBtn: { position: 'absolute', top: 16, right: 16, zIndex: 10, padding: 4 },
  successIcon: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: 10 },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    gap: 12,
  },
  linkText: { flex: 1, fontSize: 14, fontWeight:'600', color: colors.colorPrimary },
  buttonRow: { flexDirection: 'row', gap: 12 },
  whatsappBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  generalBtn: {
    flex: 1,
    gap:8,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.colorPrimary,
  },
  btnText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  generalBtnText: { color: colors.colorPrimary, fontSize: 14, fontWeight: '600' },
});
// src/utils/commonFunctions.native.js
import Share from "react-native-share";
import { productService } from "../../api/services/product.service";

/**
 * Record share analytics (optional backend tracking)
 */


/**
 * Share link or image (using react-native-share)
 */
export const shareLink = async (title, message, id, imageUrl = null) => {
  try {
    const shareOptions = {
      title: title || "Share Feature",
      message: message || "Check this out!",
    };

    if (imageUrl) {
      // `react-native-share` supports file paths or remote URLs
      shareOptions.url = imageUrl;
    }

    const result = await Share.open(shareOptions);
    console.log("✅ Shared successfully:", result);
  } catch (error) {
    if (error.message !== "User did not share") {
      console.error("❌ Error sharing link:", error.message);
    }
  }
};

/**
 * Share directly to WhatsApp (example of shareSingle)
 */
export const shareToWhatsApp = async (message, id, imageUrl = null) => {
  try {
   

    const options = {
      social: Share.Social.WHATSAPP,
      message: message || "Check this out!",
    };

    if (imageUrl) {
      options.url = imageUrl;
    }

    await Share.shareSingle(options);
    console.log("✅ Shared to WhatsApp");
  } catch (error) {
    console.error("❌ Error sharing to WhatsApp:", error.message);
  }
};

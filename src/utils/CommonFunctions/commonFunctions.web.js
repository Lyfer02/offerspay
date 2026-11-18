// src/utils/commonFunctions.web.js
import { productService } from "../../api/services/product.service";

/**
 * Record share analytics (optional backend tracking)
 */


/**
 * Share link or image using Web APIs
 */
export const shareLink = async (title, message, id, imageUrl = null) => {
  try {
   

    const shareData = {
      title: title || "Share Feature",
      text: message || "Check this out!",
    };

    if (imageUrl) {
      // Fetch image blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "share-image.jpg", { type: blob.type });
      shareData.files = [file];
    }

    // Use native share if supported
    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      console.log("✅ Shared successfully on Web");
    } else {
      // Fallback
      await navigator.clipboard.writeText(message || window.location.href);
      alert("📋 Link copied! Your browser doesn’t support Web Share.");
    }
  } catch (error) {
    console.error("❌ Error sharing link:", error.message);
  }
};

/**
 * Share to WhatsApp (Web)
 */
export const shareToWhatsApp = async (message, id) => {
  try {
   
    const encoded = encodeURIComponent(message || "Check this out!");
   // window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
    window.location.href = `whatsapp://send?text=${encoded}`;
  } catch (error) {
    console.error("❌ Error sharing to WhatsApp:", error.message);
  }
};

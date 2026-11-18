// src/utils/commonFunctions_one.js
import { Platform } from "react-native";
import { LoadingService } from "./loadingService";

// ────────────────────────────────────────────────────────────────
// Safe Imports — Web पर crash नहीं होगा
let Share = null;
let RNFS = null;

if (Platform.OS !== "web") {
  try {
    Share = require("react-native-share").default;
  } catch (e) {
    console.warn("react-native-share not available");
  }
  try {
    RNFS = require("react-native-fs");
  } catch (e) {
    console.warn("react-native-fs not available");
  }
}

// ────────────────────────────────────────────────────────────────
// Mobile: Download image locally (bypass remote URL bugs)
const downloadImageForShare = async (imageUrl) => {
  if (Platform.OS === "web" || !RNFS) return imageUrl;

  if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.startsWith("http"))
    return imageUrl;

  try {
    const ext = imageUrl.split(".").pop().split("?")[0] || "jpg";
    const fileName = `share_${Date.now()}.${ext}`;
    const localPath = `${RNFS.TemporaryDirectoryPath}${fileName}`;

    const result = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: localPath,
    }).promise;

    if (result.statusCode === 200) {
      return `file://${localPath}`;
    }
  } catch (e) {
    console.log("Download failed, using remote URL:", e.message);
  }
  return imageUrl; // Fallback
};

// ────────────────────────────────────────────────────────────────
// Web: Convert URLs to File objects
const fetchImagesAsFiles = async (imageUrls) => {
  if (Platform.OS !== "web") return [];
  // Ensure imageUrls is an array, defaulting to empty array if null/undefined
  const urls = Array.isArray(imageUrls) ? imageUrls : [];
  const files = [];

  for (let url of urls) {
    if (typeof url !== "string" || !url.startsWith("http")) continue;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const blob = await res.blob();
      const ext = blob.type.split("/")[1] || "jpg";
      files.push(new File([blob], `image.${ext}`, { type: blob.type }));
    } catch (e) {
      console.log("Failed to fetch image for web share:", url);
    }
  }
  return files;
};

// ────────────────────────────────────────────────────────────────
// WhatsApp Share (Web + Mobile)
export const shareToWhatsApp = async (message, imageUrls = null, title = "Check this out!") => {
  try {
  //  console.log("shareToWhatsApp →", imageUrls);
    LoadingService.show("Preparing share...");
    // WEB
    if (Platform.OS === "web") {
      let text = message || "Check this out!";
      if (imageUrls) {
        const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
        const valid = urls.filter(u => typeof u === "string" && u.startsWith("http"));
        if (valid.length > 0) text += `\n\n${valid.join("\n")}`;
      }
      const encoded = encodeURIComponent(text);
      window.open(`https://web.whatsapp.com/send?text=${encoded}`, "_blank");
      return;
    }

    // MOBILE
    if (!Share) {
      alert("Sharing not available");
      return;
    }

    const options = {
      title,
      message: message || "Check this out!",
      social: Share.Social.WHATSAPP,
      failOnCancel: false,
    };

    if (imageUrls) {
      // Ensure urls array exists before filtering
      let urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      urls = urls.filter(u => typeof u === "string" && u.startsWith("http"));

      if (urls.length === 1) {
        options.url = await downloadImageForShare(urls[0]);
      } else if (urls.length > 1) {
        options.urls = urls;
      }
    }

    await Share.open(options);
  } catch (error) {
    console.log("WhatsApp share error:", error);
  }
  finally{
    LoadingService.hide();
  }
};

// ────────────────────────────────────────────────────────────────
// Generic Share (Web Share API + Mobile)
export const shareLink = async (title, message, imageUrls = null) => {

  LoadingService.show("Preparing share...");
  try {
   // console.log("shareLink →", imageUrls);

    // WEB
    if (Platform.OS === "web") {
      if (navigator.share) {
        const data = { title, text: message };
        if (imageUrls && navigator.canShare) {
          const files = await fetchImagesAsFiles(imageUrls);
          if (files.length > 0) {
            data.files = files;
            if (navigator.canShare(data)) {
              await navigator.share(data);
              return;
            }
          }
        }
        await navigator.share(data);
      } else {
        let text = `${title}\n\n${message}`;
        if (imageUrls) {
          const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
          text += `\n\n${urls.filter(u => typeof u === "string").join("\n")}`;
        }
        // alert() का उपयोग नहीं करना चाहिए, लेकिन चूंकि यह Web Mock है,
        // और यह एक utility file है, इसे console.log में बदलते हैं।
        console.log("Copied to clipboard or ready to share:", text);
        // production में clipboard API का उपयोग करें
        
      }
      return;
    }

    // MOBILE
    if (!Share) {
      alert("Sharing not available");
      return;
    }

    const options = {
      title: title || "Check this out!",
      message: message || "Check this out!",
      failOnCancel: false,
    };

    if (imageUrls) {
      // Ensure urls array exists before filtering
      let urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      urls = urls.filter(u => typeof u === "string" && u.startsWith("http"));

      if (urls.length === 1) {
        options.url = await downloadImageForShare(urls[0]);
      } else if (urls.length > 1) {
        options.urls = urls;
      }
    }

    await Share.open(options);
  } catch (error) {
    console.log("Share error:", error);
  }
  finally{
    LoadingService.hide()
  }
};

// ────────────────────────────────────────────────────────────────
export const shareToSocial = async (platform, message, imageUrls = null, title = "Share") => {

  if (Platform.OS === "web") return shareLink(title, message, imageUrls);
  if (!Share) return alert("Sharing not available");

  

  try {
    LoadingService.show("Preparing share...");
    const options = { title, message, social: platform, failOnCancel: false };
    if (imageUrls) {
      // Ensure urls array exists before filtering
      let urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      urls = urls.filter(u => typeof u === "string" && u.startsWith("http"));
      if (urls.length === 1) {
        options.url = await downloadImageForShare(urls[0]);
      } else {
        options.urls = urls;
      }
    }
    await Share.open(options);
  } catch (e) {
    console.log("Social share error:", e);
  }
  finally{
    LoadingService.hide();
  }
};
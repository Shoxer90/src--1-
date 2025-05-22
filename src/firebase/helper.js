export const canUsePush = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isInstagram = ua.includes('instagram');
  const isTelegram = ua.includes('telegram');
  const isFacebook = ua.includes('fbav'); 
  const isWebView = (window.navigator.standalone === false && isIOS) || isInstagram || isTelegram || isFacebook;

  if(isWebView) {
    return false
  }else{
    return true
  }
};

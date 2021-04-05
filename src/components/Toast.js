import Toast from "react-native-toast-message";

export const showError = (message) => {
  Toast.show({
    type: "error",
    text1: "Attention! 👋",
    text2: message,
    position: "bottom",
    topOffset: 60,
    bottomOffset: 80,
  });
};

export const show = (message) => {
  Toast.show({
    text1: "Hello there! 👋",
    text2: message,
    topOffset: 60,
  });
};

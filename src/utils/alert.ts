import {Alert, Platform} from 'react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export const showAlert = (title: string, message?: string, buttons?: AlertButton[]): void => {
  if (Platform.OS === 'web') {
    // Web implementation using browser APIs
    if (buttons && buttons.length > 1) {
      // For confirmations, use window.confirm
      const confirmText = message ? `${title}\n\n${message}` : title;
      const confirmed = window.confirm(confirmText);

      if (confirmed) {
        // Find non-cancel button
        const actionButton = buttons.find(btn => btn.style !== 'cancel');
        if (actionButton && actionButton.onPress) {
          actionButton.onPress();
        }
      } else {
        // Find cancel button
        const cancelButton = buttons.find(btn => btn.style === 'cancel');
        if (cancelButton && cancelButton.onPress) {
          cancelButton.onPress();
        }
      }
    } else {
      // For simple alerts, use window.alert
      const alertText = message ? `${title}\n\n${message}` : title;
      window.alert(alertText);

      if (buttons && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // Mobile implementation using React Native Alert
    Alert.alert(title, message, buttons);
  }
};

export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText: string = 'OK',
  cancelText: string = 'Cancel',
): void => {
  showAlert(title, message, [
    {
      text: cancelText,
      style: 'cancel',
      onPress: onCancel,
    },
    {
      text: confirmText,
      style: 'destructive',
      onPress: onConfirm,
    },
  ]);
};

export const showSimpleAlert = (
  title: string,
  message?: string,
  buttonText: string = 'OK',
  onPress?: () => void,
): void => {
  showAlert(title, message, [
    {
      text: buttonText,
      onPress,
    },
  ]);
};

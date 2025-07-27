# Cross-Platform Alert System

The app now uses a custom alert utility that works on both web and mobile platforms.

## Import

```typescript
import { showAlert, showConfirm, showSimpleAlert } from '../utils/alert';
```

## Usage Examples

### Simple Alert
```typescript
showSimpleAlert('Success', 'Profile updated successfully!');
```

### Confirmation Dialog
```typescript
showConfirm(
  'Delete Data',
  'Are you sure you want to delete all data?',
  () => {
    // User confirmed - delete data
    deleteData();
  },
  () => {
    // User cancelled (optional)
    console.log('Cancelled');
  },
  'Delete',  // Confirm button text
  'Cancel'   // Cancel button text
);
```

### Advanced Alert
```typescript
showAlert('Title', 'Message', [
  {
    text: 'Cancel',
    style: 'cancel',
    onPress: () => console.log('Cancelled')
  },
  {
    text: 'OK',
    style: 'destructive',
    onPress: () => console.log('Confirmed')
  }
]);
```

## Platform Behavior

- **Web**: Uses `window.confirm()` and `window.alert()`
- **Mobile**: Uses React Native's `Alert.alert()`
- **Automatic**: No platform-specific code needed in components

## Migration Guide

### Before
```typescript
import { Alert } from 'react-native';

Alert.alert('Title', 'Message', [
  { text: 'Cancel', style: 'cancel' },
  { text: 'OK', onPress: () => doSomething() }
]);
```

### After
```typescript
import { showConfirm } from '../utils/alert';

showConfirm(
  'Title',
  'Message',
  () => doSomething(),
  undefined,
  'OK',
  'Cancel'
);
``` 
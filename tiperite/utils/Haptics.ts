import * as ExpoHaptics from 'expo-haptics';

/**
 * A wrapper of `expo-haptics` providing a cleaner API
 *
 * @see https://docs.expo.io/versions/latest/sdk/haptics/
 */
export class Haptics {
  public static impact(type: 'medium' | 'heavy' | 'light' = 'light'): void {
    ExpoHaptics.impactAsync(type as ExpoHaptics.ImpactFeedbackStyle);
  }

  public static notify(type: 'success' | 'warning' | 'error'): void {
    ExpoHaptics.notificationAsync(type as ExpoHaptics.NotificationFeedbackType);
  }

  public static select(): void {
    ExpoHaptics.selectionAsync();
  }
}

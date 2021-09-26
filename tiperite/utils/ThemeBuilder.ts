import { RootStyles, styles } from '../styles/styles';
import { themeSlice } from '../state/themeSlice';
import { Appearance } from 'react-native';
import { store } from '../state/store';

type RootStylesKey = keyof RootStyles;
type RootStylesSubkey = keyof RootStyles[RootStylesKey];

/**
 * A utility class for building `RootState.theme` and handling automatic changes
 *  to the `theme` state.
 */
export class ThemeBuilder {
  private static initialized = false;
  private static isDark = Appearance.getColorScheme() == 'dark';

  /**
   * Initialize the device theme change listener that will automatically rebuild
   *  the theme state when the device theme changes.
   *
   * @throws if already initialized
   */
  public static initialize(): void {
    if (this.initialized) throw Error('ThemeBuilder already initialized');
    this.initialized = true;

    Appearance.addChangeListener(({ colorScheme }) => {
      this.isDark = colorScheme == 'dark';
      store.dispatch(themeSlice.actions.set(this.build()));
    });
  }

  /**
   * Processes the styles to build the theme object that'll be set to
   *  `RootState.theme` and used in components throughout the app.
   */
  public static build(): RootStyles {
    // No changes are needed so we can return the default object
    if (!this.isDark) return styles;

    // Create a copy of the default styles that we can edit
    const newStyles = { ...styles };

    // Component or common group key
    const styleGroupKeys = Object.keys(newStyles) as RootStylesKey[];

    for (const styleGroupKey of styleGroupKeys) {
      // Create an editable copy
      newStyles[styleGroupKey] = { ...newStyles[styleGroupKey] };

      // Component element or common element key
      const styleSubGroupKeys = Object.keys(
        newStyles[styleGroupKey],
      ) as RootStylesSubkey[];

      for (const styleSubGroupKey of styleSubGroupKeys) {
        // Merge dark styles with original styles to build the final object
        // `Component.button` = `Component.button` + `Component.button_dark`
        if (styleSubGroupKey.endsWith('_dark')) {
          newStyles[styleGroupKey][styleSubGroupKey] = {
            // Original styles
            ...(newStyles[styleGroupKey][
              styleSubGroupKey.split('_')[0] as RootStylesSubkey
            ] as Record<string, unknown>),
            // Dark styles
            ...(newStyles[styleGroupKey][styleSubGroupKey] as Record<
              string,
              unknown
            >),
          };
        }
      }
    }

    return newStyles;
  }
}

ThemeBuilder.initialize();

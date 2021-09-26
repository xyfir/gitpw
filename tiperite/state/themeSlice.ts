import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootStyles, styles } from '../styles/styles';

type BuildThemeAction = PayloadAction<{
  isDark: boolean;
}>;

export const themeSlice = createSlice({
  initialState: styles,
  reducers: {
    /**
     * Process the styles to build the final theme state
     */
    build(_, action: BuildThemeAction): RootStyles {
      // Create a deep clone of the default styles
      // In the future, `structuredClone` may be a better alternative
      // Intentionally use vague types here or TypeScript will complain later
      const newStyles = JSON.parse(JSON.stringify(styles)) as Record<
        string,
        Record<string, unknown>
      >;

      // No changes are needed if we're not using a dark theme
      if (!action.payload.isDark) return newStyles as RootStyles;

      // Component or common group key
      const styleGroupKeys = Object.keys(newStyles);

      for (const styleGroupKey of styleGroupKeys) {
        // Component element or common element key
        const styleSubGroupKeys = Object.keys(newStyles[styleGroupKey]);

        for (const styleSubGroupKey of styleSubGroupKeys) {
          // Merge dark styles with original styles to build the final object
          // `Component.button` = `Component.button` + `Component.button_dark`
          if (styleSubGroupKey.endsWith('_dark')) {
            const originalStyleSubGroupKey = styleSubGroupKey.split('_')[0];

            newStyles[styleGroupKey][originalStyleSubGroupKey] = {
              // Original styles
              ...(newStyles[styleGroupKey][originalStyleSubGroupKey] as Record<
                string,
                unknown
              >),
              // Dark styles
              ...(newStyles[styleGroupKey][styleSubGroupKey] as Record<
                string,
                unknown
              >),
            };
          }
        }
      }

      return newStyles as RootStyles;
    },
  },
  name: 'styles',
});

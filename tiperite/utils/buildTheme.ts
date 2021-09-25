import { RootStyles, styles } from '../styles/styles';

type RootStylesKey = keyof RootStyles;
type RootStylesSubkey = keyof RootStyles[RootStylesKey];

/**
 * Processes the styles to build the theme object that'll be set to
 *  `RootState.theme`.
 */
export function buildTheme(isDark: boolean): RootStyles {
  // No changes are needed so we can return the default object
  if (!isDark) return styles;

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

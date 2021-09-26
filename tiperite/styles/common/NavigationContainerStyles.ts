import { Theme as NavigationContainerTheme } from '@react-navigation/native';

export const NavigationContainerStyles: {
  NavigationContainer: {
    root_dark: NavigationContainerTheme;
    root: NavigationContainerTheme;
  };
} = {
  NavigationContainer: {
    root_dark: {
      colors: {
        notification: 'red',
        background: '#000',
        primary: 'red',
        border: '#272729',
        text: '#FFF',
        card: '#000',
      },
      dark: true,
    },
    root: {
      colors: {
        notification: 'red',
        background: '#FFF',
        primary: 'red',
        border: '#D8D8D8',
        card: '#FFF',
        text: '#000',
      },
      dark: false,
    },
  },
};

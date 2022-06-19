import { Theme as NavigationContainerTheme } from '@react-navigation/native';

export const NavigationRootStyles: {
  NavigationRoot: {
    container_dark: NavigationContainerTheme;
    container: NavigationContainerTheme;
  };
} = {
  NavigationRoot: {
    container_dark: {
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
    container: {
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

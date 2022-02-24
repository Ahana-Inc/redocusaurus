import merge from 'lodash/merge';
import { RedocRawOptions } from 'redoc';
import { GlobalData, RedocThemeOverrides } from './types/common';

const defaultOptions: Partial<RedocRawOptions> = {
  scrollYOffset: 'nav.navbar',
  hideDownloadButton: true,
  expandSingleSchemaField: true,
  menuToggle: true,
  // @ts-expect-error not available in types
  suppressWarnings: true,
};

const getDefaultTheme = (primaryColor?: string): RedocThemeOverrides => ({
  colors: {
    primary: {
      main: primaryColor || '#25c2a0',
    },
  },
});

/**
 * TODO: Update colors from infima
 * @see https://github.com/facebookincubator/infima/blob/master/packages/core/styles/common/variables.pcss
 */
const DOCUSAURUS = {
  darkGray: '#303846',
  dark: {
    primaryText: '#f5f6f7',
    secondaryText: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgb(24, 25, 26)',
  },
};

/**
 * NOTE: Variables taken from infima
 * @see https://github.com/facebookincubator/infima/blob/master/packages/core/styles/common/variables.pcss
 */
const LIGHT_THEME_OPTIONS: RedocThemeOverrides = {
  typography: {
    fontFamily: 'var(--ifm-font-family-base)',
    fontSize: 'var(--ifm-font-size-base)',
    lineHeight: 'var(--ifm-line-height-base)',
    fontWeightLight: 'var(--ifm-font-weight-light)',
    fontWeightRegular: 'var(--ifm-font-weight-base)',
    fontWeightBold: 'var(--ifm-font-weight-bold)',
    headings: {
      fontFamily: 'var(--ifm-heading-font-family)',
      fontWeight: 'var(--ifm-heading-font-weight)',
      lineHeight: 'var(--ifm-heading-line-height)',
    },
    code: {
      backgroundColor: 'var(--ifm-code-background)',
      fontSize: 'var(--ifm-code-font-size)',
      fontFamily: 'var(--ifm-font-family-monospace)',
      lineHeight: 'var(--ifm-pre-line-height)',
    },
    links: {
      color: 'var(--ifm-link-color)',
      visited: 'var(--ifm-link-color)',
      hover: 'var(--ifm-link-hover-color)',
    }
  },
  sidebar: {
    /**
     * about the same as the sidebar in the docs area, for consistency
     * @see https://davidgoss.co/blog/api-documentation-redoc-docusaurus/
     */
    width: 'var(--doc-sidebar-width)',
    backgroundColor: '#ffffff',
    activeTextColor: 'var(--ifm-menu-color-active)',
    textColor: 'var(--ifm-menu-color)',
  },
  rightPanel: {
    backgroundColor: DOCUSAURUS.darkGray,
  },
};

const DARK_THEME_OPTIONS: RedocThemeOverrides = {
  colors: {
    text: {
      primary: DOCUSAURUS.dark.primaryText,
      secondary: DOCUSAURUS.dark.secondaryText,
    },
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
    },
    border: {
      dark: '#ffffff',
      light: 'rgba(0,0,0, 0.1)',
    },
  },
  schema: {
    nestedBackground: '#1c1e21',
    typeNameColor: DOCUSAURUS.dark.secondaryText,
    typeTitleColor: DOCUSAURUS.dark.secondaryText,
  },
  sidebar: {
    backgroundColor: DOCUSAURUS.dark.backgroundColor,
    textColor: 'var(--ifm-menu-color)',
  },
};

function getThemeOptions(
  baseTheme: RedocThemeOverrides,
  isDarkMode = false,
): RedocThemeOverrides {
  const mergedTheme = merge({}, baseTheme, LIGHT_THEME_OPTIONS);

  if (!isDarkMode) return mergedTheme;

  return merge(mergedTheme, DARK_THEME_OPTIONS);
}

export function getRedocThemes(baseTheme: RedocThemeOverrides): {
  darkTheme: RedocThemeOverrides;
  lightTheme: RedocThemeOverrides;
} {
  return {
    lightTheme: getThemeOptions(baseTheme, false),
    darkTheme: getThemeOptions(baseTheme, true),
  };
}

export function getGlobalData(
  primaryColor?: string,
  redocOptions?: Partial<RedocRawOptions>,
): GlobalData {
  const { lightTheme, darkTheme } = getRedocThemes(
    getDefaultTheme(primaryColor),
  );

  return {
    lightTheme,
    darkTheme,
    redocOptions: {
      ...defaultOptions,
      ...redocOptions,
    },
  };
}

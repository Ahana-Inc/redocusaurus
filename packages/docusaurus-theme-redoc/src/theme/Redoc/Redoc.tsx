import React from 'react';
import merge from 'lodash/merge';
import { RedocStandalone, ResolvedThemeInterface } from 'redoc';
// @ts-ignore
import { usePluginData } from '@docusaurus/useGlobalData';
import useThemeContext from '@theme/hooks/useThemeContext';
import type { Props } from "@theme/Redoc";
import './styles.css';

type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
  T[P] extends object ? RecursivePartial<T[P]> :
  T[P];
};

type ThemeOverrides = RecursivePartial<ResolvedThemeInterface>;

/**
 * NOTE: Colors taken from `node_modules/infima/styles/common/dark-mode.css`
 * and related files
 */
const DOCUSAURUS = {
  fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontSize: '16px',
  darkGray: '#303846',
  dark: {
    primaryText: '#f5f6f7',
    secondaryText: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgb(24, 25, 26)',
  }
};

let LIGHT_THEME_OPTIONS: ThemeOverrides = {
  typography: {
    fontSize: 'var(--ifm-font-size-base)',
    lineHeight: 'var(--ifm-line-height-base)',
    fontWeightRegular: 'var(--ifm-font-weight-normal)',
    fontWeightBold: 'var(--ifm-font-weight-bold)',
    fontWeightLight: 'var(--ifm-font-weight-light)',
    fontFamily: 'var(--ifm-font-family-base)',
    headings: {
      fontFamily: 'var(--ifm-font-family-base)',
      fontWeight: 'var(--ifm-heading-font-weight)',
      lineHeight: 'var(--ifm-heading-line-height)',
    },
    code: {
      fontSize: 'var(--ifm-code-font-size)',
      color: 'var(--ifm-code-color)',
      backgroundColor: 'var(--ifm-code-background)',
    },
    links: {
      color: 'var(--ifm-link-color)',
      visited: 'var(--ifm-link-color)',
      hover: 'var(--ifm-link-hover-color)',
    }
  },
  sidebar: {
    width: 'var(--doc-sidebar-width)',
    backgroundColor: '#ffffff',
    activeTextColor: 'var(--ifm-menu-color-active)',
    textColor: 'var(--ifm-menu-color)',
  },
  rightPanel: {
    backgroundColor: DOCUSAURUS.darkGray,
  }
};

let DARK_THEME_OPTIONS: ThemeOverrides = {
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

function getThemeOptions(baseTheme: ThemeOverrides, isDarkMode: boolean): ThemeOverrides {
  baseTheme = merge(baseTheme, LIGHT_THEME_OPTIONS);

  if (!isDarkMode) return baseTheme;

  return merge({}, baseTheme, DARK_THEME_OPTIONS);
}


function Redoc(props: Props) {
  const { isDarkTheme } = useThemeContext();
  const { baseTheme, redocOptions = null } = usePluginData('docusaurus-theme-redoc');
  const theme = React.useMemo(() => getThemeOptions(baseTheme, isDarkTheme), [baseTheme, isDarkTheme]);
  const { spec, specUrl } = props;

  return (
    <div className="redocusaurus">
      <RedocStandalone
        {...(spec ? { spec } : { specUrl })}
        options={{
          scrollYOffset: 'nav.navbar',
          hideDownloadButton: true,
          expandSingleSchemaField: true,
          menuToggle: true,
          // @ts-ignore
          suppressWarnings: true,
          ...(redocOptions),
          theme,
        }}
      />
    </div>
  );
}

export default Redoc;

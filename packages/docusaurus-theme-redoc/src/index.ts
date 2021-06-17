import path from 'path';
import webpack from 'webpack';
import type {
  LoadContext,
  Plugin,
} from '@docusaurus/types';
import { RedocRawOptions } from 'redoc';
import * as NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

export interface ThemeOptions {
  primaryColor?: string;
  redocOptions?: Omit<RedocRawOptions, 'theme'>;
};

export default function redocTheme(
  context: LoadContext,
  options: ThemeOptions,
): Plugin<null> {
  return {
    name: '@ahana-inc/docusaurus-theme-redoc',
    /**
     * @see https://github.com/Redocly/redoc/issues/1257
     */
    configureWebpack(config, isServer, utils) {
      if (isServer) return {};

      return {
        plugins: [
          new NodePolyfillPlugin.default()
        ],
        resolve: {
          fallback: {
            fs: false,
          }
        }
      };
    },
    async contentLoaded({content, actions}) {
      const {setGlobalData} = actions;
      // Create theme data global
      setGlobalData({
        redocOptions: options.redocOptions || {},
        baseTheme: {
          colors: {
            primary: {
              main: options.primaryColor || "#25c2a0"
            },
          },
        },
      });
    },
    getThemePath() {
      return path.join(__dirname, '..', 'dist-jsx', 'theme');
    },
    getTypeScriptThemePath() {
      return path.join(__dirname, '..', 'src', 'theme');
    },
    getClientModules() {
      return [path.join(__dirname, 'custom.css')];
    },
  };
};

export function getSwizzleComponentList() {
  return ['Redoc', 'ApiDoc'];
};

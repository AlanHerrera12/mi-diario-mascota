const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

/**
 * Force Zustand (v5) to resolve its CJS build instead of the ESM (.mjs) build.
 *
 * WHY: Expo SDK 54 enables `unstable_enablePackageExports: true` in Metro, which
 * causes Metro to pick up the `import` export condition → zustand's ESM files
 * (esm/index.mjs, esm/middleware.mjs, …).  Those files use `import.meta.env.MODE`
 * which is valid inside an ES-module but crashes with:
 *   "Cannot use 'import.meta' outside a module"
 * when bundled into Metro's classic (non-module) <script> tag.
 * The CJS files (index.js, middleware.js, …) are identical in behaviour but
 * never reference import.meta.
 */
const _resolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    (moduleName === 'zustand' ||
      moduleName === 'zustand/middleware' ||
      moduleName === 'zustand/react' ||
      moduleName === 'zustand/vanilla' ||
      moduleName === 'zustand/shallow')
  ) {
    // Strip the scope and resolve the CJS entry directly
    const subpath = moduleName.replace('zustand', '').replace(/^\//, '') || 'index';
    const cjsFile = path.resolve(
      __dirname,
      'node_modules/zustand',
      subpath === 'index' ? 'index.js' : `${subpath}.js`,
    );
    return { type: 'sourceFile', filePath: cjsFile };
  }
  // Delegate everything else to the default resolver
  if (_resolveRequest) return _resolveRequest(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './src/styles/global.css' });

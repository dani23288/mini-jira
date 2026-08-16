const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const webpack = require('webpack');

// Optional/conditional deps of mongodb, ws, and Apollo's fastify/federation integrations — none
// of these code paths run (no CSFLE, no compression codecs, no subscriptions, no federation),
// but webpack still tries to statically resolve the dynamic requires that guard them. Plain
// `externals` isn't merged into NxAppWebpackPlugin's own config, so IgnorePlugin instead.
// NOTE: @as-integrations/express5 is NOT dead code — @nestjs/apollo's Express driver actually
// requires it at runtime. It's a real dependency (see package.json) left unbundled via
// `externals` below instead, so don't add it back here.
const IGNORED_OPTIONAL_MODULES = new Set([
  '@aws-sdk/credential-providers',
  'gcp-metadata',
  'snappy',
  'socks',
  'kerberos',
  '@mongodb-js/zstd',
  'mongodb-client-encryption',
  'bufferutil',
  'utf-8-validate',
  '@as-integrations/fastify',
  '@apollo/subgraph',
  '@apollo/subgraph/package.json',
  '@apollo/subgraph/dist/directives',
  '@apollo/gateway',
  'ts-morph',
  'class-transformer/storage',
]);

module.exports = {
  externals: ['@as-integrations/express5'],
  // Persists webpack's module graph/transform output to disk across separate `webpack-cli build`
  // invocations (nx serve's watch mode re-shells out to a fresh build each restart, not a single
  // long-lived --watch process) so incremental rebuilds skip re-transforming unchanged files.
  cache: {
    type: 'filesystem',
  },
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    alias: {
      '@org/utils': join(__dirname, '../../packages/shared/utils/src/index.ts'),
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'swc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
    }),
    new webpack.IgnorePlugin({
      checkResource: (resource) => IGNORED_OPTIONAL_MODULES.has(resource),
    }),
  ],
};

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    sea_change: "./src/sea_change/main.js",
    worker: "./src/worker.js",
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: "raw-loader",
      },
    ],
  },

  devtool: "inline-source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  output: {
    path: path.join(__dirname, "public"),
    filename: "[name].js",
  },

  mode: "development",

  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    writeToDisk: true,
    open: true,
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/sea_change.html",
          force: true,
        },
        {
          from: "sprites/**/*",
        },
        {
          from: "audio/**/*",
        },
      ],
    }),
    new webpack.DefinePlugin({
      "typeof CANVAS_RENDERER": JSON.stringify(true),
      "typeof WEBGL_RENDERER": JSON.stringify(true),
    }),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};

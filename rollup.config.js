import commonjs from "@rollup/plugin-commonjs";
// import { babel } from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import polyfills from "rollup-plugin-node-polyfills";
import {terser} from "rollup-plugin-terser";

export default {
  input: "./src/index.js",
  output: [
    {
      file: "./dist/index.umd.js",
      format: "umd",
      name: "shrkeys"
    },
    {
      file: "./dist/index.umd.min.js",
      format: "umd",
      name: "shrkeys",
      plugins: [terser()]
    },
  ],
  plugins: [
    alias({
      entries: {
        'readable-stream': 'stream',
      }
    }),
    json(),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      // exclude: [
      //   "node_modules/js-sha3/**/*.js"
      // ],
      transformMixedEsModules: true
    }),
    polyfills({
      include: [
        'src/**/*.js',
        'node_modules/**/*.js',
      ]
    }),
    // babel({
    //   plugins: ["transform-commonjs"],
    //   babelHelpers: "bundled"
    // })
  ]
};

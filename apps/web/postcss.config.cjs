const postcssJitProps = require("postcss-jit-props");

module.exports = {
  plugins: [
    postcssJitProps({
      files: ["./node_modules/opui-css/dist/op.css"],
      layer: "open-props",
    }),
  ],
};

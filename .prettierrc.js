// https://prettier.io/docs/en/options.html
module.exports = {
  // 超过最大值换行
  printWidth: 120,
  // 让prettier使用eslint的代码格式进行校验
  eslintIntegration: true,
  // 让prettier使用stylelint的代码格式进行校验
  stylelintIntegration: true,
  // 在多行JSX元素最后一行的末尾添加 >
  // 而使 > 单独一行（不适用于自闭和元素）
  jsxBracketSameLine: false,
  // tab键宽度，默认为2
  tabWidth: 2,
  // 行末加分号
  semi: true,
  // 用单引号代替双引号
  singleQuote: true,
  // 对象&数组是否追加空格
  // e.g. false: {foo:bar}
  // true: { foo: bar }
  bracketSpacing: true,
  // 箭头函数参数括号 默认avoid 可选 avoid | always
  // avoid 能省略括号的时候就省略 例如x => x
  // always 总是有括号
  arrowParens: 'avoid',
  // 使用tab还是空格
  useTabs: false,
  // 行尾换行格式
  endOfLine: 'auto',
  trailingComma: 'none',
  htmlWhitespaceSensitivity: 'ignore'
};

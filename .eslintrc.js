module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-undef': 'off',
    'camelcase': 'off',
    //引号类型 `` "" ''
    "quotes": [2, "single"],
    // 关闭语句强制分号结尾
    "semi": [0],
    'no-tabs': 0,
    'no-mixed-spaces-and-tabs': 0,
    'indent': ["off", "tab"],
    'no-unused-vars': 0,
    'no-trailing-spaces': 0,
    "eqeqeq": 0,
    //函数定义时括号前面要不要有空格
    "space-before-function-paren": [0, "always"],
    //大括号内是否允许不必要的空格
    "object-curly-spacing": [0, "never"],
    "no-useless-escape": 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

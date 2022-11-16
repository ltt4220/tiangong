module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // "presets": [
  //   [
  //     "@vue/app",
  //     {
  //       "modules": "commonjs"
  //     }
  //   ]
  // ],
  "plugins": [

    ["transform-modules",
      {
        "cube-ui": {
          "transform": "cube-ui/lib/${member}", "kebabCase": true, "style": { "ignore": ["create-api", "better-scroll"] }
        }
      }
    ],
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant'],
    ['lodash']
  ],
  "env": {
    "test": {
      "presets": [
        [
          "@vue/app",
          {
            "modules": "commonjs"
          }
        ]
      ],
      "plugins": [
        "istanbul"
      ]
    }
  }
}

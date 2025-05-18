// Karma configuration
// Generated on Mon May 12 2025 16:08:12 GMT+0530 (India Standard Time)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],


    // list of files / patterns to load in the browser
    files: [
      'src/**/*.ts',          // Source files
      'test/**/*.spec.ts'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity,
    reporters: ['progress', 'karma-typescript'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/' // Output coverage reports in the 'coverage' directory
    },
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-typescript',
      'karma-coverage' // Karma TypeScript preprocessor
    ],
  })
}



{
  address_city
  :
  "hyd"
  address_post_code
  :
  "111111"
  address_state
  :
  "TG"
  address_street
  :
  "abc"
  business_tax_number
  :
  ""
  company_name
  :
  ""
  confirm_password
  :
  "111111"
  email
  :
  "viki@12.com"
  first_name
  :
  "abc"
  last_name
  :
  "k"
  mobile
  :
  "07639229843"
  password
  :
  "111111"
  phone_number
  :
  ""
  represntative_full_name
  :
  ""
  role
  :
  "user"
  type
  :
  ""
}
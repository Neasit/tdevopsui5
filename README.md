# grunt-tdevopsui5

Grunt tasks for build/deploy/version management of ui5 application
It's just small workaround to reduce gruntfile in project
the tasks:

- build (preload, js/css mini, resources, cachebooster-file, dbg files);

- deploy (to ABAP server via grunt-nwabap-ui5uploader + version + git tag for production);

- version (custom file to manage version in ABAP server);

```javascript
// version file example
{
  "current": {
    "version": "2.0.1",
    "user": "*****",
    "system": "XPF",
    "tr": "XPF*****",
    "date": "2019-10-03T07:38:03.593Z",
    "note": "Develop version (not stable)",
    "hash": "e1900bd8880a3113aacad0f88903b8ba23d3541e"
  },
  "history": []
}

```

## Getting Started

This plugin requires Grunt `~1.0.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-tdevopsui5 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-tdevopsui5');
```

## The "grunt-tdevopsui5" task

### Overview

In your project's Gruntfile, add a section to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  // config example for using tasks
  tdevopsui5_build: {
    test: {
      options: {
        // folders
        appName: 'Test application',
        src: 'test/src',
        dest: 'test/dist',
        tmp: 'test/tmp',
        ui5Resource: 'C:/SAPUI5/1.52.13/resources',
        // options
        babel: false,
        // preload
        appIndex: 'test',
        ui5version: '1.52',
        library: false,
        lib_comp: false,
        lib_to_resources: false,
        customOptions: {}, // not used for now
      },
    },
  },
  tdevopsui5_version: {
    test: {
      options: {
        type: 'M',
        dest: 'test/src',
        user: 'Test',
        transport: 'SYSNONE',
        tag: false,
        tagText: '',
        note: 'Test note M',
      },
    },
  },
  tdevopsui5_deploy: {
    gus: {
      options: {
        // abap options
        package: 'ZTESTADAN',
        bspcontainer: 'ZTEST_UI5',
        bspcontainer_text: 'UI5 Application',
        transportno: 'GUSK900018',
        calc_appindex: true,
        // folder
        dest: 'test/dist',
        src: 'test/src',
        // server info
        server: 'https://sapgwpsl.t-systems.ru:4443',
        client: '200',
        useStrictSSL: false,
        // credential
        user: '*********',

        pwd: '*********',

        // version
        version: 'P', // 'D', 'P', 'M'
      },
    },
  },
});

```

### Options

in process

#### Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

_(Nothing yet)_

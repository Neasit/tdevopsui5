/*
 * tdevopsui5
 * https://github.com/Neasit/tdevopsui5
 *
 * Copyright (c) 2019 Neasit
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    eslint: {
      target: ['Gruntfile.js', 'tasks/**/*.js', 'test/*.js'],
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/dist', 'test/src'],
    },

    copy: {
      tests: {
        files: [
          {
            expand: true,
            cwd: 'test/source',
            src: ['**/*.*', '**/.*'],
            dest: 'test/src',
          },
        ],
      },
    },

    // Configuration to be run (and then tested).
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
          // credentional
          user: '****',
          pwd: '****',
          // version
          version: 'P', // 'D', 'P', 'M'
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    'copy:tests',
    'tdevopsui5_version',
    'tdevopsui5_build',
    'tdevopsui5_deploy:gus',
    'nodeunit',
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['eslint']);
};

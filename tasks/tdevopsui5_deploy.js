/*
 * tdevopsui5 - tbuild task
 * https://github.com/Neasit/tdevopsui5
 *
 * Copyright (c) 2019 Neasit
 * Licensed under the MIT license.
 */

'use strict';

var optionFactories = require('./lib/optionsFactory.js');
var utils = require('./lib/utils.js');
var oTasksVersion = require('./tdevopsui5_version.js');

module.exports = function(grunt) {
  grunt.registerMultiTask('tdevopsui5_deploy', 'Deploy ui5 application to ABAP server', function() {
    var options = this.options({
      // abap options
      package: null,
      bspcontainer: null,
      bspcontainer_text: 'UI5 Application',
      transportno: null,
      calc_appindex: true,
      // folder
      dest: 'dist',
      src: '**/*.*',
      // server info
      server: null,
      client: null,
      useStrictSSL: false,
      // credentional
      user: null,
      pwd: null,
      // version
      version: null, // 'D', 'P', 'M'
    });

    if (
      !options.package ||
      !options.bspcontainer ||
      !options.transportno ||
      !options.server ||
      !options.client ||
      !options.user ||
      !options.pwd
    ) {
      throw new Error('Missing required options for deploy!');
    }

    var aTasks = [];

    if (options.version) {
      oTasksVersion(grunt);
      var oVersionOptions = optionFactories.createVersionOptions(options);
      var sTaskName = 'deploy' + options.version;
      grunt.config.set('tdevopsui5_version.' + sTaskName, oVersionOptions);
      aTasks.push('tdevopsui5_version:' + sTaskName);

      var oCopyOptions = optionFactories.createCopyOptions(options);
      utils.extendGrunt(grunt, 'grunt-contrib-copy', {
        'copy.version': oCopyOptions.version,
      });
      aTasks.push('copy:version');
    }

    var oUploaderOptions = optionFactories.createUploaderOptions(options);
    utils.extendGrunt(grunt, 'grunt-nwabap-ui5uploader', {
      'nwabap_ui5uploader.deploy': oUploaderOptions.deploy,
    });

    aTasks.push('nwabap_ui5uploader:deploy');

    grunt.task.run(aTasks);
  });
};

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
var process = require('process');
var path = require('path');

module.exports = function(grunt) {
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerTask('createResourcesJson', 'Create Resources.json file', function() {
    grunt.log.writeln('starting running createResourcesJson');
    utils.createResourceJson(path.join(process.cwd(), this.args[0]));
    grunt.log.writeln('finish running createResourcesJson');
  });

  grunt.registerTask(
    'createsCachebusterInfoJson',
    'Create sap-ui-cachebuster-info.json file',
    function() {
      grunt.log.writeln('starting running createCachebusterInfoJson');
      utils.createCachebusterInfoJson(path.join(process.cwd(), this.args[0]));
      grunt.log.writeln('finish running createCachebusterInfoJson');
    }
  );

  grunt.registerMultiTask('tdevopsui5_build', 'Build ui5 application', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      // folders
      appName: 'TEST',
      src: 'src',
      preloadFiles: ['**', '**/.*'],
      dest: 'dist',
      tmp: 'tmp',
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
    });

    var aTasks = [];
    // first clean temp and destination folders
    utils.extendGrunt(grunt, 'grunt-contrib-clean', {
      'clean.temp': options.tmp,
    });

    aTasks.push('clean:temp');

    utils.extendGrunt(grunt, 'grunt-contrib-clean', {
      'clean.dest': options.dest,
    });

    aTasks.push('clean:dest');

    // copy options and copy to temp folder
    var oCopyOptions = optionFactories.createCopyOptions(options);

    utils.extendGrunt(grunt, 'grunt-contrib-copy', {
      'copy.temp': oCopyOptions.temp,
    });

    aTasks.push('copy:temp');

    // preload
    var oPreloadOptions = optionFactories.createPreloadOptions(options);
    if (options.library) {
      utils.extendGrunt(grunt, 'grunt-openui5', {
        'openui5_preload.library': oPreloadOptions.library,
      });

      if (options.lib_comp) {
        utils.extendGrunt(grunt, 'grunt-openui5', {
          'openui5_preload.components': oPreloadOptions.components,
        });
        aTasks.push('openui5_preload:components');
      }
      aTasks.push('openui5_preload:library');
    } else {
      utils.extendGrunt(grunt, 'grunt-openui5', {
        'openui5_preload.application': oPreloadOptions.application,
      });
      aTasks.push('openui5_preload:application');
    }

    // Copy dbg
    utils.extendGrunt(grunt, 'grunt-contrib-copy', {
      'copy.dbg': oCopyOptions.dbg,
    });

    aTasks.push('copy:dbg');

    // babel
    if (options.babel) {
      var oBabelOption = optionFactories.createBabelOptions(options);
      utils.extendGrunt(grunt, 'grunt-babel', {
        'babel.temp': oBabelOption.tmp,
      });

      aTasks.push('babel:temp');
    }

    // js-mini
    var oJSMinOptions = optionFactories.createJSMiniOptions(options);
    utils.extendGrunt(grunt, 'grunt-contrib-uglify', {
      'uglify.tmp': oJSMinOptions.tmp,
    });

    aTasks.push('uglify:tmp');

    // css min
    var oCSSMinOptions = optionFactories.createCSSMinOptions(options);
    utils.extendGrunt(grunt, 'grunt-contrib-cssmin', {
      'cssmin.tmp': oCSSMinOptions.tmp,
    });

    aTasks.push('cssmin:tmp');

    // copy to dest
    utils.extendGrunt(grunt, 'grunt-contrib-copy', {
      'copy.dest': oCopyOptions.dist,
    });

    aTasks.push('copy:dest');

    // createResourcesJson
    aTasks.push('createResourcesJson:' + options.dest);

    // createsCachebusterInfoJson
    aTasks.push('createsCachebusterInfoJson:' + options.dest);

    // clean temp
    aTasks.push('clean:temp');

    // copy builded libs to resources
    if (options.library && options.lib_to_resources) {
      utils.extendGrunt(grunt, 'grunt-contrib-copy', {
        'copy.resourcesLib': oCopyOptions.resourcesLib,
      });

      aTasks.push('copy:resourcesLib');
    }

    // run all tasks
    grunt.task.run(aTasks);
  });
};

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

module.exports = function(grunt) {
  grunt.registerTask('addVersion', 'Create new version of app', function() {
    var options = this.options({
      // type D - dev; P - prod; M - maintenance;
      type: 'D',
      dest: 'src',
      user: 'test',
      transport: 'NONE',
      tag: false,
      tagText: 'Major version (prod)',
      note: 'Test note',
    });
    var aResults = grunt.config.get('gitlog.getCommit.result');
    var sVersion = utils.addVersion(
      grunt,
      options.dest,
      options.type,
      options.transport,
      options.user,
      options.note,
      aResults && aResults.length ? aResults[0].hash : ''
    );
    if (options.tag) {
      options.version = sVersion;
      var oGitAddTagOptions = optionFactories.createGitAddTagOptions(options);
      utils.extendGrunt(grunt, 'grunt-git', {
        'gittag.addtag': oGitAddTagOptions.addtag,
      });
      grunt.task.run('gittag:addtag');
    }
  });

  // User tasks
  grunt.registerMultiTask('tdevopsui5_version', 'Add next version to project', function() {
    var aTasks = [];
    var options = this.options({
      // type D - dev; P - prod; M - maintenance;
      type: 'D',
      dest: 'src',
      user: 'test',
      transport: 'NONE',
      tag: false,
      tagText: 'Major version (prod)',
      note: 'Test note',
    });

    var oGitLogOptions = optionFactories.createGitLogOptions(null);
    utils.extendGrunt(grunt, 'grunt-git', {
      'gitlog.getCommit': oGitLogOptions.getCommit,
    });

    aTasks.push('gitlog:getCommit');

    grunt.config.set('addVersion.options', options);

    aTasks.push('addVersion');

    grunt.task.run(aTasks);
  });
};

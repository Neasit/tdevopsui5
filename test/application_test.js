'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.tdevopsui5 = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  build_options: function(test) {
    test.expect(4);

    var bMainFiles = grunt.file.exists('test/dist/Component-preload.js');
    test.ok(bMainFiles, 'No Component-preload');
    bMainFiles = grunt.file.exists('test/dist/resources.json');
    test.ok(bMainFiles, 'No resources.json');
    bMainFiles = grunt.file.exists('test/dist/sap-ui-cachebuster-info.json');
    test.ok(bMainFiles, 'No sap-ui-cachebuster-info.json');
    bMainFiles = grunt.file.exists('test/dist/Component-dbg.js');
    test.ok(bMainFiles, 'No Component-dbg.js');
    test.done();
  },

  version_options: function(test) {
    test.expect(3);
    var bMainFiles = grunt.file.exists('test/src/version.json');
    test.ok(bMainFiles, 'No version in src');
    bMainFiles = grunt.file.exists('test/dist/version.json');
    test.ok(bMainFiles, 'No version in dist');

    if (bMainFiles) {
      var versionDist = grunt.file.read('test/dist/version.json');
      var versionSrc = grunt.file.read('test/src/version.json');

      test.equal(versionDist, versionSrc, 'Version files is not eq in dist and src');
    }
    test.done();
  },
};

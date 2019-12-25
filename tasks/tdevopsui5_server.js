/*
 * tdevopsui5 - tbuild task
 * https://github.com/Neasit/tdevopsui5
 *
 * Copyright (c) 2019 Neasit
 * Licensed under the MIT license.
 */

'use strict';

var express = require('express');
var serveStatic = require('serve-static');
var proxy = require('http-proxy-middleware');

module.exports = function(grunt) {
  grunt.registerMultiTask('tdevopsui5_server', 'Run simple test server', function() {
    var options = this.options({
      // abap options
      remoteServer: null,
      remoteUrlPrefix: '/sap',
      user: null,
      pwd: null,
      localPort: '3017',
      // resources
      ui5resources: null,
      appSource: null,
      firstResources: null,
      firstResourcesPath: null,
    });

    if (
      !options.appSource ||
      !options.ui5resources ||
      (options.remoteServer && (!options.user || !options.pwd))
    ) {
      throw new Error('Missing requered settings');
    }

    var done = this.async();
    var app = express();

    app.use(serveStatic(options.appSource));

    if (options.firstResources) {
      app.use(
        options.firstResources,
        serveStatic(options.firstResourcesPath, { fallthrough: false })
      );
    }

    app.use('/resources', serveStatic(options.ui5resources));

    if (options.remoteServer) {
      app.use(
        options.remoteUrlPrefix,
        proxy({
          target: options.remoteServer,
          changeOrigin: true,
          auth: options.user + ':' + options.pwd,
          onProxyRes: function(proxyRes) {
            var sPath = 'path=/';
            if (proxyRes.headers['set-cookie'] instanceof Array) {
              proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(function(sValue) {
                if (sValue.indexOf('SAP_SESSIONID') !== -1) {
                  // Hook - cookie have to store in browser
                  var oTemp = sValue.split(';');
                  oTemp.some(function(str) {
                    if (str.indexOf('SAP_SESSIONID') !== -1) {
                      sValue = str + '; ' + sPath;
                      grunt.log.writeln('Session Id (cookie): ' + sValue);
                      return true;
                    }
                    return false;
                  });
                  /*
              sValue = sValue.slice(0, sValue.indexOf('; secure; HttpOnly'));
              var sTemp = sValue.split(';')[0];
              var oTemp = sTemp.split('=');
              oSAPId.name = oTemp[0];
              oSAPId.value = oTemp[1];
              sValue = sValue.slice(0, -18);
              */
                }
                return sValue;
              });
            }
          },
        })
      );
    }
    app.listen(options.localPort);
    grunt.log.writeln('Server run on: localhost: ' + options.localPort);
    grunt.log.writeln('Note: task will be automatically stop after 8 h');
    setTimeout(function() {
      done(true);
    }, 28800000);
  });
};

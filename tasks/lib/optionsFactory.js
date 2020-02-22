/*
 * tdevopsui5 - options for tasks
 * https://github.com/Neasit/tdevopsui5
 *
 * Copyright (c) 2019 Neasit
 * Licensed under the MIT license.
 */

var TASK_NAMES = {
  copy: 'copy',
  preload: 'openui5_preload',
  jsmini: 'uglify',
  babel: 'babel',
  cssmin: 'cssmin',
  uploader: 'uploader',
  gittag: 'gittag',
};

/**
 * Copy object property to other object
 * @param {object} sSource source
 * @param {object} oTarget source
 * @param {boolean} bCreate should be created
 */
function fillObjectValues(oSource, oTarget, bCreate) {
  var aKeys = Object.keys(oSource);
  var oReturn = $.extend(true, {}, oTarget);
  aKeys.forEach(function(sKey) {
    if (oReturn[sKey] !== undefined || bCreate) {
      if (Array.isArray(oSource[sKey])) {
        oReturn[sKey] = oSource[sKey].slice(0);
      } else if (oSource[sKey] instanceof Object) {
        oReturn[sKey] = $.extend(true, {}, oSource[sKey]);
      } else {
        oReturn[sKey] = oSource[sKey];
      }
    }
  });
  return oReturn;
}

/**
 * Check - all options is there
 * @param {string} sTaskName task name
 * @param {object} oOptions options of main task
 */
function checkOptions(sTaskName, oOptions) {
  var bResult;
  switch (sTaskName) {
    case TASK_NAMES.copy:
      bResult = oOptions.src && oOptions.dest;
      break;
    case TASK_NAMES.preload:
      bResult = oOptions.tmp && oOptions.appIndex;
      break;
    case TASK_NAMES.jsmini:
      bResult = oOptions.tmp && oOptions.appName;
      break;
    case TASK_NAMES.babel:
    case TASK_NAMES.cssmin:
      bResult = oOptions.tmp;
      break;
    case TASK_NAMES.gittag:
      bResult = oOptions.tagText && oOptions.version;
      break;
    case TASK_NAMES.uploader:
      bResult =
        oOptions.server &&
        oOptions.client &&
        oOptions.user &&
        oOptions.pwd &&
        oOptions.package &&
        oOptions.bspcontainer &&
        oOptions.transportno;
      break;
    default:
      bResult = false;
  }
  return bResult;
}

/**
 * Return predefined options for uploader task
 * subTask: addtag
 * @param {object} oOptions option of main task
 */
function createUploaderOptions(oOptions) {
  if (checkOptions(TASK_NAMES.uploader, oOptions)) {
    return {
      deploy: {
        options: {
          conn: {
            server: oOptions.server,
            client: oOptions.client,
            useStrictSSL: oOptions.useStrictSSL,
          },
          auth: {
            user: oOptions.user,
            pwd: oOptions.pwd,
          },
          ui5: {
            package: oOptions.package,
            bspcontainer: oOptions.bspcontainer,
            bspcontainer_text: oOptions.bspcontainer_text,
            transportno: oOptions.transportno,
            calc_appindex: oOptions.calc_appindex,
          },
          resources: {
            cwd: oOptions.dest,
            src: '**/*.*',
          },
        },
      },
    };
  } else {
    throw new Error('Missing options for create cssmin tasks');
  }
}

function createVersionOptions(oOptions) {
  return {
    options: {
      type: oOptions.version,
      dest: oOptions.dest,
      user: oOptions.user,
      transport: oOptions.transportno,
      tag: oOptions.version === 'P',
      tagText: 'Major version (prod)',
      note: 'Deploy to system ' + oOptions.transportno.slice(0, 3) + ', type ' + oOptions.version,
    },
  };
}

/**
 * Return predefined options for gitadd task
 * subTask: addtag
 * @param {object} oOptions option of main task
 */
function createGitAddTagOptions(oOptions) {
  if (checkOptions(TASK_NAMES.gittag, oOptions)) {
    return {
      addtag: {
        options: {
          tag: oOptions.version,
          message: oOptions.tagText,
        },
      },
    };
  } else {
    throw new Error('Missing options for create gitadd tasks');
  }
}

/**
 * Return predefined options for cssmin task
 * subTask: tmp
 * @param {object} oOptions option of main task
 */
function createCSSMinOptions(oOptions) {
  if (checkOptions(TASK_NAMES.cssmin, oOptions)) {
    return {
      tmp: {
        files: [
          {
            expand: true,
            src: '**/*.css',
            dest: oOptions.tmp,
            cwd: oOptions.tmp,
          },
        ],
      },
    };
  } else {
    throw new Error('Missing options for create cssmin tasks');
  }
}

/**
 * Return predefined options for gitLog task
 * subTask: getCommit
 * @param {object} oOptions option of main task
 */
function createGitLogOptions(oOptions) {
  var oResult = oOptions;
  if (!oOptions) {
    oResult = {
      getCommit: {
        options: {
          prop: 'gitlog.getCommit.result',
          number: 1,
        },
      },
    };
  }
  return oResult;
}

/**
 * Return predefined options for babel task
 * subTask: tmp
 * @param {object} oOptions option of main task
 */
function createBabelOptions(oOptions) {
  if (checkOptions(TASK_NAMES.babel, oOptions)) {
    return {
      tmp: {
        options: {
          sourceMap: 'inline',
          presets: ['@babel/preset-env'],
        },
        files: [
          {
            expand: true, // Enable dynamic expansion.
            cwd: oOptions.tmp, // Src matches are relative to this path.
            src: ['**/*.js', '!**/*-dbg*', '!**/libs/*.*', '!**/*-preload.js'],
            dest: oOptions.tmp, // Destination path prefix.
          },
        ],
      },
    };
  } else {
    throw new Error('Missing options for create babel tasks');
  }
}

/**
 * Return predefined options for js-mini task
 * subTask: tmp
 * @param {object} oOptions option of main task
 */
function createJSMiniOptions(oOptions) {
  if (checkOptions(TASK_NAMES.jsmini, oOptions)) {
    return {
      tmp: {
        options: {
          banner: '/*!' + oOptions.appName + ' ' + Date().toString() + ' */\n',
        },
        files: [
          {
            expand: true,
            cwd: oOptions.tmp,
            src: ['**/*.js', '!**/*preload.js', '!**/*.min.js', '!**/*-dbg*'],
            dest: oOptions.tmp,
          },
        ],
      },
    };
  } else {
    throw new Error('Missing options for create js-mini tasks');
  }
}

/**
 * Return predefined options for preload task
 * subTask: components, library, application
 * @param {object} oOptions option of main task
 */
function createPreloadOptions(oOptions) {
  if (checkOptions(TASK_NAMES.preload, oOptions)) {
    var oPreload = {};
    if (oOptions.library) {
      oPreload = {
        components: {
          options: {
            resources: {
              cwd: oOptions.tmp,
              prefix: oOptions.appIndex,
              src: ['**', '**/.*'],
            },
            dest: oOptions.tmp,
            compatVersion: oOptions.ui5version,
          },
          components: true,
        },
        library: {
          options: {
            resources: {
              cwd: oOptions.tmp,
              prefix: oOptions.appIndex,
              src: ['**', '**/.*'],
            },
            dest: oOptions.tmp,
            compatVersion: oOptions.ui5version,
          },
          libraries: oOptions.appIndex,
        },
      };
    } else {
      oPreload = {
        application: {
          options: {
            resources: {
              cwd: oOptions.tmp,
              prefix: oOptions.appIndex,
            },
            dest: oOptions.tmp,
            compatVersion: oOptions.ui5version,
          },
          components: oOptions.appIndex,
        },
      };
    }
    return oPreload;
  } else {
    throw new Error('Missing options for create preload tasks');
  }
}

/**
 * Return predefined options for copy task
 * subTask: temp, dbg, dist, version, resourcesLib
 * @param {object} oOptions option of main task
 */
function createCopyOptions(oOptions) {
  if (checkOptions(TASK_NAMES.copy, oOptions)) {
    var oCopy = {
      temp: {
        files: [
          {
            expand: true,
            cwd: oOptions.src,
            src: ['**/*.*', '**/.*', '!**/*.md'],
            dest: oOptions.tmp,
          },
          {
            expand: true,
            cwd: '',
            src: ['neo-app.json'],
            dest: oOptions.tmp,
          },
        ],
      },
      dbg: {
        files: [
          {
            expand: true,
            cwd: oOptions.tmp,
            src: ['**/*.*', '!libs/*.*', '!**/*.min.js', '!**/*-preload.js'],
            dest: oOptions.tmp,
            rename: function(dest, src) {
              // this.js -> this-dbg.js
              var destinationFilename = '';
              if (src.endsWith('.controller.js') > 0) {
                destinationFilename =
                  dest + '/' + src.replace(/\.controller\.js$/, '-dbg.controller.js');
              } else {
                destinationFilename = dest + '/' + src.replace(/\.js$/, '-dbg.js');
              }
              return destinationFilename;
            },
          },
        ],
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: oOptions.tmp,
            src: ['**/*.*', '**/.*'],
            dest: oOptions.dest,
          },
        ],
      },
      version: {
        files: [
          {
            expand: true,
            cwd: oOptions.dest,
            src: ['version.json'],
            dest: oOptions.src,
          },
        ],
      },
    };

    if (oOptions.library) {
      oCopy.resourcesLib = {
        files: [
          {
            expand: true,
            cwd: oOptions.dest,
            src: ['**', '**/.*', '!**/*.md'],
            dest: oOptions.ui5Resource + '/' + oOptions.appIndex,
          },
        ],
      };
    }
    return oCopy;
  } else {
    throw new Error('Missing options for create copy tasks');
  }
}

/**
 * export
 */
exports.createCopyOptions = createCopyOptions;
exports.createPreloadOptions = createPreloadOptions;
exports.createJSMiniOptions = createJSMiniOptions;
exports.createBabelOptions = createBabelOptions;
exports.createCSSMinOptions = createCSSMinOptions;
exports.createGitLogOptions = createGitLogOptions;
exports.createUploaderOptions = createUploaderOptions;
exports.createGitAddTagOptions = createGitAddTagOptions;
exports.createVersionOptions = createVersionOptions;

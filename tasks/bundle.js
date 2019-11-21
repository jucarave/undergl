const gulp = require('gulp');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const watchify = require('watchify');
const errorify = require('errorify');

function getProjectPath() {
  return 'src/';
}

function getEntriesPath() {
  return getProjectPath() + 'Game.ts';
}

function getDestinyPath() {
  return 'dist/js';
}

function getTSConfigFile() {
  return './tsconfig.json';
}

function onError(error) {
  console.error(error);
}

const tsConfig = require('.' + getTSConfigFile());

function baseBrowserify() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: [getEntriesPath()],
    paths: [getProjectPath()],
    files: tsConfig.files,
    cache: {},
    packageCache: {}
  })
    .plugin(tsify, { project: getTSConfigFile() })
    .add('src/Game.ts')
    .on('error', onError);
}

function buildBundle(bundle) {
  return bundle
    .bundle()
    .pipe(source('game.js'))
    .pipe(gulp.dest(getDestinyPath()));
}

module.exports = {
  build() {
    const bundle = baseBrowserify();

    return buildBundle(bundle);
  },

  watch() {
    const bundle = baseBrowserify();

    bundle.plugin(watchify).plugin(errorify);

    bundle.on('update', function() {
      buildBundle(bundle);
    });

    bundle.on('log', function(msg) {
      console.log(msg);
    });

    buildBundle(bundle);

    return bundle;
  }
};

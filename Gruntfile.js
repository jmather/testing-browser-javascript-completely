'use strict';

var fs = require('fs');
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    var modules = fs.readdirSync(__dirname+'/node_modules');
    for (var i in modules) {
        var directory = modules[i];

        if (fs.lstatSync(__dirname+'/node_modules/'+directory).isDirectory() === false) {
            continue;
        }

        if (directory.substr(0, 6) === 'grunt-' && directory !== 'grunt-cli') {
            grunt.loadNpmTasks(directory);
        }
    }

    // configurable paths
    var yeomanConfig = {
        app: __dirname + '/app',
        dist: __dirname + '/dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        shell: {
            coverage: {
                command: 'scripts/support/run-coverage-test.sh',
                options: {
                    stdout: true
                }
            },
            bower: {
                command: 'node_modules/.bin/bower install',
                options: {
                    stdout: true
                }
            }
        },
        'mocha_phantomjs': {
            cli: {
                options: {
                    urls: ['http://localhost:9002/index.html'],
                    reporter: 'spec'
                }
            },
            ci: {
                options: {
                    output: 'build/logs/mocha.xml',
                    urls: ['http://localhost:9002/index.html'],
                    reporter: 'xunit'
                }
            },
            coverage: {
                options: {
                    urls: ['http://localhost:9003/index.html'],
                    reporter: 'spec'
                }
            }
        },
        open: {
            test: {
                path: 'test/temp.html'
            }
        },
        connect: {
            keepalive: {
                options: {
                    keepalive: true,
                    port: 9001,
                    debug: true,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'test'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9002,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'test'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            },
            coverage: {
                options: {
                    port: 9003,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'test'),
                            mountFolder(connect, 'coverage/app'),
                            connect.json(),
                            function (req, res) {
                                fs.writeFile('coverage/out/coverage.json', JSON.stringify(req.body), function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('Code coverage information exported!');
                                    }
                                });
                                res.write('{\'status\': \'success\'}');
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end();
                            }
                        ];
                    }
                }
            }
        }
    });

    grunt.registerTask('test:generate-test-list', function () {
        var file = grunt.option('file');
        if (file) {
            file = file.replace(/^test\//, '');
        }

        var files = (file) ? [file] : grunt.file.expand({cwd: 'test'}, 'unit/**/*.test.js');
        grunt.file.write('test/test_file_list.js', 'var testFiles = ' + JSON.stringify(files));
    });

    grunt.registerTask('test:coverage:process', [
        'connect:coverage',
        'mocha_phantomjs:coverage'
    ]);

    grunt.registerTask('test:coverage:init', [
        'test:generate-test-list',
        'shell:coverage'
    ]);

    grunt.registerTask('test:cli', [
        'test:generate-test-list',
        'connect:test',
        'mocha_phantomjs:cli'
    ]);

    grunt.registerTask('test:ci', [
        'test:generate-test-list',
        'connect:test',
        'mocha_phantomjs:ci'
    ]);

    grunt.registerTask('test:browser', [
        'test:generate-test-list',
        'open:test',
        'connect:keepalive'
    ]);

    grunt.registerTask('test:coverage', [
        'test:coverage:init'
    ]);

    grunt.registerTask('test', [
        'test:cli'
    ]);

    grunt.registerTask('bower', [
        'shell:bower'
    ]);
};

# Testing Browser JavaScript Completely

Testing JavaScript is hard. Testing JavaScript meant for the browser is even harder. There is not any one
thing in particular, but building an entire testing ecosystem that plays well with itself and fulfills
all the requirements of a modern, robust testing configuration is an immense undertaking. We have been
there. We have trialed and erred. We have backtracked. We have hit many more dead ends than I care to talk about.

All of that work has led us here.

## Features

* [Mocha][mocha_site], [Chai][chai_site], and [Expect][expect_site] based testing framework.
* [RequireJS][requirejs_site] backed dependency system.
* [PhantomJS][phantomjs_site] AND in-browser testing.
* Ability to run full test suite or just one file.
* Code coverage powered by [Istanbul][istanbul_site].
* build.xml for getting started with [Jenkins][jenkins_site].
* Sample Jenkins config.xml for metrics configuration.

## Getting started

To get things ready, just do the following:

    git clone https://github.com/jmather/testing-browser-javascript-completely
    npm install
    grunt bower

## Grunt Commands

| Command         | Description                                  |
|-----------------|----------------------------------------------|
| `test`          | Run all unit tests                           |
| `test:browser`  | Run all unit tests in your preferred browser |
| `test:coverage` | Run code coverage                            |

 Now `test` and `test:browser` also have an optional argument `--file` which can be passed a single file.
 This is quite helpful if you are just trying to finish up a single unit test.

### Examples

To run all of your unit tests:

    grunt test

To run one unit test:

    grunt test --file test/unit/file.test.js

To run all of your unit tests in the browser:

    grunt test:browser

To run one unit test in the browser:

    grunt test:browser --file test/unit/file.test.js

[mocha_site]: http://visionmedia.github.io/mocha/
[chai_site]: http://chaijs.com/
[expect_site]: https://github.com/LearnBoost/expect.js/
[requirejs_site]: http://requirejs.org/
[phantomjs_site]: http://phantomjs.org/
[istanbul_site]: http://gotwarlost.github.io/istanbul/
[jenkins_site]: http://jenkins-ci.org/
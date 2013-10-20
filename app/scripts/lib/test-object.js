define(function (require, exports, module) {
    'use strict';

    function TestObject() {
    }

    TestObject.prototype.testMethod = function() {
        return 'test class';
    };

    module.exports = TestObject;
});
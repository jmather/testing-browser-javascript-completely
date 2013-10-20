define(function (require) {
    'use strict';

    var TestObject = require('lib/test-object');

    describe('Testing TestObject', function () {
        var testObject = new TestObject();

        describe('Test testMethod', function () {
            it('returns "test class"', function () {
                expect(testObject.testMethod()).to.equal('test class');
            });
        });
    });
});

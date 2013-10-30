// Testing your Q.js code can be hard to do asynchronously in Jasmine.
//
// waitsForNextTick() works with Jasmine's runs() calls and blocks until the
// Q.js queue is clear before continuing. This ensures that any Q.js callbacks
// registered before this will be completed before you try to test your
// code.
function waitsForNextTick() {
    var flag;

    waitsFor(function() {
        if (flag === undefined) {
            flag = false;

            Q.resolve().then(function() {
                flag = true;
            });
        }
        return flag;
    });
}

// waitsForPromise(promise).toBeFulfilled()
function waitsForPromise(promise) {
    return {
        toBeFulfilled: function() {
           waitsFor(function() {
               return promise.isFulfilled();
           });
        }
    };
}

function addQMatchers() {
    this.addMatchers({
        toHaveBeenResolved: function() {
            var actual = this.actual;
            var notText = this.isNot ? " not" : "";

            this.message = function() {
                return "Expected" + actual + notText + " to be a resolved promise";
            };

            return actual.isFulfilled();
        },
        toHaveBeenResolvedWith: function(val) {
            var actual = this.actual;
            var notText = this.isNot ? " not" : "";

            this.message = function() {
                return "Expected" + actual + notText + " to be a promise resolved with " + val;
            };

            return actual.isFulfilled() && actual.valueOf() === val;
        }
    });
}

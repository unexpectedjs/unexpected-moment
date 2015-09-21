(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('moment'));
    } else if (typeof define === 'function' && define.amd) {
        define(['moment'], factory);
    } else {
        root.moment = root.moment || {};
        root.moment.unexpectedMoment = factory(root.moment);
    }
}(this, function (moment) {
    return {
        name: 'unexpected-moment',

        installInto: function (expect) {
            expect.addType({
                name: 'moment',
                base: 'object',
                identify: function (value) {
                    return value && moment.isMoment(value);
                },
                equal: function (a, b) {
                    return a.isSame(b);
                },
                inspect: function (value, depth, output) {
                    output.jsFunctionName('moment')
                        .text('(')
                        .jsPrimitive(value.toISOString())
                        .text(')');
                },
                diff: function (actual, expected, output, diff) {
                    return diff(actual.toISOString(), expected.toISOString());
                }
            });

            expect.addAssertion('[not] to be a moment', function (expect, subject) {
                expect(moment.isMoment(subject), '[not] to be true');
            });

            expect.addAssertion('moment', '[not] to be before', function (expect, subject, value) {
                if (subject.isBefore(value) === this.flags.not) {
                    expect.fail();
                }
            });

            expect.addAssertion('moment', '[not] to be after', function (expect, subject, value) {
                if (subject.isAfter(value) === this.flags.not) {
                    expect.fail();
                }
            });

            expect.addAssertion('moment', 'when formatted with', function (expect, subject, format) {
                return this.shift(subject.format(format), 1);
            });

            expect.addAssertion('moment', '[not] to equal', function (expect, subject, value, label) {
                var granularity = (label || '').replace(/^in /, '').replace(/s$/, '');
                if (subject.isSame(value, granularity) === this.flags.not) {

                    this.argsOutput = function (output) {
                        output.appendInspected(value);
                        if (granularity) {
                            output.sp().text(label);
                        }
                    };

                    expect.fail({
                        diff: function (output, diff, inspect, equal) {
                            return diff(subject, value);
                        }
                    });
                }
            });

            expect.addAssertion('moment', '[not] to be the start of (second|minute|hour|day|week|isoWeek|month|quarter|year)', function (expect, subject) {
                var unitOfTime = this.alternations[0];
                if (subject.isSame(subject.clone().startOf(unitOfTime)) === this.flags.not) {
                    expect.fail();
                }
            });

            expect.addAssertion('moment', '[not] to be the end of (second|minute|hour|day|week|isoWeek|month|quarter|year)', function (expect, subject) {
                var unitOfTime = this.alternations[0];
                if (subject.isSame(subject.clone().endOf(unitOfTime)) === this.flags.not) {
                    expect.fail();
                }
            });
        }
    };
}));

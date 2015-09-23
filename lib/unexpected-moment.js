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
                    var name = value.isUtc() ? 'moment.utc' : 'moment';
                    output.jsFunctionName(name)
                        .text('(')
                        .jsPrimitive(value.toISOString())
                        .text(')');
                },
                diff: function (actual, expected, output, diff) {
                    return diff(actual.toISOString(), expected.toISOString());
                }
            });

            expect.addAssertion('[not] to be a moment', function (expect, subject) {
                if (moment.isMoment(subject) === this.flags.not) {
                    expect.fail()
                }
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
                // TODO: let moment validate granularity or validate it (and fail if it's not valid)?
                var granularity = (label || '').replace(/^in /, '').replace(/s$/, '');

                if (moment.isMoment(value) === this.flags.not && subject.isSame(value, granularity) === this.flags.not) {

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

            expect.addAssertion('moment', '[not] to satisfy', function (expect, subject, value) {
                // TODO: this is a fix for https://github.com/moment/moment/issues/2633
                // May not be necessary if that is the expected behaviour
                if (subject.isUtc() && !moment.isMoment(value)) {
                    value = moment.utc(value);
                }
                if (subject.isSame(value) === this.flags.not) {
                    expect.fail();
                }
            });
        }
    };
}));

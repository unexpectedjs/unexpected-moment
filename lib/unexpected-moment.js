(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('moment'));
    } else if (typeof define === 'function' && define.amd) {
        define(['moment'], factory);
    } else {
        // TODO: global moment object is deprecated and will be removed in v3
        root.moment = root.moment || {};
        root.moment.unexpectedMoment = factory(root.moment);
    }
}(this, function (moment) {
    var outputFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

    return {
        name: 'unexpected-moment',

        installInto: function (expect) {
            expect.addType({
                name: 'moment-like',
                base: 'any',
                identify: function (value) {
                    return typeof value !== 'undefined' && moment(value).isValid();
                },
                equal: function (a, b) {
                    return moment(a).isSame(b);
                },
                inspect: function (value, depth, output) {
                    if (moment.isMoment(value)) {
                        var functionName = 'moment';
                        if (value.isUtc()) {
                            functionName = 'moment.utc';
                        }
                        output.jsFunctionName(functionName)
                            .text('(')
                            .jsPrimitive(value.format(outputFormat))
                            .text(')');
                    }
                },
                diff: function (actual, expected, output, diff) {
                    console.log(moment.isMoment(expected), moment.isMoment(expected) && expected.format());
                    if (moment.isMoment(expected)) {
                        return diff(actual.format(outputFormat), expected.format(outputFormat));
                    }
                }
            });

            expect.addType({
                name: 'moment',
                base: 'moment-like',
                identify: function isMoment(value) {
                    return value && moment.isMoment(value);
                }
            });

            expect.addAssertion('<any> [not] to be a moment', function (expect, subject) {
                return expect(moment.isMoment(subject), '[not] to be true');
            });

            expect.addAssertion('<moment> [not] to be before <moment-like>', function (expect, subject, value) {
                return expect(subject.isBefore(value), '[not] to be true');
            });

            expect.addAssertion('<moment> [not] to be after <moment-like>', function (expect, subject, value) {
                return expect(subject.isAfter(value), '[not] to be true');
            });

            expect.addAssertion('<moment> [not] to be same or before <moment-like>', function (expect, subject, value) {
                return expect(subject.isSameOrBefore(value), '[not] to be true');
            });

            expect.addAssertion('<moment> [not] to be same or after <moment-like>', function (expect, subject, value) {
                return expect(subject.isSameOrAfter(value), '[not] to be true');
            });

            expect.addAssertion('<moment> [not] to be [inclusively] between <moment-like> <moment-like>', function (expect, subject, from, to) {
                expect.argsOutput = function (output) {
                    output.appendInspected(from).text(' and ').appendInspected(to);
                };

                var inclusivity;
                if (expect.flags.inclusively) {
                    inclusivity = '[]';
                }

                return expect(subject.isBetween(from, to, null, inclusivity), '[not] to be true');
            });

            expect.addAssertion('<moment> when formatted with <string> <assertion>', function (expect, subject, format) {
                return expect.shift(subject.format(format));
            });

            expect.addAssertion('<moment> [not] to equal <moment> <string?>', function (expect, subject, value, label) {
                // TODO: validate granularity?
                var granularity = (label || '').replace(/^in /, '').replace(/s$/, '');

                if (subject.isSame(value, granularity) === expect.flags.not) {
                    expect.argsOutput = function (output) {
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

            // TODO: error diff for this
            expect.addAssertion('<moment> [not] to be the start of (second|minute|hour|day|week|isoWeek|month|quarter|year)', function (expect, subject) {
                var unitOfTime = expect.alternations[0];
                return expect(subject.isSame(subject.clone().startOf(unitOfTime)), '[not] to be true');
            });

            // TODO: error diff for this
            expect.addAssertion('<moment> [not] to be the end of (second|minute|hour|day|week|isoWeek|month|quarter|year)', function (expect, subject) {
                var unitOfTime = expect.alternations[0];
                return expect(subject.isSame(subject.clone().endOf(unitOfTime)), '[not] to be true');
            });

            // TODO: error diff for this
            expect.addAssertion('<moment> to satisfy <moment-like>', function (expect, subject, value) {
                return expect(subject.isSame(value), 'to be true');
            });
        }
    };
}));

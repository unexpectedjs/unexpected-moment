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
                        .jsPrimitive(value.format(outputFormat))
                        .text(')');
                },
                diff: function (actual, expected, output, diff) {
                    return diff(actual.format(outputFormat), expected.format(outputFormat));
                }
            });

            expect.addAssertion('[not] to be a moment', function (expect, subject) {
                expect(moment.isMoment(subject), '[not] to be true');
            });

            expect.addAssertion('moment', '[not] to be before', function (expect, subject, value) {
                expect(subject.isBefore(value), '[not] to be true');
            });

            expect.addAssertion('moment', '[not] to be after', function (expect, subject, value) {
                expect(subject.isAfter(value), '[not] to be true');
            });

            expect.addAssertion('moment', 'when formatted with', function (expect, subject, format) {
                return this.shift(subject.format(format), 1);
            });

            expect.addAssertion('moment', '[not] to equal', function (expect, subject, value, label) {
                var that = this;
                // TODO: validate granularity?
                var granularity = (label || '').replace(/^in /, '').replace(/s$/, '');

                function appendLabelToOutput () {
                    that.argsOutput = function (output) {
                        output.appendInspected(value);
                        if (granularity) {
                            output.sp().text(label);
                        }
                    };
                }

                if (!moment.isMoment(value)) { // ensure strict equality for this assertion
                    if (!this.flags.not) {
                        appendLabelToOutput();
                        // TODO: better error message for this
                        return expect.fail();
                    }
                    return this;
                }

                if (subject.isSame(value, granularity) === this.flags.not) {
                    appendLabelToOutput();
                    expect.fail({
                        diff: function (output, diff, inspect, equal) {
                            return diff(subject, value);
                        }
                    });
                }
            });

            expect.addAssertion('moment', '[not] to be the start of (second|minute|hour|day|week|isoWeek|month|quarter|year)', function (expect, subject) {
                var unitOfTime = this.alternations[0];
                expect(subject.isSame(subject.clone().startOf(unitOfTime)), '[not] to be true');
            });

            expect.addAssertion('moment', '[not] to be the end of (second|minute|hour|day|week|isoWeek|month|quarter|year)', function (expect, subject) {
                var unitOfTime = this.alternations[0];
                expect(subject.isSame(subject.clone().endOf(unitOfTime)), '[not] to be true');
            });

            expect.addAssertion('moment', 'to satisfy', function (expect, subject, value) {
                // TODO: better error message if this fails
                expect(subject.isSame(value), 'to be true');
            });
        }
    };
}));

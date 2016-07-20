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
                    return value && value instanceof moment;
                },
                equal: function (a, b) {
                    return a.isSame(b);
                },
                inspect: function (value, depth, output, inspect) {
                    var name = value.isUtc() ? 'moment.utc' : 'moment';
                    output.jsFunctionName(name)
                        .text('(')
                        .jsString(inspect(value.format(outputFormat)))
                        .text(')');
                },
                diff: function (actual, expected, output, diff, inspect) {
                    return diff(inspect(actual).toString(), inspect(expected).toString());
                }
            });

            expect.addType({
                name: 'moment-date',
                base: 'date',
                identify: function (value) {
                    return value && value instanceof Date;
                },
                inspect: function (value, depth, output, inspect) {
                    output.jsFunctionName('new Date')
                        .text('(')
                        .jsString(inspect(value.toString()))
                        .text(')');
                },
                diff: function (actual, expected, output, diff, inspect) {
                    return diff(inspect(actual).toString(), inspect(expected).toString());
                }
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
                    return expect.fail({
                        diff: function (output, diff, inspect, equal) {
                            if (!expect.flags.not) {
                                return diff(subject, value);
                            }
                        }
                    });
                }
            });

            expect.addAssertion('<moment> to satisfy <moment|string|number|date|array|object>', function (expect, subject, value) {
                if (value instanceof moment) {
                    return expect(subject, 'to equal', value);
                }
                // TODO: use nested errorMode?

                // TODO: perhaps add a moment-like type that filters out invalid values in the first place
                var originalSuppressDeprecationWarningsSetting = moment.suppressDeprecationWarnings;
                moment.suppressDeprecationWarnings = true;
                var valueAsMomentInstance = moment(value);
                moment.suppressDeprecationWarnings = originalSuppressDeprecationWarningsSetting;

                if (!valueAsMomentInstance.isValid()) {
                    return expect.fail();
                }

                if (value instanceof Date) {
                    return expect(subject.toDate(), 'to equal', value);
                }

                if (Array.isArray(value)) {
                    if (!value.length) {
                        return expect.fail();
                    }
                    return expect(
                        subject.toArray().slice(0, value.length),
                        'to satisfy',
                        value
                    );
                }

                var valueType = typeof value;
                if (valueType === 'object') {
                    var normalizedValue = {};
                    var keys = Object.keys(value);
                    if (!keys.length) {
                        return expect.fail();
                    }
                    for (var i = 0; i < keys.length; i++) {
                        var unit = keys[i];
                        var normalizedUnit = moment.normalizeUnits(unit);
                        if (!normalizedUnit) {
                            expect.errorMode = 'nested';
                            return expect.fail({
                                message: function (output) {
                                    output.nl()
                                        .text('Unit \'')
                                        .jsString(unit)
                                        .text('\'')
                                        .sp()
                                        .text('is not a valid moment unit');
                                }
                            });
                        }
                        if (normalizedUnit === 'day') {
                            normalizedUnit = 'date'; // Urgh
                        }
                        if (normalizedUnit !== 'date') {
                            normalizedUnit += 's'; // Urgh
                        }
                        normalizedValue[normalizedUnit] = value[unit];
                    }
                    return expect(subject.toObject(), 'to satisfy', normalizedValue);
                }

                if (valueType === 'string') {
                    var desiredFormat = valueAsMomentInstance._f || outputFormat;
                    return expect(subject.format(desiredFormat), 'to satisfy', value);
                }

                if (valueType === 'number') {
                    var subjectAsNumber = subject.valueOf();
                    if (subjectAsNumber !== value) {
                        return expect.fail({
                            diff: function (output, diff, inspect, equal) {
                                return diff(String(subjectAsNumber), String(value));
                            }
                        });
                    }
                }
            });

            expect.addAssertion('<any> [not] to be a moment', function (expect, subject) {
                return expect(moment.isMoment(subject), '[not] to be true');
            });

            expect.addAssertion('<moment> [not] to be before <moment|string|number|date|array|object>', function (expect, subject, value) {
                return expect(subject.isBefore(value), '[not] to be true');
            });

            expect.addAssertion('<moment> [not] to be after <moment|string|number|date|array|object>', function (expect, subject, value) {
                return expect(subject.isAfter(value), '[not] to be true');
            });

            expect.addAssertion('<moment> [not] to be same or before <moment|string|number|date|array|object>', function (expect, subject, value) {
                return expect(subject.isSameOrBefore(value), '[not] to be true');
            });

            expect.addAssertion('<moment> [not] to be same or after <moment|string|number|date|array|object>', function (expect, subject, value) {
                return expect(subject.isSameOrAfter(value), '[not] to be true');
            });

            expect.addAssertion('<moment> [not] to be [inclusively] between <moment|string|number|date|array|object> <moment|string|number|date|array|object>', function (expect, subject, from, to) {
                expect.argsOutput = function (output) {
                    output.appendInspected(from).text(' and ').appendInspected(to);
                };

                var inclusivity;
                if (expect.flags.inclusively) {
                    inclusivity = '[]';
                }

                return expect(subject.isBetween(from, to, null, inclusivity), '[not] to be true');
            });

            expect.addAssertion([
                '<moment> [when] formatted <assertion?>',
                '<moment> [when] formatted with <string> <assertion?>'
            ], function (expect, subject, format) {
                if (expect.testDescription.indexOf('with') < 0) {
                    format = undefined;
                }
                return expect.shift(subject.format(format));
            });

            expect.addAssertion('<moment> [not] to be the start of (second|minute|hour|day|week|isoWeek|month|quarter|year)', function (expect, subject) {
                var unitOfTime = expect.alternations[0];
                return expect(subject, '[not] to equal', subject.clone().startOf(unitOfTime));
            });

            expect.addAssertion('<moment> [not] to be the end of (second|minute|hour|day|week|isoWeek|month|quarter|year)', function (expect, subject) {
                var unitOfTime = expect.alternations[0];
                return expect(subject, '[not] to equal', subject.clone().endOf(unitOfTime));
            });
        }
    };
}));

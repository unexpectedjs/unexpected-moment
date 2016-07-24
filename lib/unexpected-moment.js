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
    return {
        name: 'unexpected-moment',

        installInto: function (expect) {
            var outputFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

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

            expect.addAssertion('<any> [not] to be a moment', function (expect, subject) {
                return expect(moment.isMoment(subject), '[not] to be true');
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

            function ensureValid(value, expect) {
                if (value instanceof moment || value instanceof Date) {
                    return;
                }

                var originalSetting = moment.suppressDeprecationWarnings;
                moment.suppressDeprecationWarnings = true;
                var valueAsMoment = moment(value);
                moment.suppressDeprecationWarnings = originalSetting;

                if (!valueAsMoment.isValid()) {
                    return expect.fail();
                }

                if (Array.isArray(value)) {
                    if (!value.length) {
                        return expect.fail();
                    }
                    return;
                }

                if (typeof value === 'object') {
                    var keys = Object.keys(value);
                    if (!keys.length) {
                        return expect.fail();
                    }
                    for (var i = 0; i < keys.length; i++) {
                        var unit = keys[i];
                        if (!moment.normalizeUnits(unit)) {
                            expect.errorMode = 'nested';
                            return expect.fail({
                                message: function (output) {
                                    output.nl()
                                       .text('Unit \'')
                                       .jsString(unit)
                                       .text('\'')
                                       .sp()
                                       .text('is not a valid unit');
                                }
                            });
                        }
                    }
                }
            }

            function inspectDate(date, output) {
                output.jsKeyword('new')
                    .sp()
                    .text('Date(')
                    .appendInspected(date.toString())
                    .text(')');
            }

            function diffDates(date1, date2, diff, output) {
                return output.block(function (output) {
                    output.jsKeyword('new')
                        .sp()
                        .text('Date(\'')
                        .nl()
                        .jsKeyword('new')
                        .sp()
                        .text('Date(\'');
                }).block(diff(
                    date1.toString(),
                    date2.toString()
                )).block(function (output) {
                    output.text('\')')
                        .nl()
                        .text('\')');
                });
            }

            function normalizeObject(object) {
                return Object.keys(object).reduce(function (normalizedObject, unit) {
                    var normalizedUnit = moment.normalizeUnits(unit);
                    if (normalizedUnit === 'day') {
                        normalizedUnit = 'date'; // Urgh
                    }
                    if (normalizedUnit !== 'date') {
                        normalizedUnit += 's'; // Urgh
                    }
                    normalizedObject[normalizedUnit] = object[unit];
                    return normalizedObject;
                }, {});
            }

            expect.addAssertion('<moment> to satisfy <moment|string|number|date|array|object>', function (expect, subject, value) {
                ensureValid(value, expect);
                if (value instanceof moment) {
                    return expect(subject, 'to equal', value);
                }
                if (!subject.isSame(value)) {
                    return expect.fail({
                        diff: function (output, diff) {
                            if (value instanceof Date) {
                                expect.argsOutput = function (output) {
                                    inspectDate(value, output);
                                };
                                return diffDates(
                                    subject.toDate(),
                                    value,
                                    diff,
                                    output
                                );
                            }
                            if (Array.isArray(value)) {
                                return diff(
                                    subject.toArray().slice(0, value.length),
                                    value
                                );
                            }
                            var valueType = typeof value;
                            if (valueType === 'object') {
                                var normalizedValue = normalizeObject(value);
                                var subjectAsObject = subject.toObject();
                                Object.keys(subjectAsObject).forEach(function (key) {
                                    if (!normalizedValue.hasOwnProperty(key)) {
                                        delete subjectAsObject[key];
                                    }
                                });
                                return diff(
                                    subjectAsObject,
                                    normalizedValue
                                );
                            }
                            if (valueType === 'string') {
                                var matchingFormat = moment(value)._f;
                                return diff(
                                    subject.format(matchingFormat || outputFormat),
                                    value
                                );
                            }
                            if (valueType === 'number') {
                                var subjectAsNumber = subject.valueOf();
                                return diff(
                                    String(subjectAsNumber),
                                    String(value)
                                );
                            }
                        }
                    });
                }
            });

            function assert(expect, subject, value, method) {
                ensureValid(value, expect);
                if (subject[method](value) === expect.flags.not) {
                    if (value instanceof Date) {
                        expect.argsOutput = function (output) {
                            inspectDate(value, output);
                        };
                    }
                    return expect.fail();
                }
            }

            expect.addAssertion('<moment> [not] to be before <moment|string|number|date|array|object>', function (expect, subject, value) {
                return assert(expect, subject, value, 'isBefore');
            });

            expect.addAssertion('<moment> [not] to be after <moment|string|number|date|array|object>', function (expect, subject, value) {
                return assert(expect, subject, value, 'isAfter');
            });

            expect.addAssertion('<moment> [not] to be same or before <moment|string|number|date|array|object>', function (expect, subject, value) {
                return assert(expect, subject, value, 'isSameOrBefore');
            });

            expect.addAssertion('<moment> [not] to be same or after <moment|string|number|date|array|object>', function (expect, subject, value) {
                return assert(expect, subject, value, 'isSameOrAfter');
            });

            expect.addAssertion('<moment> [not] to be [inclusively] between <moment|string|number|date|array|object> <moment|string|number|date|array|object>', function (expect, subject, from, to) {
                var inclusivity;
                if (expect.flags.inclusively) {
                    inclusivity = '[]';
                }
                if (subject.isBetween(from, to, null, inclusivity) === expect.flags.not) {
                    expect.argsOutput = function (output) {
                        if (from instanceof Date) {
                            output.append(function (output) {
                                inspectDate(from, output);
                            });
                        } else {
                            output.appendInspected(from);
                        }
                        output.text(' and ');
                        if (to instanceof Date) {
                            output.append(function (output) {
                                inspectDate(to, output);
                            });
                        } else {
                            output.appendInspected(to);
                        }
                    };
                    return expect.fail();
                }
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

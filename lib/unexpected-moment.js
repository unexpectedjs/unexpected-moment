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

            function prefix(output, value) {
                var functionName = value.isUtc() ? 'moment.utc' : 'moment';
                return output.jsFunctionName(functionName).text('(');
            }

            function getDateString(date) {
                var dateString = date.toString();
                var milliseconds = date.getMilliseconds();
                var millisecondsString;
                if (milliseconds > 0) {
                    millisecondsString = String(milliseconds);
                    while (millisecondsString.length < 3) {
                        millisecondsString = '0' + millisecondsString;
                    }
                } else {
                    millisecondsString = '000';
                }
                return dateString.replace(' GMT', '.' + millisecondsString + ' GMT');
            }

            function formatDiff(actual, expected, output, diff, inspect, equal) {
                var actualIsUtc = actual.isUtc();
                var expectedIsMoment = expected instanceof moment;
                var expectedIsDate = expected instanceof Date;
                var expectedIsArray = Array.isArray(expected);
                var typeOfExpected = typeof expected;
                var expectedIsObject = typeOfExpected === 'object' &&
                    !(expectedIsArray || expectedIsMoment || expectedIsDate);
                var expectedIsString = typeOfExpected === 'string';
                var expectedIsNumber = typeOfExpected === 'number';

                var momentShouldBe;
                var functionNameShouldBe;
                if (expectedIsMoment) {
                    if (actualIsUtc) {
                        if (!expected.isUtc()) {
                            functionNameShouldBe = 'moment';
                        }
                    } else {
                        if (expected.isUtc()) {
                            functionNameShouldBe = 'moment.utc';
                        }
                    }
                    if (functionNameShouldBe) {
                        momentShouldBe = 'should be ';
                    }
                } else {
                    if (actualIsUtc) {
                        momentShouldBe = 'should be in local time';
                    }
                }

                prefix(output, actual);
                if (momentShouldBe) {
                    output.sp().annotationBlock(function () {
                        this.error(momentShouldBe);
                        if (functionNameShouldBe) {
                            this.jsFunctionName(functionNameShouldBe).text('(');
                        }
                    });
                }

                var actualForDiff;
                var expectedForDiff;
                var formattedDiff;
                if (expectedIsMoment) {
                    actualForDiff = actual.format(outputFormat);
                    expectedForDiff = expected.format(outputFormat);
                }
                if (expectedIsDate) {
                    actualForDiff = getDateString(actual.toDate());
                    expectedForDiff = getDateString(expected);
                }
                if (expectedIsArray) {
                    actualForDiff = actual.toArray().slice(0, expected.length);
                    expectedForDiff = expected;
                }
                if (expectedIsObject) {
                    actualForDiff = {};
                    expectedForDiff = expected;
                    var actualAsObject = actual.toObject();
                    var actualKeys = Object.keys(actualAsObject);
                    var expectedKeys = Object.keys(expected);
                    expectedKeys.forEach(function (expectedKey, index) {
                        var testKey = expectedKey;
                        if (['day', 'days', 'dates'].indexOf(expectedKey) > -1) {
                            testKey = 'date';
                        }
                        actualKeys.some(function (actualKey) {
                            if (actualKey.indexOf(testKey) === 0) {
                                var actualValue = actualAsObject[actualKey];
                                var expectedValue = expected[expectedKey];
                                if (typeof expectedValue === 'string') {
                                    actualValue = String(actualValue);
                                }
                                actualForDiff[expectedKey] = actualValue;
                                return true;
                            }
                        });
                    });
                }
                if (expectedIsString) {
                    var expectedFormat = moment(expected)._f;
                    actualForDiff = actual.format(expectedFormat || outputFormat);
                    expectedForDiff = expected;
                }
                if (expectedIsNumber) {
                    actualForDiff = actual.valueOf();
                    expectedForDiff = expected;
                    formattedDiff = diff(String(actualForDiff), String(expected));
                }

                output.nl().indentLines().i();
                if (expectedIsDate) {
                    output.jsKeyword('new').sp().text('Date(').nl().i().i();
                }

                var isEqual;
                if (!(expectedIsMoment || expectedIsDate)) {
                    if (equal(actualForDiff, expectedForDiff)) {
                        isEqual = true;
                        output.block(inspect(actualForDiff));
                    }
                }
                if (!formattedDiff) {
                    formattedDiff = diff(actualForDiff, expectedForDiff);
                }
                if (expectedIsArray || expectedIsObject) {
                    if (!isEqual && formattedDiff) {
                        output.block(formattedDiff);
                    }
                } else {
                    if (!isEqual) {
                        output.append(inspect(actualForDiff)).sp()
                            .annotationBlock(function () {
                                this.error('should be ')
                                    .append(inspect(expectedForDiff));
                                if (formattedDiff) {
                                    this.nl().append(formattedDiff);
                                }
                            });
                    }
                }
                if (expectedIsDate) {
                    output.nl().i().text(')');
                }

                return output.nl().text(')');
            }

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
                    prefix(output, value)
                        .append(inspect(value.format(outputFormat)))
                        .text(')');
                },
                diff: formatDiff
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

            function ensureValid(expect, value, subject) {
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
                    var units = Object.keys(value);
                    if (!units.length) {
                        return expect.fail();
                    }
                    var invalidUnits = units.filter(function (unit) {
                        return !moment.normalizeUnits(unit);
                    });
                    if (invalidUnits.length) {
                        return expect.fail({
                            diff: function (output, diff, inspect, equal) {
                                return prefix(output, subject).nl().indentLines().i()
                                    .block(function (block) {
                                        block.text('{').nl().indentLines();
                                        units.forEach(function (unit, index) {
                                            block.i().property(unit, inspect(value[unit]));
                                            if (index !== units.length - 1) {
                                                block.text(',');
                                            }
                                            if (invalidUnits.indexOf(unit) > -1) {
                                                block.sp().annotationBlock(function () {
                                                    this.error('not a valid unit');
                                                });
                                            }
                                            block.nl();
                                        });
                                        block.text('}');
                                    })
                                    .nl().text(')');
                            }
                        });
                    }
                }
            }

            function inspectDate(date, output) {
                output.jsKeyword('new')
                    .sp()
                    .text('Date(')
                    .appendInspected(getDateString(date))
                    .text(')');
            }

            // TODO: add granularity parameter
            expect.addAssertion('<moment> to satisfy <moment|string|number|date|array|object>', function (expect, subject, value) {
                if (value instanceof Date) {
                    expect.argsOutput = function (output) {
                        inspectDate(value, output);
                    };
                }
                ensureValid(expect, value, subject);
                if (value instanceof moment) {
                    return expect(subject, 'to equal', value);
                }
                if (!subject.isSame(value)) {
                    return expect.fail({
                        diff: function (output, diff, inspect, equal) {
                            return formatDiff(subject, value, output, diff, inspect, equal);
                        }
                    });
                }
            });

            // TODO: add granularity parameter
            function assert(expect, subject, value, method) {
                if (value instanceof Date) {
                    expect.argsOutput = function (output) {
                        inspectDate(value, output);
                    };
                }
                ensureValid(expect, value, subject);
                if (subject[method](value) === expect.flags.not) {
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

            // TODO: add granularity and inclusivity parameters
            expect.addAssertion('<moment> [not] to be [inclusively] between <moment|string|number|date|array|object> <moment|string|number|date|array|object>', function (expect, subject, from, to) {
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

                ensureValid(expect, from, subject);
                ensureValid(expect, to, subject);

                var inclusivity;
                if (expect.flags.inclusively) {
                    inclusivity = '[]';
                }

                if (subject.isBetween(from, to, null, inclusivity) === expect.flags.not) {
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

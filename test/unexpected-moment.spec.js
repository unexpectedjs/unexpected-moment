var sinon = require('sinon'),
    moment = require('moment'),
    unexpected = require('unexpected'),
    unexpectedMoment = require('../lib/unexpected-moment');

describe('unexpected-moment', function () {
    var expect = unexpected.clone()
        .installPlugin(unexpectedMoment);

    var clock;
    before(function () {
        clock = sinon.useFakeTimers();
    });

    after(function () {
        clock.restore();
    });

    it('identifies a moment.js instance', function () {
        expect(moment(), 'to be a moment');
    });

    it('does not falsely identify a date instance as a moment.js instance', function () {
        expect(new Date(), 'not to be a moment');
    });

    it('identifies a moment as equal to it\'s clone', function () {
        var m = moment();
        expect(m, 'to equal', m.clone());
    });

    it('identifies two unequal moments', function () {
        expect(moment(0), 'not to equal', moment(1));
    });

    it('identifies a moment that occurs before another chronologically', function () {
        expect(moment(0), 'to be before', moment(1));
        expect(moment(1), 'not to be before', moment(0));
    });

    it('identifies a moment that occurs after another chronologically', function () {
        expect(moment(1), 'to be after', moment(0));
        expect(moment(0), 'not to be after', moment(1));
    });

    it('allows formatting moments asserting against expected string outputs', function () {
        expect(moment(1), 'when formatted with', 'YYYY', 'to be', '1970');
        expect(moment(1), 'when formatted with', 'YYYY', 'to equal', '1970');
        expect(moment(1), 'when formatted with', 'YYYYMM', 'not to be', '1970');
        expect(moment(1), 'when formatted with', 'YYYYMM', 'not to equal', '1970');

        expect(moment.utc(), 'when formatted with', '', 'to be', '1970-01-01T00:00:00+00:00');
        expect(moment.utc(), 'when formatted with', '', 'to equal', '1970-01-01T00:00:00+00:00');
        expect(moment.utc(1000), 'when formatted with', '', 'not to be', '1970-01-01T00:00:00+00:00');
        expect(moment.utc(1000), 'when formatted with', '', 'not to equal', '1970-01-01T00:00:00+00:00');
    });

    it('identifies (un)equality in various granularity levels', function () {
        expect(moment(1), 'to equal', moment(1), 'in milliseconds');
        expect(moment(1), 'to equal', moment(1), 'in seconds');
        expect(moment(1), 'to equal', moment(1), 'in minutes');
        expect(moment(1), 'to equal', moment(1), 'in hours');
        expect(moment(1), 'to equal', moment(1), 'in days');
        expect(moment(1), 'to equal', moment(1), 'in weeks');
        expect(moment(1), 'to equal', moment(1), 'in months');
        expect(moment(1), 'to equal', moment(1), 'in years');

        expect(moment(1), 'not to equal', moment(2), 'in milliseconds');
        expect(moment(1), 'to equal', moment(2), 'in seconds');
        expect(moment(1), 'to equal', moment(2), 'in minutes');
        expect(moment(1), 'to equal', moment(2), 'in hours');
        expect(moment(1), 'to equal', moment(2), 'in days');
        expect(moment(1), 'to equal', moment(2), 'in weeks');
        expect(moment(1), 'to equal', moment(2), 'in months');
        expect(moment(1), 'to equal', moment(2), 'in years');

        var oneSecond = moment.duration(1, 'second').valueOf();
        expect(moment(oneSecond), 'not to equal', moment(oneSecond + oneSecond), 'in milliseconds');
        expect(moment(oneSecond), 'not to equal', moment(oneSecond + oneSecond), 'in seconds');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in minutes');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in hours');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in days');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in weeks');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in months');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in years');


        var oneMinute = moment.duration(1, 'minute').valueOf();
        expect(moment(oneMinute), 'not to equal', moment(oneMinute + oneMinute), 'in milliseconds');
        expect(moment(oneMinute), 'not to equal', moment(oneMinute + oneMinute), 'in seconds');
        expect(moment(oneMinute), 'not to equal', moment(oneMinute + oneMinute), 'in minutes');
        expect(moment(oneMinute), 'to equal', moment(oneMinute + oneMinute), 'in hours');
        expect(moment(oneMinute), 'to equal', moment(oneMinute + oneMinute), 'in days');
        expect(moment(oneMinute), 'to equal', moment(oneMinute + oneMinute), 'in weeks');
        expect(moment(oneMinute), 'to equal', moment(oneMinute + oneMinute), 'in months');
        expect(moment(oneMinute), 'to equal', moment(oneMinute + oneMinute), 'in years');

        var oneHour = moment.duration(1, 'hour').valueOf();
        expect(moment(oneHour), 'not to equal', moment(oneHour + oneHour), 'in milliseconds');
        expect(moment(oneHour), 'not to equal', moment(oneHour + oneHour), 'in seconds');
        expect(moment(oneHour), 'not to equal', moment(oneHour + oneHour), 'in minutes');
        expect(moment(oneHour), 'not to equal', moment(oneHour + oneHour), 'in hours');
        expect(moment(oneHour), 'to equal', moment(oneHour + oneHour), 'in days');
        expect(moment(oneHour), 'to equal', moment(oneHour + oneHour), 'in weeks');
        expect(moment(oneHour), 'to equal', moment(oneHour + oneHour), 'in months');
        expect(moment(oneHour), 'to equal', moment(oneHour + oneHour), 'in years');

        var oneDay = moment.duration(1, 'day').valueOf();
        expect(moment(oneDay), 'not to equal', moment(oneDay + oneDay), 'in milliseconds');
        expect(moment(oneDay), 'not to equal', moment(oneDay + oneDay), 'in seconds');
        expect(moment(oneDay), 'not to equal', moment(oneDay + oneDay), 'in minutes');
        expect(moment(oneDay), 'not to equal', moment(oneDay + oneDay), 'in hours');
        expect(moment(oneDay), 'not to equal', moment(oneDay + oneDay), 'in days');
        expect(moment(oneDay), 'to equal', moment(oneDay + oneDay), 'in weeks');
        expect(moment(oneDay), 'to equal', moment(oneDay + oneDay), 'in months');
        expect(moment(oneDay), 'to equal', moment(oneDay + oneDay), 'in years');

        var oneWeek = moment.duration(1, 'week').valueOf();
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in milliseconds');
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in seconds');
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in minutes');
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in hours');
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in days');
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in weeks');
        expect(moment(oneWeek), 'to equal', moment(oneWeek + oneWeek), 'in months');
        expect(moment(oneWeek), 'to equal', moment(oneWeek + oneWeek), 'in years');

        var oneMonth = moment.duration(1, 'month').valueOf();
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in milliseconds');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in seconds');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in minutes');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in hours');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in days');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in weeks');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in months');
        expect(moment(oneMonth), 'to equal', moment(oneMonth + oneMonth), 'in years');

        var oneYear = moment.duration(1, 'year').valueOf();
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in milliseconds');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in seconds');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in minutes');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in hours');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in days');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in weeks');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in months');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in years');
    });
});

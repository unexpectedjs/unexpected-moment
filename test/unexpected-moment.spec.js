var sinon = require('sinon'),
    moment = require('moment-timezone'),
    unexpected = require('unexpected'),
    unexpectedMoment = require('../lib/unexpected-moment');

describe('unexpected-moment', function () {
    var expect = unexpected.clone()
        .use(unexpectedMoment);

    var clock;
    var oneSecond;
    var oneMinute;
    var oneHour;
    var oneDay;
    var oneWeek;
    var oneMonth;
    var oneYear;

    before(function () {
        clock = sinon.useFakeTimers();

        moment.tz.add('Europe/Copenhagen|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2azC0 Tz0 VuO0 60q0 WM0 1fA0 1cM0 1cM0 1cM0 S00 1HA0 Nc0 1C00 Dc0 1Nc0 Ao0 1h5A0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00');
        moment.tz.setDefault('Europe/Copenhagen');

        oneSecond = moment.duration(1, 'second').valueOf();
        oneMinute = moment.duration(1, 'minute').valueOf();
        oneHour = moment.duration(1, 'hour').valueOf();
        oneDay = moment.duration(1, 'day').valueOf();
        oneWeek = moment.duration(1, 'week').valueOf();
        oneMonth = moment.duration(1, 'month').valueOf();
        oneYear = moment.duration(1, 'year').valueOf();
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

    it('identifies strict equality in moments', function () {
        expect(moment(0), 'to equal', moment(0));
        expect(moment(0), 'not to equal', new Date(0));
    });

    it('identifies a moment that occurs before another chronologically', function () {
        expect(moment(0), 'to be before', moment(1));
        expect(moment(0), 'to be before', moment(1).toISOString());
        expect(moment(0), 'to be before', moment(1).toArray());
        expect(moment(0), 'to be before', moment(1).toDate());
        expect(moment(0), 'to be before', moment(1).valueOf());
        expect(moment(0), 'to be before', moment(1).toObject());


        expect(moment(1), 'not to be before', moment(0));
        expect(moment(1), 'not to be before', moment(0).toISOString());
        expect(moment(1), 'not to be before', moment(0).toArray());
        expect(moment(1), 'not to be before', moment(0).toDate());
        expect(moment(1), 'not to be before', moment(0).valueOf());
        expect(moment(1), 'not to be before', moment(0).toObject());
    });

    it('identifies a moment that occurs after another chronologically', function () {
        expect(moment(1), 'to be after', moment(0));
        expect(moment(1), 'to be after', moment(0).toISOString());
        expect(moment(1), 'to be after', moment(0).toArray());
        expect(moment(1), 'to be after', moment(0).toDate());
        expect(moment(1), 'to be after', moment(0).valueOf());
        expect(moment(1), 'to be after', moment(0).toObject());

        expect(moment(0), 'not to be after', moment(1));
        expect(moment(0), 'not to be after', moment(1).toISOString());
        expect(moment(0), 'not to be after', moment(1).toArray());
        expect(moment(0), 'not to be after', moment(1).toDate());
        expect(moment(0), 'not to be after', moment(1).valueOf());
        expect(moment(0), 'not to be after', moment(1).toObject());
    });

    it('identifies a moment that occurs at same time or before another chronologically', function () {
        expect(moment(0), 'to be same or before', moment(1));
        expect(moment(0), 'to be same or before', moment(1).toISOString());
        expect(moment(0), 'to be same or before', moment(1).toArray());
        expect(moment(0), 'to be same or before', moment(1).toDate());
        expect(moment(0), 'to be same or before', moment(1).valueOf());
        expect(moment(0), 'to be same or before', moment(1).toObject());

        expect(moment(1), 'not to be same or before', moment(0));
        expect(moment(1), 'not to be same or before', moment(0).toISOString());
        expect(moment(1), 'not to be same or before', moment(0).toArray());
        expect(moment(1), 'not to be same or before', moment(0).toDate());
        expect(moment(1), 'not to be same or before', moment(0).valueOf());
        expect(moment(1), 'not to be same or before', moment(0).toObject());

        expect(moment(0), 'to be same or before', moment(0));
        expect(moment(0), 'to be same or before', moment(0).toISOString());
        expect(moment(0), 'to be same or before', moment(0).toArray());
        expect(moment(0), 'to be same or before', moment(0).toDate());
        expect(moment(0), 'to be same or before', moment(0).valueOf());
        expect(moment(0), 'to be same or before', moment(0).toObject());

        expect(moment(1), 'not to be same or before', moment(0));
        expect(moment(1), 'not to be same or before', moment(0).toISOString());
        expect(moment(1), 'not to be same or before', moment(0).toArray());
        expect(moment(1), 'not to be same or before', moment(0).toDate());
        expect(moment(1), 'not to be same or before', moment(0).valueOf());
        expect(moment(1), 'not to be same or before', moment(0).toObject());
    });

    it('identifies a moment that occurs at same time or after chronologically', function () {
        expect(moment(1), 'to be same or after', moment(0));
        expect(moment(1), 'to be same or after', moment(0).toISOString());
        expect(moment(1), 'to be same or after', moment(0).toArray());
        expect(moment(1), 'to be same or after', moment(0).toDate());
        expect(moment(1), 'to be same or after', moment(0).valueOf());
        expect(moment(1), 'to be same or after', moment(0).toObject());

        expect(moment(0), 'not to be same or after', moment(1));
        expect(moment(0), 'not to be same or after', moment(1).toISOString());
        expect(moment(0), 'not to be same or after', moment(1).toArray());
        expect(moment(0), 'not to be same or after', moment(1).toDate());
        expect(moment(0), 'not to be same or after', moment(1).valueOf());
        expect(moment(0), 'not to be same or after', moment(1).toObject());

        expect(moment(0), 'to be same or after', moment(0));
        expect(moment(0), 'to be same or after', moment(0).toISOString());
        expect(moment(0), 'to be same or after', moment(0).toArray());
        expect(moment(0), 'to be same or after', moment(0).toDate());
        expect(moment(0), 'to be same or after', moment(0).valueOf());
        expect(moment(0), 'to be same or after', moment(0).toObject());
    });

    it('identifies moments between other moments', function () {
        expect(moment(0), 'to be between', moment(0), moment(0));

        expect(moment(0), 'to be between', moment(0), moment(2));
        expect(moment(1), 'to be between', moment(0), moment(2));
        expect(moment(2), 'to be between', moment(0), moment(2));

        expect(moment(1), 'not to be between', moment(0), moment(0));
        expect(moment(1), 'not to be between', moment(2), moment(2));
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

        expect(moment(oneSecond), 'not to equal', moment(oneSecond + oneSecond), 'in milliseconds');
        expect(moment(oneSecond), 'not to equal', moment(oneSecond + oneSecond), 'in seconds');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in minutes');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in hours');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in days');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in weeks');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in months');
        expect(moment(oneSecond), 'to equal', moment(oneSecond + oneSecond), 'in years');

        expect(moment(oneMinute), 'not to equal', moment(oneMinute + oneMinute), 'in milliseconds');
        expect(moment(oneMinute), 'not to equal', moment(oneMinute + oneMinute), 'in seconds');
        expect(moment(oneMinute), 'not to equal', moment(oneMinute + oneMinute), 'in minutes');
        expect(moment(oneMinute), 'to equal', moment(oneMinute + oneMinute), 'in hours');
        expect(moment(oneMinute), 'to equal', moment(oneMinute + oneMinute), 'in days');
        expect(moment(oneMinute), 'to equal', moment(oneMinute + oneMinute), 'in weeks');
        expect(moment(oneMinute), 'to equal', moment(oneMinute + oneMinute), 'in months');
        expect(moment(oneMinute), 'to equal', moment(oneMinute + oneMinute), 'in years');

        expect(moment(oneHour), 'not to equal', moment(oneHour + oneHour), 'in milliseconds');
        expect(moment(oneHour), 'not to equal', moment(oneHour + oneHour), 'in seconds');
        expect(moment(oneHour), 'not to equal', moment(oneHour + oneHour), 'in minutes');
        expect(moment(oneHour), 'not to equal', moment(oneHour + oneHour), 'in hours');
        expect(moment(oneHour), 'to equal', moment(oneHour + oneHour), 'in days');
        expect(moment(oneHour), 'to equal', moment(oneHour + oneHour), 'in weeks');
        expect(moment(oneHour), 'to equal', moment(oneHour + oneHour), 'in months');
        expect(moment(oneHour), 'to equal', moment(oneHour + oneHour), 'in years');

        expect(moment(oneDay), 'not to equal', moment(oneDay + oneDay), 'in milliseconds');
        expect(moment(oneDay), 'not to equal', moment(oneDay + oneDay), 'in seconds');
        expect(moment(oneDay), 'not to equal', moment(oneDay + oneDay), 'in minutes');
        expect(moment(oneDay), 'not to equal', moment(oneDay + oneDay), 'in hours');
        expect(moment(oneDay), 'not to equal', moment(oneDay + oneDay), 'in days');
        expect(moment(oneDay), 'to equal', moment(oneDay + oneDay), 'in weeks');
        expect(moment(oneDay), 'to equal', moment(oneDay + oneDay), 'in months');
        expect(moment(oneDay), 'to equal', moment(oneDay + oneDay), 'in years');

        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in milliseconds');
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in seconds');
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in minutes');
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in hours');
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in days');
        expect(moment(oneWeek), 'not to equal', moment(oneWeek + oneWeek), 'in weeks');
        expect(moment(oneWeek), 'to equal', moment(oneWeek + oneWeek), 'in months');
        expect(moment(oneWeek), 'to equal', moment(oneWeek + oneWeek), 'in years');

        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in milliseconds');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in seconds');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in minutes');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in hours');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in days');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in weeks');
        expect(moment(oneMonth), 'not to equal', moment(oneMonth + oneMonth), 'in months');
        expect(moment(oneMonth), 'to equal', moment(oneMonth + oneMonth), 'in years');

        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in milliseconds');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in seconds');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in minutes');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in hours');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in days');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in weeks');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in months');
        expect(moment(oneYear), 'not to equal', moment(oneYear + oneYear), 'in years');
    });

    it('identifies if a moment is the start of a unit of time', function () {
        expect(moment(123456).startOf('second'), 'to be the start of second');
        expect(moment(123456).startOf('minute'), 'to be the start of minute');
        expect(moment(123456).startOf('hour'), 'to be the start of hour');
        expect(moment(123456).startOf('day'), 'to be the start of day');
        expect(moment(123456).startOf('week'), 'to be the start of week');
        expect(moment(123456).startOf('isoWeek'), 'to be the start of isoWeek');
        expect(moment(123456).startOf('month'), 'to be the start of month');
        expect(moment(123456).startOf('quarter'), 'to be the start of quarter');
        expect(moment(123456).startOf('year'), 'to be the start of year');

        expect(moment(123456).startOf('second').add(1), 'not to be the start of second');
        expect(moment(123456).startOf('minute').add(1, 'second'), 'not to be the start of minute');
        expect(moment(123456).startOf('hour').add(1, 'second'), 'not to be the start of hour');
        expect(moment(123456).startOf('day').add(1, 'second'), 'not to be the start of day');
        expect(moment(123456).startOf('week').add(1, 'second'), 'not to be the start of week');
        expect(moment(123456).startOf('isoWeek').add(1, 'second'), 'not to be the start of isoWeek');
        expect(moment(123456).startOf('month').add(1, 'second'), 'not to be the start of month');
        expect(moment(123456).startOf('quarter').add(1, 'second'), 'not to be the start of quarter');
        expect(moment(123456).startOf('year').add(1, 'second'), 'not to be the start of year');
    });

    it('identifies if a moment is the end of a unit of time', function () {
        expect(moment(123456).endOf('second'), 'to be the end of second');
        expect(moment(123456).endOf('minute'), 'to be the end of minute');
        expect(moment(123456).endOf('hour'), 'to be the end of hour');
        expect(moment(123456).endOf('day'), 'to be the end of day');
        expect(moment(123456).endOf('week'), 'to be the end of week');
        expect(moment(123456).endOf('isoWeek'), 'to be the end of isoWeek');
        expect(moment(123456).endOf('month'), 'to be the end of month');
        expect(moment(123456).endOf('quarter'), 'to be the end of quarter');
        expect(moment(123456).endOf('year'), 'to be the end of year');

        expect(moment(123456).endOf('second').subtract(1), 'not to be the end of second');
        expect(moment(123456).endOf('minute').subtract(1, 'second'), 'not to be the end of minute');
        expect(moment(123456).endOf('hour').subtract(1, 'second'), 'not to be the end of hour');
        expect(moment(123456).endOf('day').subtract(1, 'second'), 'not to be the end of day');
        expect(moment(123456).endOf('week').subtract(1, 'second'), 'not to be the end of week');
        expect(moment(123456).endOf('isoWeek').subtract(1, 'second'), 'not to be the end of isoWeek');
        expect(moment(123456).endOf('month').subtract(1, 'second'), 'not to be the end of month');
        expect(moment(123456).endOf('quarter').subtract(1, 'second'), 'not to be the end of quarter');
        expect(moment(123456).endOf('year').subtract(1, 'second'), 'not to be the end of year');
    });

    it('identifies satisfaction and dissatisfaction in moments', function () {
    // it('identifies satisfying and disatisfying moments/dates', function () {
        var aMoment = moment('2015-01-01T00:00:00+01:00');
        var aUtcMoment = moment.utc('2015-01-01T00:00:00+00:00');

        expect(aMoment, 'to satisfy', aMoment.clone());
        expect(aMoment, 'not to satisfy', aMoment.clone().add(1));

        expect(moment(1000), 'to satisfy', moment(1000));
        expect(moment(1000), 'not to satisfy', moment(2000));

        expect(aMoment, 'to satisfy', aMoment.toDate());
        expect(aMoment, 'not to equal', aMoment.toDate());

        expect(aUtcMoment, 'to satisfy', new Date('Thu Jan 01 2015 01:00:00 GMT+0100 (CET)'));
        expect(aUtcMoment, 'not to equal', new Date('Thu Jan 01 2015 01:00:00 GMT+0100 (CET)'));

        expect(aMoment, 'to satisfy', aMoment.toArray());
        expect(aMoment, 'not to equal', aMoment.toArray());
        expect(aMoment, 'not to satisfy', [1, 2, 3, 4, 5, 6, 7, 8]);

        expect(aUtcMoment, 'not to satisfy', [2015, 0, 1, 0, 0, 0, 0]); // see: https://github.com/moment/moment/issues/2633
        expect(aUtcMoment, 'not to equal', [2015, 0, 1, 0, 0, 0, 0]);


        expect(aMoment, 'to satisfy', aMoment.toISOString());
        expect(aMoment, 'to satisfy', aMoment.format());

        expect(aMoment, 'to satisfy', aMoment.toJSON());
        expect(aMoment, 'not to equal', aMoment.toJSON());

        expect(aUtcMoment, 'to satisfy', '2015-01-01T00:00:00.000Z');
        expect(aUtcMoment, 'to satisfy', '2015-01-01T00:00:00+00:00');
        expect(aUtcMoment, 'not to equal', '2015-01-01T00:00:00.000Z');

        expect(aMoment, 'to satisfy', aMoment.toObject());
        expect(aMoment, 'not to equal', aMoment.toObject());

        expect(aUtcMoment, 'not to satisfy', aUtcMoment.toObject()); // see: https://github.com/moment/moment/issues/2633

        // partial object passes
        expect(aMoment, 'to satisfy', {
            years: 2015,
            date: 1,
            seconds: 0
        });

        // but not an empty one
        expect(aMoment, 'not to satisfy', {});

        // TODO: nor one with unkown keys
        // expect(aUtcMoment, 'not to satisfy', {
        //     years: 2015,
        //     mints: 0
        // });
    });

    it('does not mutate the moment objects when checking for equality', function () {
        var moment1 = moment(1000);
        var moment2 = moment(123456);
        var moment1Formartted = moment1.format();
        var moment2Formartted = moment2.format();
        expect(moment1, 'not to equal', moment2);
        expect(moment1Formartted, 'to equal', moment1.format());
        expect(moment2Formartted, 'to equal', moment2.format());
    });

    it('does not mutate the moment objects when checking for satisfaction', function () {
        var moment1 = moment(1000);
        var moment2 = moment(123456);
        var moment1Formartted = moment1.format();
        var moment2Formartted = moment2.format();
        expect(moment1, 'not to satisfy', moment2);
        expect(moment1Formartted, 'to equal', moment1.format());
        expect(moment2Formartted, 'to equal', moment2.format());
    });

    it('does not mutate the moment objects when checking for equality at various granularity levels', function () {
        var moment1 = moment(1000);
        var moment2 = moment(1500);
        var moment1Formartted = moment1.format();
        var moment2Formartted = moment2.format();
        expect(moment1, 'to equal', moment2, 'in seconds');
        expect(moment1Formartted, 'to equal', moment1.format());
        expect(moment2Formartted, 'to equal', moment2.format());
    });

    it('does not mutate the moment objects when checking for equality against a certain format', function () {
        var moment1 = moment(1000);
        var moment1Formartted = moment1.format();
        expect(moment1, 'when formatted with', 'YYYYMMDD', 'to equal', '19700101');
        expect(moment1Formartted, 'to equal', moment1.format());
    });

    it('does not mutate the moment objects when checking for equality against the start of a unit of time', function () {
        var moment1 = moment(1000).startOf('isoWeek');
        var moment1Formartted = moment1.format();
        expect(moment1, 'to be the start of isoWeek');
        expect(moment1Formartted, 'to equal', moment1.format());
    });

    it('does not mutate the moment objects when checking for equality against the end of a unit of time', function () {
        var moment1 = moment(1000);
        var moment1Formartted = moment1.format();
        expect(moment1, 'not to be the end of day');
        expect(moment1Formartted, 'to equal', moment1.format());
    });
});

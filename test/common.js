/*global unexpected:true, moment:true*/
moment = require('moment-timezone');
moment.tz.setDefault('Europe/Copenhagen');

unexpected = require('unexpected').clone();
unexpected.use(require('../lib/unexpected-moment'));

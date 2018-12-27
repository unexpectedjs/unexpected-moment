/*global unexpected:true, moment:true*/
unexpected = require('unexpected').clone();
unexpected.output.preferredWidth = 80;
unexpected.use(require('./lib/unexpected-moment'));

moment = require('moment-timezone');
moment.tz.setDefault('Europe/Copenhagen');

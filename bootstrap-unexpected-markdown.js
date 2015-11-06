/*global unexpected:true, moment:true*/
unexpected = require('unexpected');
unexpected.output.preferredWidth = 80;
moment = require('moment-timezone');
unexpected.installPlugin(require('./lib/unexpected-moment'));

---
template: default.ejs
theme: dark
title: unexpected-moment
repository: https://github.com/joelmukuthu/unexpected-moment
---

# Unexpected-moment

![Unexpected moment :)](unexpectedMoment.jpg)

This module extends the
[Unexpected](https://github.com/unexpectedjs/unexpected) assertion
library with integration for the [moment.js](http://momentjs.com/)
library.

```js
var date = moment('2015-11-06');
expect(date, 'to equal', moment('2015-11-06 00:00:00'));
expect(date, 'to equal', moment('2015-11-03'));
```

```output
expected moment(2015-11-06T00:00:00.000+01:00)
to equal moment(2015-11-03T00:00:00.000+01:00)

-2015-11-06T00:00:00.000+01:00
+2015-11-03T00:00:00.000+01:00
```

[![NPM version](https://badge.fury.io/js/unexpected-moment.svg)](http://badge.fury.io/js/unexpected-moment)
[![Build Status](https://travis-ci.org/joelmukuthu/unexpected-moment.svg?branch=master)](https://travis-ci.org/joelmukuthu/unexpected-moment)
[![Coverage Status](https://coveralls.io/repos/joelmukuthu/unexpected-moment/badge.svg)](https://coveralls.io/r/joelmukuthu/unexpected-moment)
[![Dependency Status](https://david-dm.org/joelmukuthu/unexpected-moment.svg)](https://david-dm.org/joelmukuthu/unexpected-moment)

## How to use

### Node

Install it with NPM or add it to your `package.json`:

```
$ npm install unexpected unexpected-moment
```

Then:

```js#evaluate:false
var expect = require('unexpected').clone();
expect.use(require('unexpected-moment'));
```

### Browser

Include the `unexpected.js` found at the lib directory of this
repository.

```html
<script src="moment.js"></script>
<script src="unexpected.js"></script>
<script src="unexpected-moment.js"></script>
```

this will expose the expect function under the following namespace:

```js#evaluate:false
var expect = weknowhow.expect.clone();
expect.use(moment.unexpectedMoment);
```

### RequireJS

Include the library with RequireJS the following way:

```js#evaluate:false
define(['unexpected', 'unexpected-moment'], funtion (unexpected, unexpectedMoment) {
   var expect = unexpected.clone();
   expect.use(unexpectedMoment);
   // Your code
});
```

## MIT License

Copyright (c) 2015 Joel Mukuthu

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

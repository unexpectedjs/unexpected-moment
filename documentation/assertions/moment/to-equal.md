Passes if one moment instance represents the same time as another moment instance.

```js
var date = moment();
expect(date, 'to equal', date.clone());
expect(moment(), 'not to equal', moment().add(1, 'millisecond'));
```

It supports all the granularity levels that are supported by moment.js:

```js
var date = moment();
expect(date, 'to equal', date.clone(), 'in milliseconds');
expect(date, 'to equal', date.clone(), 'in seconds');
expect(date, 'to equal', date.clone(), 'in minutes');
expect(date, 'to equal', date.clone(), 'in hours');
expect(date, 'to equal', date.clone(), 'in days');
expect(date, 'to equal', date.clone(), 'in weeks');
expect(date, 'to equal', date.clone(), 'in months');
expect(date, 'to equal', date.clone(), 'in years');
```

When the assertion fails you'll get this output:

```js
expect(moment('2015-11-01'), 'to equal', moment('2015-11-02'), 'in days');
```

```output
expected moment(2015-11-01T00:00:00.000+01:00)
to equal moment(2015-11-02T00:00:00.000+01:00) in days

-2015-11-01T00:00:00.000+01:00
+2015-11-02T00:00:00.000+01:00
```

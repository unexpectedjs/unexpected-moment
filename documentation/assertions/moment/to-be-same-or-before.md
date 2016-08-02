Passes if the moment instance represents a time at or before the specified time.

```js
expect(moment(), 'to be same or before', moment().add(1, 'hour'));
```

It supports any value supported by [moment#isAfter](http://momentjs.com/docs/#/query/is-after/)

When the assertion fails you'll get this output:

```js
expect(moment('2015-04-01'), 'to be same or before', moment('2015-01-01'));
```

```output
expected moment('2015-04-01T00:00:00.000+02:00')
to be same or before moment('2015-01-01T00:00:00.000+01:00')
```

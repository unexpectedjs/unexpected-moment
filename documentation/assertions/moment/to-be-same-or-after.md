Passes if the moment instance represents a time at or later than the specified time.

```js
expect(moment(), 'to be same or after', moment().subtract(1, 'hour'));
```

It supports any value supported by [moment#isAfter](http://momentjs.com/docs/#/query/is-after/)

When the assertion fails you'll get this output:

```js
expect(moment('2015-02-03'), 'to be same or after', moment('2015-04-03'));
```

```output
expected moment('2015-02-03T00:00:00.000+01:00')
to be same or after moment('2015-04-03T00:00:00.000+02:00')
```

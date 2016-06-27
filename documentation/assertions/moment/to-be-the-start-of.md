Passes if the moment instance represents the start of a unit of time.

```js
expect(moment('2015-01-01'), 'to be the start of year');
```

It supports start-of-time units that are supported by [moment#startOf](http://momentjs.com/docs/#/manipulating/start-of/).

When the assertion fails you'll get this output:

```js
expect(moment('2015-01-01 01'), 'to be the start of year');
```

```output
expected moment('2015-01-01T01:00:00.000+01:00') to be the start of year

-moment('2015-01-01T01:00:00.000+01:00')
+moment('2015-01-01T00:00:00.000+01:00')
```

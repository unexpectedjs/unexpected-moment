Passes if the moment instance represents the end of a unit of time.

```js
expect(moment('2015-01-01 23:59:59.999'), 'to be the end of day');
```

It supports end-of-time units that are supported by [moment#endOf](http://momentjs.com/docs/#/manipulating/end-of/).

When the assertion fails you'll get this output:

```js
expect(moment('2015-01-01 00:00:00'), 'to be the end of day');
```

```output
expected moment('2015-01-01T00:00:00.000+01:00') to be the end of day

-moment('2015-01-01T00:00:00.000+01:00')
+moment('2015-01-01T23:59:59.999+01:00')
```

Format a moment instance using [any supported format](http://momentjs.com/docs/#/displaying/format/), then delegate the formatted value to another assertion.

```js
expect(moment('2015-11-02'), 'when formatted with', 'YYYYMMDD', 'to be', '20151102');
```

When the assertion fails you'll get this output:

```js
expect(moment('2015-11-02'), 'when formatted with', 'YYYYMMDD', 'to be', '2015');
```

```output
expected moment('2015-11-02T00:00:00.000+01:00')
when formatted with 'YYYYMMDD' to be '2015'

-20151102
+2015
```

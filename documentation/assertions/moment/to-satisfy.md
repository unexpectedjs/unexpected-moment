Passes if one moment instance represents the same time as another time instance.

```js
var date = moment();
expect(moment('2015-11-01'), 'to satisfy', '2015-11-01');
```

Unlike [to-equal](), you can check against any object that represents an instance of time, as supported by [moment#isSame](http://momentjs.com/docs/#/query/is-same/):

```js
expect(moment('2015-11-01'), 'to satisfy', { year: 2015, month: 10, day: 1 });
```

When the assertion fails you'll get this output:

```js
expect(moment('2015-11-01'), 'to satisfy', { year: 2015, month: 11, day: 1 });
```

```output
expected moment(2015-11-01T00:00:00.000+01:00)
to satisfy { year: 2015, month: 11, day: 1 }
```

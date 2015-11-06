Passes if the moment instance represents a time earlier than the specified time.

```js
expect(moment(), 'to be before', moment().add(1, 'hour'));
```

It supports any value supported by [moment#isBefore](http://momentjs.com/docs/#/query/is-before/)

When the assertion fails you'll get this output:

```js
expect(moment('2015-04-03'), 'to be before', moment('2015-02-03'));
```

```output
expected moment(2015-04-03T00:00:00.000+02:00)
to be before moment(2015-02-03T00:00:00.000+01:00)
```

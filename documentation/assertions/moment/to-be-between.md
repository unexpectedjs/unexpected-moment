Passes if the moment instance is between two other given instances, both extremes included.

```js
expect(moment(), 'to be between', moment().startOf('day'), moment().endOf('day'))
```

```js
expect(moment('2015-01-01'), 'to be between', moment('2015-02-01'), moment('2015-03-01'));
```

```output
expected moment(2015-01-01T00:00:00.000+01:00)
to be between moment(2015-02-01T00:00:00.000+01:00) and moment(2015-03-01T00:00:00.000+01:00)
```

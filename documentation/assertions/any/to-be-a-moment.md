Passes if the subject is a moment instance.

```js
expect(moment(), 'to be a moment');
expect(new Date(), 'not to be a moment');
```

When the assertion fails you'll get this output:

```js
expect(new Date('2015-01-01'), 'to be a moment');
```

```output
expected new Date('Thu Jan 01 2015 01:00:00 GMT+0100 (CET)') to be a moment
```

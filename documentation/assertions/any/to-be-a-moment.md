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
expected new Date('2015-01-01T00:00:00Z') to be a moment
```

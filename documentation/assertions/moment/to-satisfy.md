Passes if one moment instance represents the same time as another time instance.

```js
var date = moment();
expect(moment('2015-11-01'), 'to satisfy', '2015-11-01');
```

Unlike [to-equal](), you can check against any object that represents an instance
of time, as supported by [moment#isSame](http://momentjs.com/docs/#/query/is-same/):

```js
expect(moment('2015-11-01'), 'to satisfy', { year: 2015, month: 10, day: 1 });
```

When the assertion fails you'll get this output:

```js
expect(moment('2015-11-01'), 'to satisfy', { year: 2015, month: 11, day: 1 });
```

```output
expected moment('2015-11-01T00:00:00.000+01:00')
to satisfy { year: 2015, month: 11, day: 1 }

moment(
  {
    years: 2015,
    months: 10, // should equal 11
    date: 1
  }
)
```

## Variations with `moment#isSame`

There are some subtle differences with
[moment#isSame](http://momentjs.com/docs/#/query/is-same/) that you should be
aware of:

- Empty arrays are not deemed as valid values
- Empty objects are not deemed as valid values
- Objects with invalid units are also deemed as invalid

```js
expect(function () {
    expect(moment(), 'to satisfy', []);
}, 'to error'); // even though moment().isSame([]) === true
expect(function () {
    expect(moment(), 'to satisfy', {});
}, 'to error'); // even though moment().isSame({}) === true
```

```js
var theMoment = moment('2016-08-03');
var theObject = { year: 2016, month: 7, date: 3, minyte: 4, second: 0, millisecond: 0 };
// this fails even though theMoment.isSame(theObject) === true
expect(theMoment, 'to satisfy', theObject);
```

```output
expected moment('2016-08-03T00:00:00.000+02:00')
to satisfy { year: 2016, month: 7, date: 3, minyte: 4, second: 0, millisecond: 0 }

{
  year: 2016,
  month: 7,
  date: 3,
  minyte: 4, // not a valid unit
  second: 0,
  millisecond: 0
}
```

This is aimed at giving you more confidence in your tests.

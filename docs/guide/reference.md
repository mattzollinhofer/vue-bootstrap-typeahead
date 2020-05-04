# Reference

## Props

| Name | type | Default | Description |
| ---- |:----:| ------------- | ---- |
| data | Array | | Array of data to be available for querying. **Required**|
| serializer | Function | `input => input`| Function used to convert the entries in the data array into a text string. |
| size | String | | Size of the `input-group`. Valid values: `sm` or `lg` |
backgroundVariant | String | | Background color for the autocomplete result `list-group` items. [See values here.][1]
textVariant | String | | Text color for autocomplete result `list-group` items. [See values here.][2]
inputClass | String | | Class to be added to the `input` tag for validation, etc.
maxMatches | Number | 10 | Maximum amount of list items to appear.
minMatchingChars | Number | 2 | Minimum matching characters in query before the typeahead list appears
prepend | String | | Text to be prepended to the `input-group`
append | String | | Text to be appended to the `input-group`
autoClose | `Boolean` | true | Whether the autocomplete should hide upon item selection
highlightClass | `String` | `vbt-matched-text` | CSS class to style highlighted text

## Events

Name | Description
| --- | --- |
hit | Triggered when an autocomplete item is selected. The entry in the input data array that was selected is returned.
input | The component can be used with `v-model`

## Slots

There are `prepend` and `append` slots available for adding buttons or other markup. Overrides the prepend and append props.

### Scoped Slot

You can use a [scoped slot][3] called `suggestion` to define custom content for the suggestion `list-item`'s. You can use bound variables `data`, which holds the data from the input array, and `htmlText`, which is the highlighted text that is used for the suggestion.

See the [custom suggestion slot example][4] for more info.

[1]: https://getbootstrap.com/docs/4.1/utilities/colors/#background-color
[2]: https://getbootstrap.com/docs/4.1/utilities/colors/#color
[3]: https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots
[4]: #

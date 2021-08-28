<template>
  <div
    :id="`typeahead-${id}`"
    role="combobox"
    aria-haspopup="listbox"
    :aria-owns="`result-list-${id}`"
    :aria-expanded="(isFocused && data.length > 0) ? 'true' : 'false'"
  >
    <div :class="inputGroupClasses">
      <div ref="prependDiv" v-if="$slots.prepend || prepend" class="input-group-prepend">
        <slot name="prepend">
          <span class="input-group-text">{{ prepend }}</span>
        </slot>
      </div>
      <input
        ref="input"
        :id="`typeahead-input-${id}`"
        type="text"
        role="searchbox"
        :class="`form-control ${inputClass}`"
        :aria-labelledby="ariaLabelledBy"
        aria-multiline="false"
        aria-autocomplete="list"
        :aria-controls="`result-list-${id}`"
        :aria-activedescendant="`selected-option-${id}`"
        :name="inputName"
        :placeholder="placeholder"
        :aria-label="(!ariaLabelledBy) ? placeholder : false"
        :value="inputValue"
        :disabled="disabled"
        @focus="isFocused = true"
        @blur="handleFocusOut"
        @input="handleInput($event.target.value)"
        @keydown.esc="handleEsc($event.target.value)"
        @keyup="$emit('keyup', $event)"
      />
      <div v-if="$slots.append || append" class="input-group-append">
        <slot name="append">
          <span class="input-group-text">{{ append }}</span>
        </slot>
      </div>
    </div>
    <vue-typeahead-bootstrap-list
      :id="`result-list-${id}`"
      class="vbt-autcomplete-list"
      ref="list"
      v-show="isFocused && data.length > 0"
      :query="inputValue"
      :data="formattedData"
      :background-variant="backgroundVariant"
      :background-variant-resolver="backgroundVariantResolver"
      :text-variant="textVariant"
      :maxMatches="maxMatches"
      :minMatchingChars="minMatchingChars"
      :disableSort="disableSort"
      :showOnFocus="showOnFocus"
      :showAllResults="showAllResults"
      @hit="handleHit"
      @listItemBlur="handleChildBlur"
      :highlightClass='highlightClass'
      :disabledValues="disabledValues"
      :vbtUniqueId="id"
      role="listbox"
    >
      <!-- pass down all scoped slots -->
      <template v-for="(slot, slotName) in $scopedSlots" :slot="slotName" slot-scope="{ data, htmlText }">
        <slot :name="slotName" v-bind="{ data, htmlText }"></slot>
      </template>
      <!-- below is the right solution, however if the user does not provide a scoped slot, vue will still set $scopedSlots.suggestion to a blank scope
      <template v-if="$scopedSlots.suggestion" slot="suggestion" slot-scope="{ data, htmlText }">
        <slot name="suggestion" v-bind="{ data, htmlText }" />
      </template>-->
    </vue-typeahead-bootstrap-list>
  </div>
</template>

<script>
import VueTypeaheadBootstrapList from './VueTypeaheadBootstrapList.vue'
import ResizeObserver from 'resize-observer-polyfill'

export default {
  name: 'VueTypeaheadBootstrap',

  components: {
    VueTypeaheadBootstrapList
  },

  props: {
    ariaLabelledBy: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null,
      validator: size => ['lg', 'md', 'sm'].indexOf(size) > -1
    },
    value: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      required: true,
      validator: d => d instanceof Array
    },
    serializer: {
      type: Function,
      default: (d) => d,
      validator: d => d instanceof Function
    },
    // Don't call this method, use _screenReaderTextSerializer()
    // Using _screenReaderTextSerializer allows for defaulting based on .serializer
    screenReaderTextSerializer: {
      type: Function,
      validator: d => d instanceof Function
    },
    backgroundVariant: String,
    backgroundVariantResolver: {
      type: Function,
      default: (d) => d,
      validator: d => d instanceof Function
    },
    disabledValues: {
      type: Array,
      default: () => []
    },
    textVariant: String,
    inputClass: {
      type: String,
      default: ''
    },
    inputName: {
      type: String,
      default: undefined
    },
    maxMatches: {
      type: Number,
      default: 10
    },
    minMatchingChars: {
      type: Number,
      default: 2
    },
    disableSort: {
      type: Boolean,
      default: false
    },
    showOnFocus: {
      type: Boolean,
      default: false
    },
    showAllResults: {
      type: Boolean,
      default: false
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    ieCloseFix: {
      type: Boolean,
      default: true
    },
    placeholder: String,
    prepend: String,
    append: String,
    highlightClass: String
  },

  computed: {
    id() {
      return Math.floor(Math.random() * 100000)
    },
    inputGroupClasses() {
      return this.size ? `input-group input-group-${this.size}` : 'input-group'
    },

    formattedData() {
      if (!(this.data instanceof Array)) {
        return []
      }
      return this.data.map((d, i) => {
        return {
          id: i,
          data: d,
          screenReaderText: this._screenReaderTextSerializer(d),
          text: this.serializer(d)
        }
      })
    }
  },

  methods: {
    _screenReaderTextSerializer(d){
      if ( typeof d === "object" && !Array.isArray(d) && d !== null){
       if (this.screenReaderTextSerializer){
          return this.screenReaderTextSerializer(d)
        } else {
          return this.serializer(d)
        }
      } else {
        return d
      }
    },
    resizeList(el) {
      const rect = el.getBoundingClientRect()
      const listStyle = this.$refs.list.$el.style

      // Set the width of the list on resize
      listStyle.width = rect.width + 'px'

      // Set the margin when the prepend prop or slot is populated
      // (setting the "left" CSS property doesn't work)
      if (this.$refs.prependDiv) {
        const prependRect = this.$refs.prependDiv.getBoundingClientRect()
        listStyle.marginLeft = prependRect.width + 'px'
      }
    },

    handleHit(evt) {
      if (typeof this.value !== 'undefined') {
        this.$emit('input', evt.text)
      }

      this.inputValue = evt.text
      this.$emit('hit', evt.data)

      if (this.autoClose) {
        this.$refs.input.blur()
        this.isFocused = false
      }
    },

    handleChildBlur() {
      this.$refs.input.focus()
      this.isFocused = false
    },

    runFocusOut(tgt) {
      if (tgt && tgt.classList.contains('vbst-item')) {
        return
      }
      this.isFocused = false
    },

    handleFocusOut(evt) {
      this.$emit('blur', evt)

      const tgt = evt.relatedTarget
      if (!!navigator.userAgent.match(/Trident.*rv:11\./) && this.ieCloseFix) {
        setTimeout(() => { this.runFocusOut(tgt) }, 300)
      } else {
        this.runFocusOut(tgt)
      }
    },

    handleInput(newValue) {
      this.isFocused = true
      this.inputValue = newValue

      // If v-model is being used, emit an input event
      if (typeof this.value !== 'undefined') {
        this.$emit('input', newValue)
      }
    },

    handleEsc(inputValue) {
      if (inputValue === '') {
        this.$refs.input.blur()
        this.isFocused = false
      } else {
        this.inputValue = ''
      }
    }
  },

  data() {
    return {
      isFocused: false,
      inputValue: this.value || ''
    }
  },

  mounted() {
    this.$_ro = new ResizeObserver(e => {
      this.resizeList(this.$refs.input)
    })
    this.$_ro.observe(this.$refs.input)
    this.$_ro.observe(this.$refs.list.$el)
  },

  beforeDestroy() {
    this.$_ro.disconnect()
  },

  watch: {
    value: function(val) {
      this.inputValue = val
    }
  }
}
</script>

<style scoped>
  .vbt-autcomplete-list {
    padding-top: 5px;
    position: absolute;
    max-height: 350px;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    overflow-y: auto;
    z-index: 999;
  }
  .vbt-autcomplete-list >>> .vbt-matched-text{
    font-weight: bold;
  }
</style>

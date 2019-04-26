const template = `
  <div class="input-group">
    <label>
      <input
        :type="radio ? 'radio' : 'checkbox'"
        v-model="computedModel"
        v-bind="vBind"
        v-on="vOn"
        :class="inputClass"
        class="input-checkbox"
        @focus="focusEvent"
        @blur="blurEvent"
      />
      <span :class="labelClass">
        {{ label }}
        <slot></slot>
      </span>
    </label>
  </div>
`

import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({ template })
export class InputCheckbox extends Vue {
  @Prop({ type: [Boolean, String, Number] })
  value?: boolean | string | number

  @Prop({ type: String })
  label?: string

  @Prop({ type: String })
  labelClass?: string

  @Prop({ type: String })
  inputClass?: string

  @Prop({ type: Boolean })
  radio?: boolean

  get vBind() {
    return { ...this.$attrs }
  }

  get vOn() {
    const listeners = { ...this.$listeners }
    delete listeners.input
    return { ...listeners }
  }

  get computedModel() {
    return this.value || false
  }

  set computedModel(val: boolean | string | number) {
    this.updateValue(val)
  }

  updateValue(val: boolean | string | number) {
    this.$emit('input', val)
  }

  focusEvent() {
    this.$emit('focus')
  }

  blurEvent() {
    this.$emit('blur')
  }
}

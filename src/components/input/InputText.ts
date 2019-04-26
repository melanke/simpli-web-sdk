const template = `
  <div class="input-group" :class="{ required: !!required }">
    <label :for="\`input-text\${_uid}\`" class="input-label">
      {{ label }}
      <slot></slot>
    </label>
    
    <!--Mask input-->
    <the-mask :id="\`input-text\${_uid}\`"
              v-if="type === 'mask'"
              v-model="computedModel"
              v-bind="vBind"
              v-on="vOn"
              :class="innerClass"
              class="input-text"
              @focus.native="focusEvent"
              @blur.native="blurEvent"
              :key="1"/>

    <!--Currency input-->
    <money :id="\`input-text\${_uid}\`"
           v-else-if="type === 'currency'"
           v-model="computedModel"
           v-bind="vBind"
           v-on="vOn"
           :class="innerClass"
           class="input-text"
           @focus.native="focusEvent"
           @blur.native="blurEvent"
           :key="2"/>

    <!--Textarea input-->
    <textarea :id="\`input-text\${_uid}\`"
              v-else-if="type === 'textarea'"
              v-model="computedModel"
              v-bind="vBind"
              v-on="vOn"
              :class="innerClass"
              class="input-textarea"
              @focus="focusEvent"
              @blur="blurEvent"
              :key="3"/>

    <!--Text input-->
    <input :id="\`input-text\${_uid}\`"
           v-else
           :type="type"
           v-model="computedModel"
           v-bind="vBind"
           v-on="vOn"
           :class="innerClass"
           class="input-text"
           @focus="focusEvent"
           @blur="blurEvent"
           :key="4"/>

  </div>
`

import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { Dictionary, ClassType, InputType } from '../../interfaces'
import { MaskPresetConfig } from '../../app/config/MaskPresetConfig'
import { CnpjMaskPreset } from '../../app/preset/CnpjMaskPreset'
import { CpfCnpjMaskPreset } from '../../app/preset/CpfCnpjMaskPreset'
import { CpfMaskPreset } from '../../app/preset/CpfMaskPreset'
import { DateMaskPreset } from '../../app/preset/DateMaskPreset'
import { DatetimeMaskPreset } from '../../app/preset/DatetimeMaskPreset'
import { PhoneMaskPreset } from '../../app/preset/PhoneMaskPreset'
import { RgMaskPreset } from '../../app/preset/RgMaskPreset'
import { ZipcodeMaskPreset } from '../../app/preset/ZipcodeMaskPreset'

@Component({ template })
export class InputText extends Vue {
  @Prop({ type: [String, Number], default: null })
  value!: InputType

  @Prop({ type: String })
  label?: string

  @Prop({ type: String })
  type!: string

  @Prop({ type: Boolean })
  required?: boolean

  @Prop({ type: Boolean })
  selectall?: boolean

  @Prop({ type: String })
  inputClass?: string

  @Prop({ type: String })
  maskPreset?: string

  @Prop({ type: [String, Array] })
  mask?: string | string[]

  @Prop({ type: Boolean })
  masked?: boolean

  @Prop({ type: Object })
  tokens?: any

  preset: MaskPresetConfig = new class extends MaskPresetConfig {
    mask = []
  }()

  private static defaultPreset: Dictionary<ClassType<MaskPresetConfig>> = {
    date: DateMaskPreset,
    datetime: DatetimeMaskPreset,
    phone: PhoneMaskPreset,
    zipcode: ZipcodeMaskPreset,
    cpf: CpfMaskPreset,
    cnpj: CnpjMaskPreset,
    cpfCnpj: CpfCnpjMaskPreset,
    rg: RgMaskPreset,
  }

  static addPreset(name: string, maskPreset: ClassType<MaskPresetConfig>) {
    InputText.defaultPreset = { ...InputText.defaultPreset, ...{ [name]: maskPreset } }
  }

  @Watch('maskPreset', { immediate: true })
  maskPresetEvent(val: string | undefined) {
    if (val) {
      const constructor = InputText.defaultPreset[val]
      if (constructor) {
        this.preset = new constructor()
      }
    } else {
      this.preset = new class extends MaskPresetConfig {
        mask = []
      }()
    }
  }

  get attrs() {
    return { ...this.$attrs }
  }

  get listeners() {
    const listeners = { ...this.$listeners }
    delete listeners.input
    return listeners
  }

  get vBind() {
    const { type, attrs } = this

    let extra = {}

    if (type === 'mask' && this.mask) {
      const { mask, masked, tokens } = this
      extra = { mask, masked, tokens }
    }

    if (type === 'mask' && this.maskPreset) {
      const { mask, masked, tokens } = this.preset
      extra = { mask, masked, tokens }
    }

    return { ...attrs, ...extra }
  }

  get vOn() {
    const { listeners } = this
    return { ...listeners }
  }

  get innerClass() {
    const valid = this.preset.isValid === true ? 'valid' : ''
    const invalid = this.preset.isValid === false ? 'invalid' : ''
    return `${this.inputClass || ''} ${valid} ${invalid}`.trim() || ''
  }

  get computedModel(): InputType {
    if (this.maskPreset) {
      return this.preset.getterTransform(this.input)
    }
    return this.input
  }

  set computedModel(input: InputType) {
    if (this.maskPreset) {
      const value = this.preset.setterTransform(input)
      if (value !== undefined) {
        this.input = value
      }
    } else {
      this.input = input
    }
  }

  get input() {
    if (this.type === 'currency') {
      return this.value || 0
    }
    return this.value
  }

  set input(val: InputType) {
    if (this.required) {
      this.$emit('input', val || '')
    } else {
      this.$emit('input', val || null)
    }
  }

  created() {
    if (this.required && this.input === null) {
      this.input = ''
    } else if (!this.required && this.input === '') {
      this.input = null
    }
  }

  focusEvent() {
    const el = this.$el.getElementsByTagName('input')[0] as HTMLInputElement
    if (el && this.selectall) el.select()
    this.$emit('focus')
  }

  blurEvent() {
    this.$emit('blur')
  }
}

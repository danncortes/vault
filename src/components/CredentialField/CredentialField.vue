<template>
  <div class="credential-field mb-3">
    <b-container class="bv-example-row">
      <b-row align-h="between" align-v="start" no-gutters>
        <b-col cols="auto">
          <div class="credential-field__inputs d-flex">
            <div role="group" v-if="edit" class="mr-2">
              <!-- Field Name -->
              <b-input
                size="sm"
                :value="fieldName"
                type="text"
                :readonly="readonly"
                placeholder="Field Name"
                :state="fieldNameValid"
                @keyup="(e) => { onChangeFieldName(e) }"
                required
                class="credential-field__input-field-name"
              ></b-input>
              <b-form-invalid-feedback class="credential-field__input-field-name-feedback" id="input-live-feedback">
                "{{fieldName}}" field should not be duplicated
              </b-form-invalid-feedback>
            </div>

            <!-- Label Read-->
            <label
              v-else
              class="mr-sm-2 credential-field__field-name-read"
              :for="`inline-form-input-${index}`">
                {{field.fieldName}}
            </label>

            <!-- Data -->
            <b-input
              :id="`inline-form-input-${index}`"
              size="sm"
              :value="data"
              :type="typeField"
              :ref="field.fieldName"
              :readonly="readonly"
              :placeholder="`Insert ${fieldName}`"
              @keyup="(e) => { onChangeData(e) }"
              class="mr-2 credential-field__data-field"
            ></b-input>

            <TypesSelect
              :value="field.type"
              @onSelectTypeChange="onSelectTypeChange"
              v-if="edit"
              class="credential-field__type-select"/>

            <div class="credential-field__controls-read" v-if="!edit">
              <!-- Eye button Show/Hide-->
              <b-button class="credential-field__reveal-data-btn" variant="outline-secondary" size="sm" v-if="showEye" @click="() => { onClickEye(index) }">
                <i class="fas fa-eye" v-if="!field.show"></i>
                <i class="fas fa-eye-slash" v-else></i>
              </b-button>

              <!-- button Copy-->
              <b-button
                class="credential-field__copy-btn"
                variant="outline-primary"
                size="sm"
                @click="() => { onCopy(field.fieldName, index) }">
                <i class="far fa-copy"></i>
              </b-button>

              <!-- button Send Email-->
              <b-button
                class="credential-field__email-btn"
                v-if="field.type === 'email'"
                variant="outline-primary"
                size="sm"
                @click="() => { sendEmail()}">
                <i class="far fa-envelope"></i>
              </b-button>

              <!-- button Open Map-->
              <b-button
                class="credential-field__address-btn"
                v-else-if="field.type === 'address'"
                variant="outline-primary"
                size="sm" @click="() => { searchMap()}">
                <i class="far fa-map"></i>
              </b-button>

              <!-- button Open Url-->
              <b-button
                class="credential-field__url-btn"
                v-else-if="field.type === 'url'"
                variant="outline-primary"
                size="sm" @click="() => { openAddress()}">
                <i class="fas fa-external-link-alt"></i>
              </b-button>

              <span v-if="copied">Copied!</span>
            </div>
          </div>
        </b-col>

        <b-col cols="auto" v-if="edit">
          <div class="credential-field__controls-read">
            <b-button
              class="credential-field__remove-btn"
              pill
              variant="outline-danger"
              size="sm"
              v-if="minusButton" 
              @click="onClickRemove">
              <i class="fas fa-minus"></i>
            </b-button>
            <b-button
              class="credential-field__add-btn"
              pill
              variant="outline-success"
              size="sm"
              v-if="plusButton"
              @click="onClickAdd">
              <i class="fas fa-plus"></i>
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { BButton, BFormInput, BContainer, BRow, BCol, BFormInvalidFeedback } from 'bootstrap-vue'
  import TypesSelect from '@/components/TypesSelect'
  export default {
    data(){
      return {
        copied: false
      }
    },
    computed: {
      readonly() {
        return !this.edit
      },
      typeField() {
        if((typeof this.field.show) === 'boolean') {
          return this.field.show ? 'text' : 'password'
        }
        return 'text'
      },
      fieldName() {
        return this.field.fieldName
      },
      data() {
        return this.field.data
      },
      showEye() {
        return this.field.type === 'userName'  || this.field.type === 'password'
      }
    },
    methods: {
      onClickEye(index) {
        this.$emit('onToggleShowPass', index)
      },
      onCopy(el, index) {
        this.$emit('onToggleShowPass', index)
        this.$nextTick(() => {this.$refs[el].select()})
        this.$nextTick(() => {document.execCommand('copy')})
        this.$nextTick(() => {this.$emit('onToggleShowPass', index)})
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 1000)
      },
      sendEmail() {
        window.location.href = `mailto:${this.data}`
      },
      openAddress() {
        window.open(`http://${this.data}`, "_blank")
      },
      searchMap() {
        window.open(`https://www.google.com/maps/search/${this.data}`, "_blank")
      },
      onChangeFieldName(e) {
        this.$parent.$emit('onChangeFieldName', e.target.value, this.index)
      },
      onChangeData(e) {
        this.$parent.$emit('onChangeData', e.target.value, this.index)
      },
      onSelectTypeChange(type) {
        this.$parent.$emit('onSelectTypeChange', type, this.index)
      },
      onClickRemove() {
        this.$parent.$emit('removeField', this.index)
      },
      onClickAdd() {
        this.$parent.$emit('addField')
      }
    },
    props: {
      field: {
        required: true,
        type: Object
      },
      index: {
        required: true
      },
      edit: {
        type: Boolean,
        default: false
      },
      plusButton: {
        required: false,
        default: false
      },
      minusButton: {
        required: false,
        default: true
      },
      fieldNameValid: {
        required: false,
        default: true
      }
    },
    components: {
      BButton,
      'b-input': BFormInput,
      TypesSelect,
      BContainer,
      BRow,
      BCol,
      BFormInvalidFeedback
    },
  }
</script>

<style lang="scss">
  .credential-field {
    &__input-field-name, &__input-field-name-feedback {
      width: 120px;
    }
    
    &__data-field {
      width: 210px
    }

    &__type-select {
      width: 120px
    }

    .fa-eye, .fa-eye-slash {
      cursor: pointer
    }

    label {
      width: 130px;
      justify-content: initial
    }

    button {
      margin-right: 6px;
    }

    &__form {
      align-items: flex-start
    }
  }
</style>
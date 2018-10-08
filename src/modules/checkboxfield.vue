<template>
    <div class="field checkbox">
        <input type="hidden" :name="computedName" value="0">
        <input class="field__element" type="checkbox" :id="id" :name="computedName" :value="value" v-model="isChecked" :required="required">
        <label class="field__label" :for="id">{{ label }}</label>
    </div>
</template>

<script>
export default {
    props: ['label', 'name', 'value', 'checked', 'position', 'required'],

    data() {
        return {
            id: this._uid,
            isChecked: false
        }
    },

    mounted() {
        if(this.hasProp('checked')) this.isChecked = true;
    }
}
</script>
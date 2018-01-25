<template>
    <div class="field radio">
        <input class="field__element" type="radio" :id="id" :name="computedName" :value="value" v-model="isChecked">
        <label class="field__label" :for="id">{{ label }}</label>
    </div>
</template>

<script>
export default {
    props: ['label', 'name', 'value', 'checked', 'position'],

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
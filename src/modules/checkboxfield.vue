<template>
    <div class="field checkbox">
        <input class="field__element" type="checkbox" :id="id" :name="name" :value="value" v-model="isChecked">
        <label class="field__label" :for="id">{{ label }}</label>
    </div>
</template>

<script>
export default {
    props: ['label', 'name', 'value', 'checked'],

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
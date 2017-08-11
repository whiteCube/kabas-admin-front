<template>
    <div class="field group">
        <label class="field__label">{{ label }}</label>
        <div class="field__container">
            <genericfield v-for="(field, index) in options" :value="values[index]" :structure="field" @input="transferInput($event, index)" :key="index"></genericfield>
        </div>
    </div>
</template>

<script>
export default {
    props: ['label', 'options', 'values'],

    methods: {
        transferInput(value, index) {
            this.$emit('input', {value, index});
        }
    }
}
</script>
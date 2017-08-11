<template>
    <div class="field group">
        <label class="field__label">{{ label }}</label>
        <div class="field__container">
            <genericfield v-for="(field, index) in options" :value="values[index]" :structure="field" :key="field.label"></genericfield>
        </div>
    </div>
</template>

<script>
export default {
    props: ['label', 'options', 'values']
}
</script>
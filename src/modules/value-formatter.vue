<template>
    <div class="value-formatter" style="display: none;">
        <div class="field textfield" v-for="(field, key) in $store.state.fields" :key="key">
            <label class="field__label">{{ field.name }}</label>

            <!-- selectable -->
            <select class="field__element" v-model="field.value" :name="field.multiple ? field.name + '[]' : field.name" v-if="field.type == 'select'" :multiple="field.multiple">
                <option v-for="(val, index) in field.value" :value="val" :key="index">{{ val }}</option>
            </select>

            <!-- repeater & flexibles -->
            <input type="text" v-else-if="field.type == 'repeater' || field.type == 'flexible'">

            <!-- regular text values -->
            <input class="field__element" :name="field.name" type="text" :value="field.value" v-else>

            <!-- additional data -->
            <template v-if="field.type == 'flexible'">
                <input type="text" v-for="(value, index) in field.value" :name="field.name + '[' + index + ']' + '[option]'" :key="index" :value="value.option">
            </template>
            <pre><code>{{ field }}</code></pre>
        </div>
    </div>
</template>

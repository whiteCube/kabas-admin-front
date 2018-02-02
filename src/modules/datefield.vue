<template>
    <div class="field date">
        <label class="field__label" :for="id">{{ label }}</label>
        <p class="field__description" v-if="description" v-html="description"></p>
        <div class="field__container">
            <picker :id="id" v-model="val" format="dd MMMM yyyy" :placeholder="trans('fields.date.placeholder')" :clear-button="true" input-class="field__element" calendar-class="date__calendar" :name="computedName"></picker>
        </div>
    </div>
</template>

<script>
import picker from 'vuejs-datepicker';

export default {
    props: ['name', 'label', 'value', 'position', 'description'],
    components: { picker },

    data() {
        return {
            val: 'Click to select a date',
            id: 'date_' + this._uid
        }
    },

    created() {
        this.val = this.value;
    }
}
</script>
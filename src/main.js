import Vue from 'vue';
import components from './mixins/components.js';

// Global mixins, available in each component
Vue.mixin({
    methods: {
        hasProp(prop) {
            return typeof this[prop] !== 'undefined';
        },

        trans(accessor, value) {
            let parts = accessor.split('.');
            let result = this.$root.translations;
            parts.forEach(part => result = result[part]);
            return result.replace('%s', value);
        },

        transchoice(accessor, count, value = false) {
            let parts = accessor.split('.');
            let result = this.$root.translations;
            parts.forEach(part => result = result[part]);
            if(value !== false) result = result.split('%s').join(value);
            let choices = result.split('|');
            return count == 1 ? choices[0] : choices[1];
        }
    }
});

// Create the vue instance
new Vue({
    el: '#app',
    
    beforeCreate() {
        this.translations = JSON.parse(document.getElementById('app').attributes.translations.value);
    }
});


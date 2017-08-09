import Vue from 'vue';
import components from './mixins/components.js';

// Global mixins, available in each component
Vue.mixin({
    methods: {
        hasProp(prop) {
            return typeof this[prop] !== 'undefined';
        },

        trans(accessor) {
            let parts = accessor.split('.');
            let result = this.$root.translations;
            parts.forEach(part => {
                result = result[part];
            });
            return result;
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


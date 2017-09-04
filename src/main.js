import Vue from 'vue';
import components from './mixins/components.js';

// Global mixins, available in each component
Vue.mixin({
    methods: {
        hasProp(prop) {
            return typeof this[prop] !== 'undefined';
        },

        getAbsoluteParent() {
            if(this.level == 0) return this.id;
            return this.$parent.getAbsoluteParent();
        },

        getLastCrumb() {
            if(this.level !== 0) return this.$parent.getLastCrumb();
            return this.$refs.crumbs.crumbs[this.$refs.crumbs.crumbs.length -1];
        },

        trans(accessor, value) {
            let parts = accessor.split('.');
            let result = this.$root.translations;
            parts.forEach(part => result = result[part]);
            return result.replace('%s', value);
        },

        transchoice(accessor, count) {
            let parts = accessor.split('.');
            let result = this.$root.translations;
            parts.forEach(part => result = result[part]);
            result = result.split('%s').join(count);
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


// Helpers

String.prototype.like = function(search) {
    if (typeof search !== 'string' || this === null) {return false; }
    // Remove special chars
    search = search.replace(new RegExp("([\\.\\\\\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:\\-])", "g"), "\\$1");
    // Replace % and _ with equivalent regex
    search = search.replace(/%/g, '.*').replace(/_/g, '.');
    // Check matches
    return RegExp('^' + search + '$', 'gi').test(this);
}


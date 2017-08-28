<template>
    <label class="field__label">
        <template v-for="(crumb, index) in crumbs">
            <transition name="slideLeft">
            <a @click.prevent="navigate(crumb)" class="group__crumb"><span v-if="index > 0" class="group__crumbseparator"></span>{{ crumb.label }}</a>
            </transition>
        </template>
    </label>
</template>

<script>
import EventBus from '../mixins/event-bus.js';

export default {
    props: ['items', 'parent'],

    data() {
        return {
            crumbs: []
        }
    },

    created() {
        this.crumbs = this.crumbs.concat(this.items);
        /* 
         Since one breadcrumbs instance manages navigation for an
         infinite amount of sub fields, it is easier to manage
         state changes by listening to global events.
        */ 
        EventBus.$on('addCrumb', this.addCrumb);
        EventBus.$on('removeCrumbsUntil', this.removeCrumbsUntil);
        EventBus.$on('updateCrumb', this.updateCrumb);
    },

    methods: {
        addCrumb(crumb) {
            if (crumb.parent != this.parent) return;
            crumb.default = crumb.label;
            this.crumbs.push(crumb);
        },

        removeCrumbsUntil(level) {
            if(this.getAbsoluteParent() != this.parent) return;
            for(let i = 0; i < this.crumbs.length; i++) {
                this.crumbs = this.crumbs.filter(item => {
                    return item.level <= level;
                });
            }
        },

        updateCrumb(parent, level, value) {
            if(parent != this.parent) return;
            for(let i = 0; i < this.crumbs.length; i++) {
                let crumb = this.crumbs[i];
                if(crumb.level != level) continue;
                crumb.label = value;
                if(crumb.label == '') crumb.label = crumb.default;
            }
        },

        navigate(crumb) {
            EventBus.$emit('navigateCrumb', crumb);
        }
    }
}
</script>
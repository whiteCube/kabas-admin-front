<template>
    <div class="field group" :class="classes">
        <breadcrumbs :parent="id" ref="crumbs" v-if="level == 0" :items="[{label, level, parent: id}]"></breadcrumbs>
        <div class="field__container">
            <a v-show="showsub" class="group__backlink" @click.prevent="hideSubfield">
                {{ trans('fields.group.backlink', this.hasProp('primary') && values[primary] ? values[primary] : label) }}
            </a>
            <template v-for="(field, index) in options">
                
                <template v-for="type in nestable">
                <div class="group__nested" v-if="field.type == type" v-show="shouldDisplay(field, type)">
                    <a class="group__peek" v-show="!showsub" @click="showSubfield(field, level + 1, index)">
                        <label class="field__label">{{ field.label }}
                            <span class="group__subcount">{{ transchoice('fields.group.sub.' + type, Object.keys(field.options).length) }}</span>
                        </label>
                        <span class="group__action">{{ trans('fields.group.edit.' + type) }}</span>
                    </a>
                    <transition name="slide">
                    <div class="group__sub" v-show="showsub == field">
                        <genericfield :ref="index" :structure="field" :nestinglevel="level + 1" :value="values[index]"></genericfield>
                    </div>
                    </transition>
                </div>
                </template>

                <transition name="slide">
                <genericfield v-if="!isNestable(field) && !showsub" :value="values ? values[index] : null" :structure="field" @input="transferInput($event, index)" :key="index"></genericfield>
                </transition>
            </template>
        </div>
    </div>
</template>

<script>
import EventBus from '../mixins/event-bus.js';
import repeatable from '../mixins/repeatable.js';

/*
Todo:
Add flexible
*/

export default {
    props: ['label', 'options', 'values', 'primary'],
    mixins: [ repeatable ],

    data() {
        return {
            id: this._uid,
            showsub: false,
            nestable: ['group', 'flexible', 'repeater', 'gallery'],
        }
    },

    created() {
        for(let key in this.options) {
            if(this.isNestable(this.options[key])) {
                this.options[key].showsub = false;
            }
        }
        this.level = this.hasProp('nestinglevel') ? this.nestinglevel : 0;
        EventBus.$on('navigateCrumb', this.navigateSub);
    },

    methods: {
        transferInput(value, index) {
            this.$emit('input', {value, index});
        },

        is(field, ...types) {
            return types.indexOf(field.type) > -1;
        },

        isNestable(field) {
            return this.nestable.indexOf(field.type) > -1;
        },

        shouldDisplay(field, type) {
            return (this.is(field, type) && this.showsub == field) || (this.is(field, type) && !this.showsub)
        },

        showSubfield(field, level, index) {
            this.showsub = field;
            EventBus.$emit('resize', this.getAbsoluteParent());
            EventBus.$emit('addCrumb', {
                parent: this.getAbsoluteParent(),
                level: this.level + 1,
                index: index,
                label: field.label
            })
            this.$forceUpdate();

            // This fixes the issue with codemirror (wysiwyg) where the initial value does not appear right away.
            // Can be removed safely the day we stop using simplemde.
            setTimeout(() => {
                document.dispatchEvent(new Event('update'));
            }, 1);
        },

        hideSubfield() {
            this.$emit('hidesub', this.level);
            this.$parent.$emit('hidesub', this.level);
            EventBus.$emit('removeCrumbsUntil', this.getAbsoluteParent(), this.level);
            this.showsub = false;
        },

        navigateSub(crumb) {
            if(crumb.parent != this.getAbsoluteParent()) return;
            this.$emit('hidesub', crumb.level);
            EventBus.$emit('removeCrumbsUntil', this.getAbsoluteParent(), crumb.level);
            this.hideRecursivelyUntil(crumb.level, crumb.index);
        },

        updateItem(index, event) {
            this.values[index] = event;
        }
    },

    computed: {
        classes() {
            return {
                'group--showsub': this.showsub,
                'group--nested': this.showsub && this.level == 0
            }
        }
    }
}
</script>
<template>
    <div class="field group" :class="classes">
        <breadcrumbs :parent="id" ref="crumbs" v-if="level == 0" :items="[{label, level, parent: id}]"></breadcrumbs>
        <div class="field__container">
            <transition name="slideDown">
            <a v-show="showsub" class="group__backlink" @click="hideSubfield">
                {{ trans('fields.group.backlink', this.hasProp('primary') && values[primary] ? values[primary] : label) }}
            </a>
            </transition>
            <auto-expand @after-leave="showfields = true">
                <div class="group__fields" v-if="!showsub">
                    <template v-for="(field, index) in options">
                    <template v-for="type in nestable">
                    <div :key="index" class="group__nested" v-if="field.type == type" v-show="shouldDisplay(field, type)">
                        <a class="group__peek" tabindex="0" v-show="!showsub" @keyup.enter="showSubfield(field, level + 1, index)" @click="showSubfield(field, level + 1, index)">
                            <label class="field__label">{{ field.label }}
                                <span class="group__subcount">
                                    <template v-if="field.type == 'repeater'">
                                    {{ transchoice('fields.group.sub.repeater', values[index].length) }}
                                    </template>
                                    <template v-else>
                                    {{ transchoice('fields.group.sub.' + type, Object.keys(field.options).length) }}
                                    </template>
                                </span>
                            </label>
                            <span class="group__action">{{ trans('fields.group.edit.' + type) }}</span>
                        </a>
                    </div>
                    </template>
                    <genericfield v-if="!isNestable(field) && !showsub" :value="values ? values[index] : null" :name="field.name ? field.name : index" :structure="field" @input="transferInput($event, index)" :key="index"></genericfield>
                    </template>
                </div>
            </auto-expand>
            <auto-expand @after-leave="showsub = false">
                <div class="group__subfields" v-show="showfields">
                    <div :ref="index" :key="index" class="group__sub" v-for="(field, index) in options" v-show="showsub == index">
                        <template v-if="isIn(field, nestable)">
                            <genericfield  :structure="field" :nestinglevel="level + 1" :value="values[index]"></genericfield>
                        </template>
                    </div>
                </div>
            </auto-expand>
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
            showfields: false,
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

        isIn(field, array) {
            return array.indexOf(field.type) > -1;
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
            this.showsub = index;
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
                EventBus.$emit('updateWysiwyg');
            }, 300);
        },

        hideSubfield() {
            this.$emit('hidesub', this.level);
            this.$parent.$emit('hidesub', this.level);
            EventBus.$emit('removeCrumbsUntil', this.getAbsoluteParent(), this.level);
            this.showfields = false;
        },

        navigateSub(crumb) {
            if(crumb.parent != this.getAbsoluteParent()) return this.showsub = false;
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
                'group--parent': this.showsub && this.level == 0
            }
        }
    }
}
</script>
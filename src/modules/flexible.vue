<template>
    <div class="field repeater flexible" :class="classes" :id="id">
        <breadcrumbs :parent="id" ref="crumbs" v-if="level == 0" :items="[{label, level, parent: id}]"></breadcrumbs>
        <div class="field__container">
            <auto-expand @after-leave="showfields = true">
            <draggable class="repeater__items" :options="{ animation: 300 }" v-show="!current && current !== 0" v-model="list" @end="cancelDelete">
                <transition-group name="squish">
                <div class="repeater__item" v-for="(item, index) in list" :key="index">
                    <p class="repeater__title">
                        <em class="repeater__number">#{{ index + 1 }}</em><!--
                     --><template v-if="isComplex(item)">
                            <template v-for="(field, i) in options[item.option].options">
                                <span v-if="primaryCheck(i) && list[index].value[i] && list[index].value[i].length" class="repeater__preview">
                                <span class="field__label">{{ field.label }}</span>
                                <span v-if="field.type == 'color'" class="repeater__preview--color repeater__preview" :style="{background: list[index].value[i]}"></span>
                                    {{ getPreview(field.type, list[index].value[i]) }}
                                </span>
                            </template>
                        </template><!--
                     --><template v-else>
                            <span v-if="list[index]" class="repeater__preview">

                                <span class="field__label">{{ options[item.option].label }}</span>
                                <span v-if="item.type == 'color'" class="repeater__preview--color repeater__preview" :style="{background: list[index]}"></span>
                                {{ list[index].value }}
                            </span>
                        </template>
                        <span v-if="isEmpty(list[index])" class="repeater__preview">{{ trans('fields.repeater.nopreview') }}</span>
                    </p>
                    <a @click.prevent="remove(index)" v-if="!confirmdelete[index]" class="repeater__control repeater__control--delete">{{ trans('fields.repeater.delete') }}</a>
                    <a v-if="confirmdelete[index]" class="repeater__control repeater__control--destroy" @click.prevent="destroy(index)">{{ trans('fields.repeater.confirmdelete') }}</a>
                    <a v-if="confirmdelete[index]" class="repeater__control repeater__control--cancel" @click.prevent="cancelDelete(index)">{{ trans('fields.repeater.cancel') }}</a>
                    <a @click.prevent="edit(index)" class="repeater__control repeater__control--edit">{{ trans('fields.repeater.edit') }}</a>
                </div>
                </transition-group>
            </draggable>
            </auto-expand>
            <auto-expand @after-leave="current = null">
            <div v-show="showfields" class="repeater__editable">
                <div v-for="(item, i) in list">
                    <div v-show="i == current" class="repeater__fields">
                        <genericfield :primary="primary" ref="fields" :nestinglevel="level + 1" :value="list[i].value" @input="updateItem($event, i)" :structure="options[item.option]"></genericfield>
                    </div>
                </div>
            </div>
            </auto-expand>
            <div class="field__footer">
                <p class="field__tip">{{ tip }}</p>
                <div class="field__actions">
                    <a v-if="current || current == 0" @click.prevent="cancel" class="field__action btn btn--tiny">{{ trans('fields.repeater.cancel') }}</a>
                    <a v-if="current || current == 0" @click.prevent="finish" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.finish') }}</a>
                    <a v-else @click.prevent="showPopup = !showPopup" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.add') }}</a>
                    <transition name="slideDown">
                    <div class="flexible__popup" v-if="showPopup">
                        <a @click="add(option)" class="flexible__option" v-for="(option, index) in options">{{ option.label }}</a>
                    </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import EventBus from '../mixins/event-bus.js';
import repeatable from '../mixins/repeatable.js';

/*
Todo: 
Investigate reference issues with this.list to avoid having to do a snapshot on created()
Maybe make a banner to tell when in edit mode
Make a better interface for when repeater is empty, current one is confusing when nested
Investigate why preview is sometimes empty
*/

export default {
    props: ['label', 'name', 'translations', 'items', 'options', 'primary'],
    components: { draggable },
    mixins: [ repeatable ],

    data() {
        return {
            showPopup: false,


            current: null,
            showfields: false,
            id: this._uid,
            list: this.items,
            confirmdelete: [],
            complexFields: ['group', 'flexible', 'gallery', 'repeater'],
            restorepoint: null,
        }
    },

    created() {
        if(!this.list) this.list = [];
        this.snapshot();
        this.restore();
        this.level = this.hasProp('nestinglevel') ? this.nestinglevel : 0;
        EventBus.$on('navigateCrumb', this.navigateSub);
    },

    methods: {

        remove(index) {
            this.confirmdelete[index] = true;
            this.$forceUpdate();
        },

        destroy(index) {
            this.$delete(this.list, index);
            delete this.confirmdelete[index];
        },

        cancelDelete(index) {
            if(typeof index == 'int') delete this.confirmdelete[index];
            else this.confirmdelete = [];
            this.$forceUpdate();
        },

        edit(index) {
            this.snapshot();
            this.current = index;
            EventBus.$emit('addCrumb', {
                parent: this.getAbsoluteParent(),
                level: this.level + 1,
                index: index,
                label: this.primary && this.list[index][this.primary] ? this.list[index][this.primary] : this.options[this.list[index].option].label
            });

            // This fixes the issue with codemirror (wysiwyg) where the initial value does not appear right away.
            // Can be removed safely the day we stop using simplemde.
            setTimeout(() => {
                EventBus.$emit('updateWysiwyg');
            }, 300);
        },

        cancel() {
            this.restore();
            this.showfields = false;
            this.$emit('input', this.list);
            EventBus.$emit('removeCrumbsUntil', this.getAbsoluteParent(), this.level);
        },

        finish() {
            this.showfields = false;
            EventBus.$emit('removeCrumbsUntil', this.getAbsoluteParent(), this.level);
        },

        add(option) {
            this.snapshot();
            let blank = '';
            if(option.type == 'group') blank = this.getBlank(option);
            this.list.push({
                option: option.option,
                value: blank
            });
            this.$emit('input', this.list);
            this.current = this.list.length - 1;
            this.showPopup = false;

            EventBus.$emit('addCrumb', {
                parent: this.getAbsoluteParent(),
                level: this.level + 1,
                index: this.list.length - 1,
                label: option.label 
            });
        },

        getBlank(option) {
            let blank = {};
            for(let key in option.options) {
                if(option.options[key].type == 'repeater') blank[key] = [];
                else blank[key] = '';
            }
            return blank;
        },

        updateItem(e, index) {
            if(typeof e == 'object') {
                if(e.index == this.primary) {
                    EventBus.$emit('updateCrumb', this.getAbsoluteParent(), this.level + 1, e.value);
                }
                this.list[index].value[e.index] = e.value;
            } else {
                this.list[index].value = e;
            }
            this.$parent.$emit('input', e);
            this.$forceUpdate();
        },

        snapshot() {
            this.restorepoint = JSON.parse(JSON.stringify(this.list));
        },

        restore() {
            this.list = this.restorepoint;
            this.restorepoint = null;
        },

        isComplex(item) {
            return this.complexFields.indexOf(this.options[item.option].type) > -1;
        },

        isEmpty(data) {
            if(!data) return true;
            for(let key in data) { if(data[key]) return false; }
            return true;
        },

        getPreview(type, value) {
            if(type == 'repeater') return this.transchoice('fields.group.subrepeateritems', value.length);
            if(type == 'image') return value.alt;
            return value;
        },

        navigateSub(crumb) {
            if(crumb.parent != this.getAbsoluteParent()) return;
            if(crumb.level <= this.level) this.finish();
        },

        primaryCheck(name) {
            return (!this.hasProp('primary') || (this.hasProp('primary') && this.primary == name));
        }
    },

    computed: {
        tip() {
            return this.current ? this.trans('fields.repeater.editTip') 
                   : this.list.length ? this.trans('fields.repeater.tip') 
                   : this.trans('fields.repeater.empty');
        },

        classes() {
            return {
                'repeater--empty': !this.list.length,
                'repeater--parent': this.showfields && this.level == 0
            }
        }
    },

    watch: {
        items(newVal) {
            this.list = newVal;
        }
    }
}
</script>
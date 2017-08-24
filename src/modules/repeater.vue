<template>
    <div class="field repeater" :class="classes" :id="id">
        <!-- <label class="field__label">{{ label }}</label> -->

        
        <label class="field__label" v-if="level == 0">
            <template v-for="(crumb, index) in crumbs">
                <transition name="slideLeft">
                <a v-if="crumb && index <= lastcrumb" @click="navigateSub(crumb)" class="group__crumb"><span v-if="index > 0 && index <= lastcrumb" class="group__crumbseparator"></span>{{ crumb.label }}</a>
                </transition>
            </template>
        </label>


        <div class="field__container">
            <transition mode="out-in" @after-leave="showfields = true" name="slide">
            <draggable class="repeater__items" :options="{ animation: 300 }" v-show="!current && current !== 0" v-model="list" @end="cancelDelete">
                <div class="repeater__item" v-for="(item, index) in list" :key="index">
                    <p class="repeater__title">
                        <em class="repeater__number">#{{ index + 1 }}</em><!--
                     --><template v-if="isComplex()">
                            <template v-for="(field, i) in structure.options">
                                <span v-if="list[index][i] && list[index][i].length" class="repeater__preview">
                                 <span class="field__label">{{ field.label }}</span>
                                 <span v-if="field.type == 'color'" class="repeater__preview--color repeater__preview" :style="{background: list[index][i]}"></span>
                                    {{ getPreview(field.type, list[index][i]) }}
                                </span>
                            </template>
                        </template><!--
                     --><template v-else>
                            <span v-if="list[index]" class="repeater__preview">
                                <span class="field__label">{{ structure.label }}</span>
                                <span v-if="structure.type == 'color'" class="repeater__preview--color repeater__preview" :style="{background: list[index]}"></span>
                                {{ list[index] }}
                            </span>
                        </template>
                        <span v-if="isEmpty(list[index])" class="repeater__preview">{{ trans('fields.repeater.nopreview') }}</span>
                    </p>
                    <a @click.prevent="remove(index)" v-if="!confirmdelete[index]" class="repeater__control repeater__control--delete">{{ trans('fields.repeater.delete') }}</a>
                    <a v-if="confirmdelete[index]" class="repeater__control repeater__control--destroy" @click.prevent="destroy(index)">{{ trans('fields.repeater.confirmdelete') }}</a>
                    <a v-if="confirmdelete[index]" class="repeater__control repeater__control--cancel" @click.prevent="cancelDelete(index)">{{ trans('fields.repeater.cancel') }}</a>
                    <a @click.prevent="edit(index)" class="repeater__control repeater__control--edit">{{ trans('fields.repeater.edit') }}</a>
                </div>
            </draggable>
            </transition>
            <transition name="slide" @after-leave="current = null">
            <div v-show="showfields" class="repeater__editable">
                <div v-for="(item, i) in list">
                    <div v-show="i == current" class="repeater__fields">
                        <genericfield ref="fields" @hidesub="hideSub" @showsub="showSub" :nestinglevel="level + 1" :value="list[i]" @input="updateItem($event, i)" :structure="structure"></genericfield>
                    </div>
                </div>
            </div>
            </transition>
            <div class="field__footer">
                <p class="field__tip">{{ tip }}</p>
                <div class="field__actions">
                    <a v-if="current || current == 0" @click.prevent="cancel" class="field__action btn btn--tiny">{{ trans('fields.repeater.cancel') }}</a>
                    <a v-if="current || current == 0" @click.prevent="finish" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.finish') }}</a>
                    <a v-else @click.prevent="add" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.add') }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import crumbNavigation from '../mixins/crumbNavigation.js';

/*
Todo: 
Investigate reference issues with this.list to avoid having to do a snapshot on created()
Maybe make a banner to tell when in edit mode
*/

export default {
    props: ['label', 'name', 'translations', 'items', 'structure'],
    mixins: [crumbNavigation],
    components: { draggable },

    data() {
        return {
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
        this.crumbs.push({label: this.label, level: this.level});

        this.$on('showsub', this.showSub);
        this.$on('hidesub', this.hideSub);
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
            this.showSub({
                level: this.level + 1,
                index: index,
                label: this.structure.label 
            });

            // This fixes the issue with codemirror (wysiwyg) where the initial value does not appear right away.
            // Can be removed safely the day we stop using simplemde.
            setTimeout(() => {
                document.dispatchEvent(new Event('update'));
            }, 300);
        },

        cancel() {
            this.restore();
            this.current = null;
            this.showfields = false;
            this.hideSub(0);
        },

        finish() {
            this.showfields = false;
            this.hideSub(0);
        },

        add() {
            this.snapshot();
            let blank = '';
            if(this.structure.type == 'group') blank = this.getBlank();
            this.list.push(blank);
            this.$emit('input', this.list);
            this.current = this.list.length - 1;
            this.showSub({
                level: this.level + 1,
                index: this.list.length - 1,
                label: this.structure.label 
            });
        },

        getBlank() {
            let blank = {};
            for(let key in this.structure.options) {
                if(this.structure.options[key].type == 'repeater') blank[key] = [];
                else blank[key] = '';
            }
            return blank;
        },

        updateItem(e, index) {
            if(typeof e == 'object') {
                this.list[index][e.index] = e.value;
            } else {
                this.list[index] = e;
            }
        },

        snapshot() {
            this.restorepoint = JSON.parse(JSON.stringify(this.list));
        },

        restore() {
            this.list = this.restorepoint;
            this.restorepoint = null;
        },

        isComplex() {
            return this.complexFields.indexOf(this.structure.type) > -1;
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

        navigateSub(crumb, index) {
            if(crumb.level == this.level) this.finish();
            this.$emit('hidesub', crumb.level);
            this.hideRecursivelyUntil(crumb.level, crumb.index);
            if(!this.$refs.fields[this.current]) return;
            this.$refs.fields[this.current].$refs.field.navigateSub(crumb, index);
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
                'repeater--empty': !this.list.length
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
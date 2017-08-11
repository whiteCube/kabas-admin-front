<template>
    <div class="field repeater" :class="classes" :id="id">
        <label class="field__label">{{ label }}</label>
        <div class="field__container" :style="{ 'min-height': minheight }">
            <transition mode="out-in" @after-leave="showfields = true" name="slide">
            <div class="repeater__items" v-show="!current" key="items">
                <div class="repeater__item" v-for="(item, index) in list">
                    <p class="repeater__title">
                        <em class="repeater__number">#{{ index + 1 }}</em>
                        <span v-html="preview(index)"></span>
                    </p>
                    <a @click.prevent="remove(index)" v-if="!confirmdelete[index]" class="repeater__control repeater__control--delete">{{ trans('fields.repeater.delete') }}</a>
                    <a v-if="confirmdelete[index]" class="repeater__control repeater__control--delete" @click.prevent="destroy(index)">{{ trans('fields.repeater.confirmdelete') }}</a>
                    <a @click.prevent="edit(item)" class="repeater__control repeater__control--edit">{{ trans('fields.repeater.edit') }}</a>
                </div>
            </div>
            </transition>
            <transition name="slide" @after-leave="current = null">
            <div v-show="showfields" class="repeater__editable" key="fields">
                <template v-for="(item, i) in list">
                    <div v-show="item == current" class="repeater__fields">
                        <genericfield :value="items[i]" @input="updatePreview($event, i)" :structure="structure"></genericfield>
                    </div>
                </template>
            </div>
            </transition>
            <div class="field__footer">
                <p class="field__tip">{{ tip }}</p>
                <div class="field__actions">
                    <a v-if="current" @click.prevent="finish" class="field__action btn btn--tiny">{{ trans('fields.repeater.cancel') }}</a>
                    <a v-if="current" @click.prevent="finish" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.finish') }}</a>
                    <a v-else @click.prevent="add" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.add') }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import components from '../mixins/components.js';

/*
Todo: 
Deleting
Drag/drop to change order of items
Cancel changes
Calculate proper string preview
*/

export default {
    props: ['label', 'name', 'translations', 'items', 'structure'],

    data() {
        return {
            current: null,
            showfields: false,
            id: this._uid,
            minheight: 0,
            list: [],
            confirmdelete: []
        }
    },

    created() {
        this.list = JSON.parse(JSON.stringify(this.items));
        this.previews = JSON.parse(JSON.stringify(this.items));
    },

    methods: {
        preview(index) {
            let preview = '';
            let value = this.previews[index];
            if(this.structure.type == 'group') {
                for(let key in value) {
                    preview = this.addPreviewBit(preview, value[key], this.structure.options[key].type);
                }
            } else preview = this.addPreviewBit(preview, value, this.structure.type);
            if(preview == '') preview = this.trans('fields.repeater.nopreview');
            return preview;
        },

        addPreviewBit(preview, value, type) {
            if(type == 'text' || type == 'textarea' || type == 'url' || type == 'email') preview = this.appendText(preview, value);
            if(type == 'color') preview = this.appendColor(preview, value);
            return preview;
        },

        remove(index) {
            this.confirmdelete[index] = true;
            this.$forceUpdate();
        },

        destroy(index) {
            this.$delete(this.list, index);
            this.$delete(this.previews, index);
            delete this.confirmdelete[index];
        },

        edit(item) {
            this.current = item;
        },

        finish() {
            this.showfields = false;
        },

        add() {
            this.list.push(this.getBlank());
            this.previews.push(this.getBlank());
            this.edit(this.list[this.list.length - 1]);
        },

        getBlank() {
            let blank = {};
            Object.keys(this.structure).forEach(item => {
                blank[item] = '';
            });
            return blank;
        },

        appendColor(preview, color) {
            return this.appendText(preview, '<span class="repeater__preview--color repeater__preview" style="background: ' + color + '"></span>' + color);
        },

        appendText(preview, text) {
            if(!text) return preview;
            if(preview !== '') preview += ', ';
            return preview += text;
        },

        updatePreview(value, item) {
            if(typeof value !== 'object') return this.previews[item] = value;
            return this.previews[item][value.index] = value.value;
        }
    },

    computed: {
        tip() {
            return this.current ? this.trans('fields.repeater.editTip') : this.list.length ? this.trans('fields.repeater.tip') : this.trans('fields.repeater.empty');
        },

        classes() {
            return {
                'repeater--empty': !this.list.length
            }
        }
    }
}
</script>
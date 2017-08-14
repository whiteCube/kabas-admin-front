<template>
    <div class="field repeater" :class="classes" :id="id">
        <label class="field__label">{{ label }}</label>
        <div class="field__container" :style="{ 'min-height': minheight }">
            <transition mode="out-in" @after-leave="showfields = true" name="slide">
            <draggable class="repeater__items" :options="{ animation: 300 }" v-show="!current && current !== 0" v-model="list">
                <div class="repeater__item" v-for="(item, index) in list" :key="index">
                    <p class="repeater__title">
                        <em class="repeater__number">#{{ index + 1 }}</em>
                        <span v-html="preview(index)"></span>
                    </p>
                    <a @click.prevent="remove(index)" v-if="!confirmdelete[index]" class="repeater__control repeater__control--delete">{{ trans('fields.repeater.delete') }}</a>
                    <a v-if="confirmdelete[index]" class="repeater__control repeater__control--delete" @click.prevent="destroy(index)">{{ trans('fields.repeater.confirmdelete') }}</a>
                    <a @click.prevent="edit(index)" class="repeater__control repeater__control--edit">{{ trans('fields.repeater.edit') }}</a>
                </div>
            </draggable>
            </transition>
            <transition name="slide" @after-leave="current = null">
            <div v-show="showfields" class="repeater__editable" key="fields">
                <template v-for="(item, i) in list">
                    <div v-show="i == current" class="repeater__fields">
                        <genericfield :value="list[i]" @input="updatePreview($event, i)" :structure="structure"></genericfield>
                    </div>
                </template>
            </div>
            </transition>
            <div class="field__footer">
                <p class="field__tip">{{ tip }}</p>
                <div class="field__actions">
                    <a v-if="current || current == 0" @click.prevent="finish" class="field__action btn btn--tiny">{{ trans('fields.repeater.cancel') }}</a>
                    <a v-if="current || current == 0" @click.prevent="finish" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.finish') }}</a>
                    <a v-else @click.prevent="add" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.add') }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable';

/*
Todo: 
Deleting
Drag/drop to change order of items
Cancel changes
Calculate proper string preview
*/

export default {
    props: ['label', 'name', 'translations', 'items', 'structure'],
    components: { draggable },

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
        this.list = this.items;
    },

    methods: {
        preview(index) {
            let preview = '';
            let value = this.list[index];
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
            if(type == 'color' && value !== '') preview = this.appendColor(preview, value);
            return preview;
        },

        remove(index) {
            this.confirmdelete[index] = true;
            this.$forceUpdate();
        },

        destroy(index) {
            this.$delete(this.list, index);
            delete this.confirmdelete[index];
        },

        edit(index) {
            this.current = index;
        },

        finish() {
            this.showfields = false;
        },

        add() {
            let preview = '';
            if(this.structure.type == 'group') preview = this.getPreviewObject();
            else preview = '';
            this.list.push(preview);
            this.edit(this.list.length - 1);
        },

        getPreviewObject() {
            let preview = {};
            for(let key in this.structure.options) {
                preview[key] = '';
            }
            return preview;
        },

        appendColor(preview, color) {
            return this.appendText(preview, '<span class="repeater__preview--color repeater__preview" style="background: ' + color + '"></span>' + color);
        },

        appendText(preview, text) {
            if(!text) return preview;
            if(preview !== '') preview += ', ';
            return preview += text;
        },

        updatePreview(e, index) {
            if(typeof e == 'object') {
                this.list[index][e.index] = e.value;
            } else {
                this.list[index] = e;
            }
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
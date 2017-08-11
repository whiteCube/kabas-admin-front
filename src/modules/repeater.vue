<template>
    <div class="field repeater" :id="id">
        <label class="field__label">{{ label }}</label>
        <div class="field__container" :style="{ 'min-height': minheight }">
            <transition mode="out-in" @after-leave="showfields = true" name="slide">
            <div class="repeater__items" v-show="!current" key="items">
                <div class="repeater__item" v-for="(item, index) in list">
                    <p class="repeater__title">
                        <em class="repeater__number">#{{ index + 1 }}</em>
                        <span v-html="preview(index)"></span>
                    </p>
                    <a href="#" class="repeater__control repeater__control--delete">{{ trans('fields.repeater.delete') }}</a>
                    <a href="#" @click.prevent="edit(item, index)" class="repeater__control repeater__control--edit">{{ trans('fields.repeater.edit') }}</a>
                </div>
            </div>
            </transition>
            <transition name="slide" @after-leave="current = null">
            <div v-show="showfields" class="repeater__editable" key="fields">
                <template v-for="(item, i) in list">
                    <div v-show="item == current" class="repeater__fields">
                        <template v-for="(field, j) in structure">
                            <genericfield :name="j" :value="list[i][j]" @input="updatePreview($event, i, j)" :structure="field"></genericfield>
                        </template>
                    </div>
                </template>
            </div>
            </transition>
            <div class="field__footer">
                <p class="field__tip">{{ tip }}</p>
                <div class="field__actions">
                    <a href="#" v-if="current" @click.prevent="finish" class="field__action btn btn--tiny">{{ trans('fields.repeater.cancel') }}</a>
                    <a href="#" v-if="current" @click.prevent="finish" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.finish') }}</a>
                    <a href="#" v-else @click.prevent="add" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.add') }}</a>
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
            list: []
        }
    },

    created() {
        this.list = JSON.parse(JSON.stringify(this.items));
        this.previews = JSON.parse(JSON.stringify(this.items));
    },

    methods: {
        preview(index) {
            let preview = '';
            for(let key in this.structure) {
                if(!this.structure.hasOwnProperty(key)) continue;
                let type = this.structure[key].type;
                if(type == 'text' || type == 'textarea' || type == 'url' || type == 'email') preview = this.appendText(preview, this.previews[index][key]);
                if(type == 'color') preview = this.appendColor(preview, this.previews[index][key]);
            }
            if(preview == '') preview = this.trans('fields.repeater.nopreview');
            return preview;
        },

        edit(item) {
            this.current = item;
        },

        finish() {
            this.showfields = false;
        },

        add() {
            this.list.push(this.getBlank());
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

        updatePreview(value, item, field) {
            if(!this.previews[item]) this.previews[item] = {};
            this.previews[item][field] = value;
        }
    },

    computed: {
        tip() {
            return this.current ? this.trans('fields.repeater.editTip') : this.trans('fields.repeater.tip');
        }
    }
}
</script>
<template>
    <div class="field gallery repeater" :class="classes" :id="id">
        <label class="field__label">{{ label }}</label>
        <div class="field__container">
            <transition mode="out-in" @after-leave="showfields = true" name="slide">
            <draggable class="repeater__items" :options="{ animation: 300 }" v-show="!current && current !== 0" v-model="list" @end="cancelDelete">
                <div class="repeater__item" v-for="(item, index) in list" :key="index">
                    <figure class="gallery__fig" :style="{ 'background-image': background(item.value) }"></figure>
                    <p class="repeater__title">
                        <span v-html="preview(index)"></span>
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
                <span v-for="(item, i) in list">
                    <div v-show="i == current" class="repeater__fields">
                        <genericfield :value="list[i]" @input="updatePreview($event, i)" :structure="structure"></genericfield>
                    </div>
                </span>
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

/*
Todo:
Investigate reference issues with this.list to avoid having to do a snapshot on created()
*/

export default {
    props: ['label', 'name', 'translations', 'items', 'structure'],
    components: { draggable },

    data() {
        return {
            current: null,
            showfields: false,
            id: this._uid,
            list: this.items,
            confirmdelete: [],
            restorepoint: null
        }
    },

    created() {
        if(!this.list) this.list = [];
        this.snapshot();
        this.restore();
    },

    methods: {
        preview(index) {
            let preview = '';
            let value = this.list[index];
            preview = value.alt;
            if(preview == '') preview = this.trans('fields.repeater.nopreview');
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

        cancelDelete(index) {
            if(typeof index == 'int') delete this.confirmdelete[index];
            else this.confirmdelete = [];
            this.$forceUpdate();
        },

        edit(index) {
            this.snapshot();
            this.current = index;
        },

        cancel() {
            this.restore();
            this.current = null;
            this.showfields = false;
        },

        finish() {
            this.showfields = false;
        },

        add() {
            this.snapshot();
            this.list.push({});
            this.current = this.list.length - 1;
        },

        getBlank() {
            let preview = {};
            for(let key in this.structure.options) {
                preview[key] = '';
            }
            return preview;
        },

        appendText(preview, text) {
            if(!text) return preview;
            if(preview !== '') preview += ', ';
            return preview += text;
        },

        updatePreview(e, index) {
            this.list[index] = e;
        },

        snapshot() {
            this.restorepoint = JSON.parse(JSON.stringify(this.list));
        },

        restore() {
            this.list = this.restorepoint;
            this.restorepoint = null;
        },

        background(data) {
            if(!data) return false;
            if(data.substr(0, 4) == 'http') return 'url(' + data + ')';
            return data;
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
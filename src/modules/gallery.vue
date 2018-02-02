<template>
    <div class="field gallery repeater" :class="classes" :id="id">
        <label class="field__label" v-if="level == 0">{{ label }}</label>
        <p class="field__description" v-if="description" v-html="description"></p>
        <div class="field__container">
            <auto-expand @after-leave="showfields = true">
            <!-- <transition mode="out-in" @before-leave="beforeAnimate" @enter="calcHeight"  name="slide"> -->
            <draggable class="repeater__items" :options="{ animation: 300 }" v-show="!current && current !== 0" v-model="list" @end="cancelDelete">
                <div class="repeater__item" v-for="(item, index) in list" :key="index">
                    <figure class="gallery__fig" :style="{ 'background-image': background((item.value) ? item.value : '') }"></figure>
                    <p class="repeater__title">
                        <span v-html="preview(index)"></span>
                    </p>
                    <a @click.prevent="remove(index)" v-if="!confirmdelete[index]" class="repeater__control repeater__control--delete">{{ trans('fields.repeater.delete') }}</a>
                    <a v-if="confirmdelete[index]" class="repeater__control repeater__control--destroy" @click.prevent="destroy(index)">{{ trans('fields.repeater.confirmdelete') }}</a>
                    <a v-if="confirmdelete[index]" class="repeater__control repeater__control--cancel" @click.prevent="cancelDelete(index)">{{ trans('fields.repeater.cancel') }}</a>
                    <a @click.prevent="edit(index)" class="repeater__control repeater__control--edit">{{ trans('fields.repeater.edit') }}</a>
                </div>
            </draggable>
            </auto-expand>
            <auto-expand @after-leave="current = null">
            <!-- <transition name="slide" @enter="calcHeight" @before-leave="beforeAnimate" > -->
            <div v-show="showfields" class="repeater__editable">
                <span v-for="(item, i) in list" :key="i">
                    <div v-show="i == current" class="repeater__fields">
                        <genericfield :value="list[i]" @input="updatePreview($event, i)" :structure="structure" :position="position || i"></genericfield>
                    </div>
                </span>
            </div>
            </auto-expand>
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
import repeatable from '../mixins/repeatable.js';
import EventBus from '../mixins/event-bus.js';

/*
Todo:
Investigate reference issues with this.list to avoid having to do a snapshot on created()
Make structure optional (we should not have to pass the type, but we should be able to change the label, types, and sizes)
Investigate why filename disappears on cancel
*/

export default {
    props: ['label', 'name', 'translations', 'items', 'structure', 'position', 'description'],
    components: { draggable },
    mixins: [ repeatable ],

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
            let value = this.list[index].value;
            preview = value.alt || value.file && value.file.name || this.trans('fields.repeater.nopreview');
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
            if(typeof data == 'object') data = data.path;
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
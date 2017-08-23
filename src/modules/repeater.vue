<template>
    <div class="field repeater" :class="classes" :id="id">
        <label class="field__label">{{ label }}</label>
        <div class="field__container">
            <transition mode="out-in" @after-leave="showfields = true" name="slide">
            <draggable class="repeater__items" :options="{ animation: 300 }" v-show="!current && current !== 0" v-model="list" @end="cancelDelete">
                <div class="repeater__item" v-for="(item, index) in list" :key="index">
                    <p class="repeater__title">
                        <em class="repeater__number">#{{ index + 1 }}</em><!--
                     --><template v-if="isComplex()">
                            <template v-for="(field, i) in structure.options">
                                <span v-if="list[index][i]" class="repeater__preview">
                                 <span class="field__label">{{ field.label }}</span>
                                 <span v-if="field.type == 'color'" class="repeater__preview--color repeater__preview" :style="{background: list[index][i]}"></span>
                                    <template v-if="field.type == 'repeater'">{{ transchoice('fields.group.subrepeateritems', list[index][i].length) }}</template>
                                    <template v-else>{{ list[index][i] }}</template>
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
                        <genericfield :value="list[i]" @input="updatePreview($event, i)" :structure="structure"></genericfield>
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

/*
Todo: 
Investigate reference issues with this.list to avoid having to do a snapshot on created()
Maybe make a banner to tell when in edit mode
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
            complexFields: ['group', 'flexible', 'gallery', 'repeater'],
            restorepoint: null
        }
    },

    created() {
        if(!this.list) this.list = [];
        this.snapshot();
        this.restore();
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
        },

        finish() {
            this.showfields = false;
        },

        add() {
            this.snapshot();
            let blank = '';
            if(this.structure.type == 'group') blank = this.getBlank();
            else blank = '';
            this.list.push(blank);
            this.current = this.list.length - 1;
        },

        getBlank() {
            let preview = {};
            for(let key in this.structure.options) {
                preview[key] = '';
            }
            return preview;
        },

        updatePreview(e, index) {
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
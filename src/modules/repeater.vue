<template>
    <div class="field repeater" :id="id">
        <label class="field__label">{{ label }}</label>
        <div class="field__container" :style="{ 'min-height': minheight }">
            <transition mode="out-in" name="slide">
            <div class="repeater__items" v-if="!current" key="items">
                <div class="repeater__item" v-for="(item, index) in items">
                    <p class="repeater__title">
                        <em class="repeater__number">#{{ index + 1 }}</em>
                        {{ title(item) }}
                    </p>
                    <a href="#" class="repeater__control repeater__control--delete">{{ trans('fields.repeater.delete') }}</a>
                    <a href="#" @click.prevent="edit(item, index)" class="repeater__control repeater__control--edit">{{ trans('fields.repeater.edit') }}</a>
                </div>
            </div>
            <div v-else class="repeater__editable" key="fields">
                <template v-for="(item, i) in items">
                    <div v-show="item == current" class="repeater__fields">
                        <template v-for="(field, j) in structure">
                            <genericfield :name="j" :value="items[i][j]" :structure="field"></genericfield>
                        </template>
                    </div>
                </template>
            </div>
            </transition>
            <div class="field__footer">
                <p class="field__tip">{{ tip }}</p>
                <div class="field__actions">
                    <a href="#" v-if="current" @click.prevent="cancel" class="field__action btn btn--tiny">{{ trans('fields.repeater.cancel') }}</a>
                    <a href="#" v-if="current" class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.finish') }}</a>
                    <a href="#" v-else class="field__action btn btn--tiny btn--secondary">{{ trans('fields.repeater.add') }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import components from '../mixins/components.js';

export default {
    props: ['label', 'name', 'translations', 'items', 'structure'],

    data() {
        return {
            current: null,
            id: 'a' + this._uid,
            minheight: 0
        }
    },

    methods: {
        title(item) {
            return item.title;
        },

        edit(item, index) {
            this.current = item;
        },

        cancel() {
            this.current = null;
        },

        updateHeight() {
            // let $items = this.$items ? this.$items : document.querySelector('#' + this.id + ' .repeater__items');
            // let listHeight = this.current ? 0 : $items.clientHeight;
            // let footerHeight = $items.parentNode.nextElementSibling.clientHeight;
            // let fieldsHeight = this.current ? $items.nextElementSibling.clientHeight : 0;
            // this.minheight = listHeight + fieldsHeight + footerHeight;
        }
    },

    computed: {
        tip() {
            return this.current ? this.trans('fields.repeater.editTip') : this.trans('fields.repeater.tip');
        }
    }
}
</script>
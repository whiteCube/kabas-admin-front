<template>
    <div class="field wysiwyg">
        <label class="field__label" @click="focus" :for="id">{{ label }}</label>
        <p class="field__description" v-if="description" v-html="description"></p>
        <div class="field__container">
            <div :id="id + 'tui'"></div>
            <textarea class="field__element sro" :id="id" :name="computedName" v-model="val"></textarea>
        </div>
        <transition name="slideDown">
            <p class="field__error" v-if="error">{{ error }}</p>
        </transition>
    </div>
</template>

<script>
import Editor from 'tui-editor';
import EventBus from '../mixins/event-bus.js';

export default {
    props: ['label', 'name', 'limit', 'placeholder', 'value', 'position', 'description'],
    data() {
        return {
            id: this._uid,
            element: null,
            val: this.value,
            editor: null
        }
    },

    methods: {
        focus() {
            this.editor.focus();
        }
    },

    mounted() {
        this.element = document.getElementById(this._uid + 'tui');
        this.editor = new Editor({
            el: this.element,
            initialEditType: 'wysiwyg',
            previewStyle: 'vertical',
            initialValue: this.value,
            height: 'auto',
            events: {
                change: (e) => {
                    this.val = this.editor.getValue();
                    this.$emit('input', this.val);
                }
            }
        });
    }
}
</script>
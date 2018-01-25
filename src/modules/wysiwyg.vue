<template>
    <div class="field wysiwyg">
        <label class="field__label" @click="focus" :for="id">{{ label }}</label>
        <div class="field__container">
            <div :id="id + 'tui'"></div>
            <textarea class="field__element sro" :id="id" v-model="val" :name="computedName"></textarea>
        </div>
    </div>
</template>

<script>
import SimpleMDE from 'SimpleMDE';
import Editor from 'tui-editor';
import EventBus from '../mixins/event-bus.js';

export default {
    props: ['label', 'name', 'limit', 'placeholder', 'value', 'position'],
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
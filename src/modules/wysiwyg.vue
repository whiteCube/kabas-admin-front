<template>
    <div class="field wysiwyg" :class="classes">
        <label class="field__label" @click="focus" :for="id">{{ label }}</label>
        <p class="field__description" v-if="description" v-html="description"></p>
        <div class="field__container">
            <div :id="id + 'tui'"></div>
            <textarea class="field__element sro" :id="id" :name="computedName" v-model="val" :required="required"></textarea>
        </div>
        <transition name="slideDown">
            <p class="field__error" v-if="errormessage">{{ errormessage }}</p>
        </transition>
    </div>
</template>

<script>
import Editor from 'tui-editor';
import EventBus from '../mixins/event-bus.js';

// define youtube extension
Editor.defineExtension('youtube', function() {
// runs while markdown-it transforms code block to HTML
Editor.codeBlockManager.setReplacer('youtube', function(youtubeId) {
    // Indentify multiple code blocks
    var wrapperId = 'yt' + Math.random().toString(36).substr(2, 10);
    // avoid sanitizing iframe tag
    setTimeout(renderYoutube.bind(null, wrapperId, youtubeId), 0);
        return '<div id="' + wrapperId + '"></div>';
    });
});

function renderYoutube(wrapperId, youtubeId) {
    var el = document.querySelector('#' + wrapperId);
    el.innerHTML = '<iframe width="420" height="315" src="https://www.youtube.com/embed/' + youtubeId + '"></iframe>';
}

export default {
    props: ['label', 'name', 'limit', 'placeholder', 'value', 'position', 'description', 'required'],
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
            exts: ['youtube'],
            events: {
                change: (e) => {
                    this.val = this.editor.getValue();
                    this.$emit('input', this.val);
                }
            }
        });
    },

    computed: {
        classes() {
            return {
                'field--error': this.errormessage
            };
        },
    }
}
</script>
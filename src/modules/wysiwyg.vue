<template>
    <div class="field wysiwyg">
        <label class="field__label" @click="focus" :for="id">{{ label }}</label>
        <div class="field__container">
            <textarea class="field__element" :id="id" v-model="val" :name="name"></textarea>
        </div>
    </div>
</template>

<script>
import SimpleMDE from 'SimpleMDE';
import EventBus from '../mixins/event-bus.js';

export default {
    props: ['label', 'name', 'limit', 'placeholder', 'value'],
    data() {
        return {
            id: this._uid,
            element: null,
            mde: null,
            val: this.value
        }
    },

    methods: {
        focus() {
            this.mde.codemirror.focus();
        }
    },

    mounted() {
        this.element = document.getElementById(this._uid);
        this.mde = new SimpleMDE({
            element: this.element,
            placeholder: this.placeholder,
            spellChecker: false,
            status: false
        });

        this.mde.codemirror.on('change', () => {
            this.val = this.mde.value();
            this.$emit('input', this.val);
        });

        // This fixes the issue with codemirror (wysiwyg) where the initial value does not appear right away.
        // Can be removed safely the day we stop using simplemde.
        EventBus.$on('updateWysiwyg', () => this.mde.codemirror.refresh());
    }
}
</script>
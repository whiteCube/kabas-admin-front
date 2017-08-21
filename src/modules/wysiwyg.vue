<template>
    <div class="field wysiwyg">
        <label class="field__label" @click="focus" :for="id">{{ label }}</label>
        <div class="field__container">
            <textarea class="field__element" :id="id" :name="name"></textarea>
        </div>
    </div>
</template>

<script>
import SimpleMDE from 'SimpleMDE';

export default {
    props: ['label', 'name', 'limit', 'placeholder'],
    data() {
        return {
            id: this._uid,
            element: null,
            mde: null
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
    }
}
</script>
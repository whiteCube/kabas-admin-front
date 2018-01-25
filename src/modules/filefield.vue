<template>
    <div class="field file" :class="classes">
        <label class="field__label" :for="id">{{ label }}</label>
        <div class="field__container">
            <input type="file" :id="id" class="field__element" :name="computedName" @change="update">
            <label :for="id" class="file__label"  @dragenter.prevent="highlight = true" @dragover.prevent="highlight = true" @dragleave="highlight = false" @drop.prevent="update">
                <span class="file__title">
                    <template v-if="file && file.name">{{ file.name }}</template>
                    <template v-else>{{ trans('fields.file.choose') }}</template>
                </span>
                <div class="file__details">
                    <p>{{ trans('fields.file.prompt') }}</p>
                    <p v-if="formats && formats.length">{{ transchoice('fields.file.formats', formats.length) }}: 
                        <em v-for="(format, index) in formats">
                            {{ format }}<template v-if="index < formats.length - 1">, </template>
                        </em>.
                    </p>
                </div>
            </label>
            <transition name="slideDown">
                <p class="field__error" v-if="error">{{ error }}</p>
            </transition>
        </div>
    </div>
</template>

<script>
import FileMethods from '../mixins/file.js';

export default {
    mixins: [FileMethods],

    data() {
        return {
            id: this._uid
        }
    },

    methods: {
        update(e) {
            let file = this.getFile(e) || this.getDroppedFile(e);
            if(!file) return e.preventDefault();
            if(!this.isSupported(file)) return this.showError(this.translations.errors.notsupported, e);
            if(this.exceedsSize(file)) return this.showError(this.translations.errors.size, e);
            this.file = file;
        }
    }
}
</script>
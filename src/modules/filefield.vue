<template>
    <div class="field file" :class="classes">
        <label class="field__label" :for="id">{{ label }}</label>
        <p class="field__description" v-if="description" v-html="description"></p>
        <div class="field__container">
            <input type="file" :id="id" class="field__element" :name="computedName" @change="update">
            <input type="hidden" v-if="!modified" :name="computedName + '[path]'" :value="filePath">
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
                <p class="field__error" v-if="errormessage">{{ errormessage }}</p>
            </transition>
        </div>
    </div>
</template>

<script>
import FileMethods from '../mixins/file.js';

export default {
    mixins: [FileMethods],
    props: ['description', 'value'],

    data() {
        return {
            id: this._uid
        }
    },

    created() {
        if(this.value && typeof this.value == 'string') {
            this.value = JSON.parse(this.value);
        }

        if(this.value && this.value.path) {
            this.encoded = 'url(' + this.value.path + ')';
            this.file = {name: this.value.path};
        }
        if(this.filedata) this.file = this.filedata;
    },

    methods: {
        update(e) {
            let file = this.getFile(e) || this.getDroppedFile(e);
            if(!file) return e.preventDefault();
            if(!this.isSupported(file)) return this.showError(this.translations.errors.notsupported, e);
            if(this.exceedsSize(file)) return this.showError(this.translations.errors.size, e);
            this.file = file;
        }
    },

    computed: {
        filePath() {
            if(!this.value) return '';
            let value = this.value;
            if(this.value && this.value.path) value = this.value.path;
            if(this.value.value && this.value.value.path) value = this.value.value.path;
            return value.replace(/(https?:\/\/[^\/]*\/)/, '');
        }
    }
}
</script>
<template>
    <div class="field file" :class="classes">
        <label class="field__label" :for="id">{{ label }}</label>
        <div class="field__container">
            <input type="file" :id="id" class="field__element" :name="name" @change="update">
            <label :for="id" class="file__label" @dragenter.prevent="highlight = true" @dragover.prevent="highlight = true" @dragleave="highlight = false" @drop.prevent="update">
                <span class="file__title" :title="file.name">
                    <template v-if="file && file.name">{{ filename }}</template>
                    <template v-else>{{ trans('fields.image.choose') }}</template>
                </span>
                <div class="file__details">
                    <p>{{ trans('fields.image.prompt') }}</p>
                    <p v-if="hasSizeConstraints">{{ trans('fields.image.sizes') }}: 
                        <div v-if="hasWidthConstraints">
                            {{ trans('fields.image.width') }}:
                            <template v-for="(constraint, prefix, index) in widthConstraints">
                                {{ prefix }} <em>{{ constraint }}px</em><!--
                             --><template v-if="isLastConstraint(index, widthConstraints)">, </template>
                            </template>
                        </div>
                        <div v-if="hasHeightConstraints">
                            {{ trans('fields.image.height') }}: 
                            <template v-for="(constraint, prefix, index) in heightConstraints">
                                {{ prefix }} <em>{{ constraint }}px</em><!--
                             --><template v-if="isLastConstraint(index, heightConstraints)">, </template>
                            </template>
                        </div>
                    </p>
                    <p v-if="formats && formats.length">{{ transchoice('fields.file.formats', formats.length) }}: 
                        <em v-for="(format, index) in formats">
                            {{ format }}<template v-if="index < formats.length - 1">, </template>
                        </em>.
                    </p>
                </div>
                <transition name="slideRight">
                    <figure class="file__fig" v-if="file" :style="{ 'background-image': encoded }"></figure>
                </transition>
            </label>
            <transition name="slideDown">
                <div v-if="file" class="file__alt textfield">
                    <label class="field__label" :for="id + '_alt'">{{ trans('fields.image.alt') }}</label>
                    <div class="field__container">
                        <input type="text" :id="id + '_alt'" v-model="altText" @input="updateAlt" :name="name + '_alt'" class="field__element" :placeholder="altPlaceholder">
                    </div>
                </div>
            </transition>
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

    props: ['minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'width', 'height', 'altPlaceholder', 'value', 'alt', 'filedata'],

    data() {
        return {
            id: this._uid,
            encoded: '',
            altText: this.alt,
            highlight: false
        }
    },

    created() {
        this.encoded = 'url(' + this.value + ')';
        this.file = this.filedata ? this.filedata : { name: this.value };
    },

    methods: {
        update(e) {
            let file = this.getFile(e) || this.getDroppedFile(e);
            if(!file) return e.preventDefault();
            if(!this.isSupported(file)) return this.showError(this.trans('fields.image.errors.notsupported'), e);
            if(this.exceedsSize(file)) return this.showError(this.trans('fields.image.errors.size'), e);
            this.checkDimensions(file, (passes) => {
                if(!passes) return this.showError(this.trans('fields.image.errors.dimensions'), e);
                this.hideError();
                this.setBase64(file);
                this.file = file;
            });
        },

        checkDimensions(file, callback) {
            let img = new Image();
            img.addEventListener('load', () => {
                let condition = true;
                if(this.hasProp('minWidth')) condition = condition && img.width >= this.minWidth;
                if(this.hasProp('minHeight')) condition = condition && img.height >= this.minHeight;
                if(this.hasProp('maxWidth')) condition = condition && img.width <= this.maxWidth;
                if(this.hasProp('maxHeight')) condition = condition && img.height <= this.maxHeight;
                if(this.hasProp('width')) condition = condition && img.width == this.width;
                if(this.hasProp('height')) condition = condition && img.height == this.height;
                callback(condition);
            });
            img.src = URL.createObjectURL(file);
        },

        setBase64(file) {
            if(!file) return '';
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => { 
                this.encoded = 'url(' + reader.result + ')';
                this.$emit('input', { value: this.encoded, alt: this.altText, file });
            });
        },

        isLastConstraint(index, constraints) {
            return index < Object.keys(constraints).length - 1;
        },

        updateAlt(value) {
            this.$emit('input', { value: this.encoded, alt: this.altText, file: this.file });
        }
    },

    computed: {
        classes() {
            return {
                'file--expanded': !!this.file,
                'field--error': this.error,
                'file--highlighted': this.highlight
            }
        },

        hasSizeConstraints() {
            return this.hasWidthConstraints || this.hasHeightConstraints;
        },

        hasWidthConstraints() {
            return this.hasProp('minWidth') || this.hasProp('width') || this.hasProp('maxWidth');
        },

        hasHeightConstraints() {
            return this.hasProp('minHeight') || this.hasProp('height') || this.hasProp('maxHeight');
        },

        widthConstraints() {
            let constraints = {};
            if(this.hasProp('minWidth')) constraints[this.trans('fields.image.min')] = this.minWidth;
            if(this.hasProp('width')) constraints[''] = this.width;
            if(this.hasProp('maxWidth')) constraints[this.trans('fields.image.max')] = this.maxWidth;
            return constraints;
        },

        heightConstraints() {
            let constraints = {};
            if(this.hasProp('minHeight')) constraints[this.trans('fields.image.min')] = this.minHeight;
            if(this.hasProp('height')) constraints[''] = this.height;
            if(this.hasProp('maxHeight')) constraints[this.trans('fields.image.max')] = this.maxHeight;
            return constraints;
        },

        filename() {
            return this.file.name.length > 70 ? this.file.name.substring(0, 70) + '...' : this.file.name;
        }
    },

    watch: {
        value(newVal) {
            this.encoded = newVal.indexOf('url(') > -1 ? newVal : 'url(' + newVal + ')'; 
        },

        alt(newVal) {
            this.altText = newVal;
        },

        filedata(newVal) {
            if(!newVal || !newVal.name) newVal = { name: 'undefined file name' };
            this.file = newVal;
        }
    }
}
</script>
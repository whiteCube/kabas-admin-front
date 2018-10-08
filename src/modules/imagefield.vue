<template>
    <div class="field file" :class="classes">
        <label class="field__label" :for="id">{{ label }}</label>
        <p class="field__description" v-if="description" v-html="description"></p>
        <div class="field__container">
            <input type="file" :id="id" class="field__element" :name="computedName + '[file]'" @change="update">
            <input type="hidden" v-if="!modified" :name="computedName + '[path]'" :value="filePath">
            <label tabindex="0" :for="id" class="file__label" @dragenter.prevent="highlight = true" @dragover.prevent="highlight = true" @dragleave="highlight = false" @drop.prevent="update">
                <span class="file__title">
                    <!-- <span :title="file.name" v-if="file && file.name">{{ filename }}</span> -->
                    <!-- <template v-else>{{ trans('fields.image.choose') }}</template> -->
                    <template>{{ trans('fields.image.choose') }}</template>
                </span>
                <div class="file__details">
                    <p>{{ trans('fields.image.prompt') }}</p>
                    <div v-if="hasSizeConstraints">{{ trans('fields.image.sizes') }}: 
                        <div v-if="hasWidthConstraints">
                            {{ trans('fields.image.width') }}:
                            <span v-for="(constraint, prefix, index) in widthConstraints" v-bind:key="index">
                                {{ prefix }} <em>{{ constraint }}px</em><!--
                             --><template v-if="isLastConstraint(index, widthConstraints)">, </template>
                            </span>
                        </div>
                        <div v-if="hasHeightConstraints">
                            {{ trans('fields.image.height') }}: 
                            <span v-for="(constraint, prefix, index) in heightConstraints" v-bind:key="index">
                                {{ prefix }} <em>{{ constraint }}px</em><!--
                             --><template v-if="isLastConstraint(index, heightConstraints)">, </template>
                            </span>
                        </div>
                    </div>
                    <p v-if="formats && formats.length">{{ transchoice('fields.file.formats', formats.length) }}: 
                        <em v-for="(format, index) in formats" v-bind:key="index">
                            {{ format }}<template v-if="index < formats.length - 1">, </template>
                        </em>.
                    </p>
                </div>
                <transition name="slideRight">
                    <figure class="file__fig" v-if="file" :style="{ 'background-image': encoded }"></figure>
                </transition>
            </label>
            <transition name="slideDown">
                <div v-if="file && !hasProp('noAlt')" class="file__alt textfield">
                    <label class="field__label" :for="id + '[alt]'">{{ trans('fields.image.alt') }}</label>
                    <div class="field__container">
                        <input type="text" :id="id + '[alt]'" v-model="altText" @input="updateAlt" :name="computedName + '[alt]'" class="field__element" :placeholder="altPlaceholder" :required="required">
                    </div>
                </div>
            </transition>
            <transition name="slideDown">
                <p class="field__error" v-if="errormessage">{{ errormessage }}</p>
            </transition>
        </div>
    </div>
</template>

<script>
/*
Todo:
Investigate why image preview does not display anything after navigating through nested fields
*/
import FileMethods from '../mixins/file.js';

export default {
    mixins: [FileMethods],

    props: ['minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'width', 'height', 'altPlaceholder', 'value', 'filedata', 'description', 'noAlt'],

    data() {
        return {
            id: this._uid,
            encoded: '',
            altText: this.value && this.value.alt ? this.value.alt : '',
            highlight: false,
            modified: false
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
            this.modified = true;
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
                this.$emit('input', { path: this.encoded, alt: this.altText, file });
            });
        },

        isLastConstraint(index, constraints) {
            return index < Object.keys(constraints).length - 1;
        },

        updateAlt(value) {
            this.$emit('input', { path: this.encoded, alt: this.altText, file: this.file });
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
        },

        filePath() {
            if(!this.value) return '';
            let value = this.value;
            if(this.value && this.value.path) value = this.value.path;
            if(this.value.value && this.value.value.path) value = this.value.value.path;
            return value.replace(/(https?:\/\/[^\/]*\/)/, '');
        }
    },

    watch: {
        value(newVal) {
            if(!newVal.path) return;
            this.encoded = newVal.path.indexOf('url(') > -1 ? newVal.path : 'url(' + newVal.path + ')'; 
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
<template>
    <div class="field color color--hex" :class="classes">
        <label class="field__label" :for="randomID">{{ label }}</label>
        <div class="field__container">
            <div class="color__border">
                <transition name="picker" mode="out-in">
                <div class="color__input" v-if="!expanded">
                    <a href="#" class="color__type" @click.prevent="changeType">{{ type }}</a>
                    <input type="text" class="field__element" :name="name" :id="randomID" :placeholder="placeholder" v-model="val" @blur="update">
                    <a href="#" class="color__expander" @click.prevent="expanded = true">
                        <span class="color__preview" :style="{ background: val ? val : '#000' }"></span>
                        <span class="sro">Edit color</span>
                    </a>
                </div>
                <colorpicker v-else :value="val" @finish="pickerFinish"></colorpicker>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import colorpicker from './colorpicker.vue';
import tinycolor from 'tinycolor2';

export default {
    props: ['placeholder', 'name', 'value', 'label'],
    components: { colorpicker },
    data() {
        return {
            expanded: false,
            randomID: this._uid,
            type: 'hex',
            val: ''
        }
    },

    mounted() {
        this.val = this.value;
    },

    methods: {
        pickerFinish(value) {
            this.expanded = false;
            this.val = value;
            this.update();
        },

        update() {
            if(!this.val) return;
            this.$emit('input', this.val);
            let color = tinycolor(this.val);
            if(this.type == 'rgb') return this.val = color.toRgbString();
            return this.val = color.toHexString().toUpperCase();
        },

        changeType() {
            this.type = this.type == 'hex' ? 'rgb' : 'hex';
            this.update();
        }
    },

    computed: {
        classes() {
            let classes = {
                'color--expanded': this.expanded
            };
            classes['color--' + this.type] = true;
            return classes;
        }
    }
}
</script>
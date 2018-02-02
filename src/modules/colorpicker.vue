<template>
    <div class="color__picker">
        <label class="field__label">{{ trans('fields.color.hue') }}</label>
        <p class="field__description" v-if="description" v-html="description"></p>
        <div class="color__range color__range--hue" @click="click($event, 'h')">
            <span class="color__handle" tabindex="0" @keydown.left="decrease('h')" @keydown.right="increase('h')" @mousedown="startDrag" :style="{ left: handle('h', hsl.h) + '%' }"></span>
        </div>
        <label class="field__label">{{ trans('fields.color.sat') }}</label>
        <div class="color__range color__range--saturation" @click="click($event, 's')" :style="{ background: saturationBg }">
            <span class="color__handle" tabindex="0"  @keydown.left="decrease('s')" @keydown.right="increase('s')" @mousedown="startDrag" :style="{ left: handle('s', hsl.s) + '%' }"></span>
        </div>
        <label class="field__label">{{ trans('fields.color.lum') }}</label>
        <div class="color__range color__range--luminosity" @click="click($event, 'l')" :style="{ background: luminosityBg }">
            <span class="color__handle"  @keydown.left="decrease('l')" @keydown.right="increase('l')" tabindex="0" @mousedown="startDrag" :style="{ left: handle('l', hsl.l) + '%' }"></span>
        </div>
        <div class="color__footer">
            <div class="color__data">
                <span class="color__preview" :style="{ background: hex }"></span>
                <div class="color__line">
                    <span class="color__label">{{ trans('fields.color.red') }}:</span>
                    <input type="number" class="color__value" min="0" @change="update(rgb)" v-model="rgb.r" @blur="update(rgb)">
                    <span class="color__label">{{ trans('fields.color.green') }}:</span>
                    <input type="number" class="color__value" min="0" @change="update(rgb)" v-model="rgb.g" @blur="update(rgb)">
                    <span class="color__label">{{ trans('fields.color.blue') }}:</span>
                    <input type="number" class="color__value" min="0" @change="update(rgb)" v-model="rgb.b" @blur="update(rgb)">
                </div>
                <div class="color__line">
                    <span class="color__label">Hex:</span>
                    <input type="text" class="color__value color__value--hex" v-model="hex" @blur="update(hex)">
                </div>
            </div>
            <a href="#" class="btn btn--tiny" @click.prevent="cancel">{{ trans('fields.color.cancel') }}</a>
            <a href="#" class="btn btn--tiny btn--secondary" @click.prevent="finish">{{ trans('fields.color.finish') }}</a>
        </div>
    </div>
</template>

<script>
import tinycolor from 'tinycolor2';

export default {
    props: ['value', 'translations', 'description'],

    data() {
        return {
            hsl: { h: 0, s: 0, l: 0 },
            rgb: { r: 0, g: 0, b: 0 },
            hex: '#000000',
            initial: '#000000',
            dragging: false,
            draggingSlider: null,
            startingPoint: 0
        }
    },

    created() {
        this.initial = this.value;
        this.update(this.value);
    },

    methods: {
        update(source) {
            let color = tinycolor(source);
            this.hex = color.toHexString().toUpperCase();
            this.rgb = color.toRgb();
            this.hsl = color.toHsl();
        },

        handle(type, value) {
            if(type === 'h') return (( value / 360 ) * 100);
            return (value * 100);
        },

        startDrag(e) {
            this.dragging = true;
            this.draggingSlider = e.target.parentNode;
            this.startingPoint = e.clientX;
            document.addEventListener('mousemove', this.drag);
            document.addEventListener('mouseup', this.stopDrag);
        },

        stopDrag() {
            document.removeEventListener('mousemove', this.drag)
            document.removeEventListener('mouseup', this.stopDrag)
        },

        drag(e) {
            if(!this.dragging) return;
            let deltaX = e.clientX - this.startingPoint;
            this.startingPoint = e.clientX;
            let offsetPercent = ( deltaX / this.draggingSlider.offsetWidth ) * 100;
            this.addOffset(offsetPercent);
        },

        addOffset(offsetPercent) {
            let type = this.getCurrentSlider();
            let scale = this.getScale(type);
            let pos = (this.handle(type, this.hsl[type]) + offsetPercent) * scale;
            this.apply(scale, type, pos);
        },

        apply(scale, type, pos) {
            if(pos > 99.999 * scale) pos = 99.999 * scale;
            if(pos <= 1) pos = 0.001;
            this.hsl[type] = pos;
            this.update(this.hsl);
        },

        click(e, type) {
            if(this.dragging) return this.dragging = false;
            let scale = this.getScale(type);
            let pos = (e.offsetX / e.target.offsetWidth) * 100 * scale;
            this.apply(scale, type, pos);
        },

        getCurrentSlider() {
            return this.draggingSlider.className
                   .replace('color__range color__range--', '')
                   .charAt(0);
        },

        getScale(type) {
            return type == 'h' ? 3.6 : 1;
        },

        cancel() {
            this.$emit('finish', this.initial);
        },

        finish() {
            this.update(this.hsl);
            this.$emit('finish', this.hex);
        },

        increase(source) {
            let amount = source == 'h' ? 5 : 0.01;
            this.hsl[source] += amount;
            this.update(this.hsl);
        },

        decrease(source) {
            let amount = source == 'h' ? 5 : 0.01;
            this.hsl[source] -= amount;
            this.update(this.hsl);
        }

    },

    computed: {
        saturationBg() {
            let hue = tinycolor({h: this.hsl.h, s: 1, l: 0.5});
            return `linear-gradient(to right, #eee, ${hue.toHexString()})`;
        },

        luminosityBg() {
            let hue = tinycolor({h: this.hsl.h, s: 1, l: 0.5});
            return `linear-gradient(to right, #000, ${hue.toHexString()}, #fff)`;
        }
    }
}
</script>
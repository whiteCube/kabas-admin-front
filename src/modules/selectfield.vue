<template>
    <div class="field select" :class="classes">
        <label class="field__label" :for="id">{{ label }}</label>
        <div class="field__container">
            <select v-model="selected" :name="name" :id="id" class="sro">
                <option value="">{{ this.trans('fields.select.prompt') }}</option>
                <option :value="key" v-for="(item, key) in options">{{ item }}</option>
            </select>
            <p class="field__element" @click="expanded = !expanded">{{ selected ? options[selected] : trans('fields.select.prompt') }}</p>
            <transition name="slideDown">
            <div v-if="expanded" class="select__dropdown">

                <div v-if="withSearch" class="select__searchbox">
                    <input type="text" @focus="isTyping = true" @blur="isTyping = false" @keyup.esc="expanded = false" @keyup.enter="selectItem(Object.keys(filtered)[0])" v-model="search" :placeholder="trans('fields.select.search')" class="select__search select__option">
                    <a class="select__clear" v-if="search" @click="search = ''">
                    <span class="sro">{{ trans('fields.select.clearsearch') }}</span>
                    </a>
                </div>
                <div key="nomatch" v-if="Object.keys(filtered).length == 0" class="select__option select__nomatches">{{ trans('fields.select.noresults') }}</div>
                <transition-group class="select__results" name="slide">
                <a :class="optionClasses(index)" :data-focus="trans('fields.select.focus')" :key="index" @keyup.esc="expanded = false" v-for="(item, index) in filtered" @keyup.enter="selectItem(index)" @click.prevent="selectItem(index)" class="select__option" tabindex="0">
                    {{ item }}
                </a>
                </transition-group>
                
            </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    props: ['label', 'name', 'options', 'value', 'showSearch'],

    data() {
        return {
            val: '',
            selected: this.value,
            expanded: false,
            id: this._uid,
            search: '',
            isTyping: false
        }
    },

    created() {
        this.val = this.value;
    },

    methods: {
        selectItem(index) {
            this.selected = index;
            this.expanded = false;
            this.$emit('input', this.options[this.selected]);
        },


        optionClasses(index) {
            let pos = Object.keys(this.filtered).indexOf(index);
            return {
                'select__option--focus': this.search && pos == 0 && this.isTyping
            }
        }
    },

    computed: {
        classes() {
            return {
                'select--expanded': this.expanded
            }
        },

        filtered() {
            if(this.search == '') return this.options;

            let results = {};
            for(let option in this.options) {
                if(this.options[option].like('%' + this.search + '%')) results[option] = this.options[option];
            }
            return results;
        },

        withSearch() {
            return this.showSearch || Object.keys(this.options).length > 5;
        }
    }
}
</script>
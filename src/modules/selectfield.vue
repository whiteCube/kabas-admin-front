<template>
    <div class="field select" :class="classes">
        <label class="field__label" :for="id">{{ label }}</label>
        <p class="field__description" v-if="description" v-html="description"></p>
        <div class="field__container">
            <select :multiple="hasProp('multiple')" v-model="selected" :name="nameAttribute" :id="id" class="sro" :required="required">
                <option>{{ this.trans('fields.select.prompt') }}</option>
                <option :value="key" v-for="(item, key) in options" v-bind:key="key">{{ item }}</option>
            </select>
            <p class="field__element" @click="expanded = !expanded">
                <template v-if="selected && selected.length">
                    <template v-if="typeof selected == 'object'">
                        <transition-group name="fade">
                        <span :key="key" class="select__selected" v-for="(item, key) in selected">{{ options[item.toString()] }}</span>
                        </transition-group>
                    </template>
                    <template v-else>{{ options[selected.toString()] }}</template>
                </template>
                <template v-else>{{ trans('fields.select.prompt') }}</template>
            </p>
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
    props: ['label', 'name', 'options', 'value', 'showSearch', 'multiple', 'position', 'description', 'readonly', 'max', 'required'],

    data() {
        return {
            val: '',
            selected: this.hasProp('multiple') ? [] : '',
            expanded: false,
            id: this._uid,
            search: '',
            isTyping: false
        }
    },

    created() {
        this.val = this.value;
        if(!this.value) return;

        // Convert values to strings, cause we're working with JSON and cannot have integer keys
        if(typeof this.val == 'object') {
            for(var i = 0; i < this.val.length; i++) {
                this.val[i] = this.val[i].toString();
            }
        } else {
            this.val = this.val.toString();
        }

        this.selected = this.val;

        this.$store.commit('registerField', {
            name: this.computedName,
            type: 'select',
            value: this.selected,
            multiple: this.hasProp('multiple') || this.multiple
        });
    },

    methods: {
        selectItem(index) {
            if(this.hasProp('readonly')) return;
            if(this.hasProp('multiple')) {
                this.toggleSelected(index);
            } else {
                this.selected = index;
            }
            this.$emit('input', this.options[this.selected]);
            if(!this.hasProp('multiple')) return this.expanded = false;
        },

        toggleSelected(index) {
            let i = this.selected.indexOf(index);
            if(this.selected.includes(index)) return this.selected.splice(i, 1);
            if(this.selected.length >= parseInt(this.max)) return;
            this.selected.push(index);
        },

        optionClasses(index) {
            let pos = Object.keys(this.filtered).indexOf(index);
            return {
                'select__option--focus': pos == 0 && this.isTyping,
                'select__option--selected': this.selected == index || (typeof this.selected == 'object' && this.selected.indexOf(index) > -1)
            }
        },

        getUpdateValue() {
            return this.selected;
        }
    },

    computed: {
        nameAttribute() {
            if (this.hasProp('multiple')) return this.computedName + '[]';
            return this.computedName;
        },

        classes() {
            return {
                'select--readonly': this.hasProp('readonly'),
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
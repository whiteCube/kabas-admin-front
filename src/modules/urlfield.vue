<template>
    <div class="field url select" :class="classes">
        <label class="field__label" :for="id">{{ label }}</label>
        <div class="field__container">
            <a class="url__switcher" @click.prevent="switchType">{{ trans('fields.url.' + type) }}</a>
            <input type="text" @keyup.esc="expanded = false" class="field__element" :id="id" v-model="url" :name="name" :placeholder="placeholder" :value="value" @focus="autocomplete" @input="autocomplete" >
            <transition name="slideDown">
            <div v-if="expanded" class="select__dropdown">
                <transition-group class="select__results" name="slide">
                <a :key="index" v-for="(item, index) in items" tabindex="0" :data-focus="trans('fields.select.focus')"  @keyup.esc="expanded = false" @keyup.enter="selectItem(index)" @click.prevent="selectItem(index)" class="select__option">
                    {{ item.name }}
                    <span class="url__route">{{ item.url }}</span>
                </a>
                </transition-group>
            </div>
            </transition>
        </div>
    </div>
</template>

<script>
import Axios from 'axios';

export default {
    props: ['label', 'name', 'placeholder', 'value', 'translations', 'ajaxUrl'],
    data() {
        return {
            type: 'external',
            expanded: false,
            url: '',
            items: [],
            id: this._uid
        }
    },

    created() {
        Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    },

    methods: {
        switchType() {
            this.type = this.type == 'internal' ? 'external' : 'internal';
            if(this.type == 'internal' && this.url.length) return this.query();
            this.expanded = false;
        },

        query() {
            Axios.get(this.ajaxUrl)
            .then(response => {
                this.items = response.data.results;
                this.expanded = !!this.items.length;
            })
            .catch(error => console.error(error));
        },

        selectItem(index) {
            this.url = this.items[index].name;
            this.expanded = false;
        },

        showifinternal() {
            if(this.type != 'internal') return;
            this.expanded = true;
        },

        autocomplete(e) {
            this.$emit('input', e.target.value);
            if(this.type == 'external') return this.expanded = false;
            this.query();
        }
    },

    computed: {
        classes() {
            return {
                'url--expanded': this.expanded,
                'url--internal': this.type == 'internal'
            }
        }
    }
}
</script>
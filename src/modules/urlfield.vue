<template>
    <div class="field url select" :class="classes">
        <label class="field__label" :for="id">{{ label }}</label>
        <div class="field__container">
            <a class="url__switcher" @click.prevent="switchType">{{ trans('fields.url.' + type) }}</a>
            <input type="text" class="field__element" :id="id" v-model="url" :name="name" :placeholder="placeholder" :value="value" @input="autocomplete" @blur="expanded = false">
            <transition name="slideDown">
            <div v-if="expanded" class="select__dropdown">
                <a v-for="(item, index) in items" @click.prevent="selectItem(index)" class="select__option">
                    {{ item.name }}
                    <span class="url__route">{{ item.url }}</span>
                </a>
            </div>
            </transition>
        </div>
    </div>
</template>

<script>
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

    methods: {
        switchType() {
            this.type = this.type == 'internal' ? 'external' : 'internal';
            if(this.type == 'internal' && this.url.length) return this.query();
            this.expanded = false;
        },

        query() {
            // TODO: ask the server if pages match the current input. Hardcoded for now
            // The AJAX url is available as this.ajaxUrl
            this.items = [
                {
                    url: '/code-examples',
                    name: 'Code examples'
                },
                {
                    url: '/contact',
                    name: 'Contact'
                },
                {
                    url: '/contests',
                    name: 'Contests'
                }
            ];
            
            this.expanded = !!this.items.length;
        },

        selectItem(index) {
            this.url = this.items[index].name;
            this.expanded = false;
        },

        autocomplete(e) {
            this.$emit('input', e.target.value);
            if(this.type == 'external' || !this.url.length) return this.expanded = false;
            this.query();
        }
    },

    computed: {
        classes() {
            return {
                'url--expanded': this.expanded
            }
        }
    }
}
</script>
<template>
    <div class="field select" :class="classes">
        <label class="field__label" :for="id">{{ label }}</label>
        <div class="field__container">
            <select v-model="selected" :name="name" :id="id" class="sro">
                <option value="">{{ this.trans('fields.select.prompt') }}</option>
                <option :value="key" v-for="(item, key) in items">{{ item }}</option>
            </select>
            <p class="field__element" @click="expanded = !expanded">{{ items[selected] }}</p>
            <transition name="slideDown">
            <div v-if="expanded" class="select__dropdown">
                <a v-for="(item, index) in items" @click.prevent="selectItem(index)" class="select__option">
                    {{ item }}
                </a>
            </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    props: ['label', 'name', 'items', 'value'],

    data() {
        return {
            val: '',
            selected: this.value,
            expanded: false,
            id: this._uid
        }
    },

    created() {
        this.val = this.value;
    },

    methods: {
        selectItem(index) {
            this.selected = index;
            this.expanded = false;
        }
    },

    computed: {
        classes() {
            return {
                'select--expanded': this.expanded
            }
        }
    }
}
</script>
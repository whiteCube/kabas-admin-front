<template>
    <div class="field group" :class="classes">
        <label class="field__label" v-if="level == 0">
            <template v-for="(crumb, index) in crumbs">
                <transition name="slideLeft">
                <a v-if="index <= lastcrumb" @click="navigateSub(crumb.level)" class="group__crumb"><span v-if="index > 0 && index <= lastcrumb" class="group__crumbseparator"></span>{{ crumb.label }}</a>
                </transition>
            </template>
        </label>
        <div class="field__container">
            <a v-show="showsub" class="group__backlink" @click.prevent="hideSubfield">{{ trans('fields.group.backlink', label) }}</a>
            <template v-for="(field, index) in options">

                <template v-if="field.type == 'group'">
                    <div class="group__nested" v-show="shouldDisplay(field, 'group')" >
                        <a class="group__peek" v-show="!showsub" @click.prevent="showSubfield(field, level + 1)">
                            <label class="field__label">{{ field.label }}
                                <span class="group__subcount">{{ trans('fields.group.subgroupitems', Object.keys(field.options).length) }}</span>
                            </label>
                            <span class="group__action">{{ trans('fields.group.editgroup') }}</span>
                        </a>
                        <transition name="slide">
                        <div class="group__sub" v-show="showsub == field">
                            <groupfield ref="sub" :label="field.label" :values="values[index]" :options="field.options" :nestinglevel="level + 1"></groupfield>
                        </div>
                        </transition>
                    </div>
                </template>

                <template v-if="field.type == 'repeater'">
                <div class="group__nested" v-show="shouldDisplay(field, 'repeater')" >
                    <a class="group__peek" v-show="!showsub" @click.prevent="showSubfield(field, level + 1)">
                        <label class="field__label">{{ field.label }}
                            <span class="group__subcount">{{ trans('fields.group.subgroupitems', Object.keys(field.options).length) }}</span>
                        </label>
                        <span class="group__action">{{ trans('fields.group.editgroup') }}</span>
                    </a>
                    <transition name="slide">
                    <div class="group__sub" v-show="showsub == field">
                        <repeater ref="sub" :label="field.label" :items="values[index]" :structure="field.options" :nestinglevel="level + 1"></repeater>
                    </div>
                    </transition>
                </div>
                </template>

                <div class="group__nested" v-if="shouldDisplay(field, 'gallery')">
                    <label class="field__label">{{ field.label }}</label>
                    <a class="group__action" @click.prevent="showSubfield(field)">{{ trans('fields.group.editgallery') }}</a>
                    <transition name="slide">
                    <div class="group__sub" v-show="showsub == field">
                        <groupfield label="" :options="field.options"></groupfield>
                    </div>
                    </transition>
                </div>

                <div class="group__nested" v-if="shouldDisplay(field, 'flexible')">
                    <label class="field__label">{{ field.label }}</label>
                    <a class="group__action" @click.prevent="showSubfield(field)">{{ trans('fields.group.editflexible') }}</a>
                    <transition name="slide">
                    <div class="group__sub" v-show="showsub == field">
                        <groupfield label="" :options="field.options"></groupfield>
                    </div>
                    </transition>
                </div>
                <transition name="slide">
                <genericfield v-if="!isNestable(field) && !showsub" :value="values ? values[index] : null" :structure="field" @input="transferInput($event, index)" :key="index"></genericfield>
                </transition>
            </template>
        </div>
    </div>
</template>

<script>

/*
Todo:
Add flexible
Add gallery
*/

export default {
    props: ['label', 'options', 'values', 'nestinglevel'],

    data() {
        return {
            nestable: ['group', 'flexible', 'repeater', 'gallery'],
            showsub: false,
            crumbs: [],
            lastcrumb: 0,
            level: 0
        }
    },

    created() {
        for(let key in this.options) {
            if(this.isNestable(this.options[key])) {
                this.options[key].showsub = false;
            }
        }

        this.level = this.hasProp('nestinglevel') ? this.nestinglevel : 0;
        this.crumbs.push({label: this.label, level: this.level});

        this.$on('showsub', data => {
            if(this.level > 0) return this.$parent.$emit('showsub', data);
            this.lastcrumb = data.level;
            this.crumbs[data.level] = data;
        });

        this.$on('hidesub', level => {
            if(this.level > 0) return this.$parent.$emit('hidesub', level);
            this.lastcrumb = level;
        });
    },

    methods: {
        transferInput(value, index) {
            this.$emit('input', {value, index});
        },

        is(field, ...types) {
            return types.indexOf(field.type) > -1;
        },

        isNestable(field) {
            return this.nestable.indexOf(field.type) > -1;
        },

        shouldDisplay(field, type) {
            return (this.is(field, type) && this.showsub == field) || (this.is(field, type) && !this.showsub)
        },

        showSubfield(field, level) {
            this.showsub = field;
            this.$emit('showsub', {label: field.label, level});
            this.lastcrumb = level;
            this.$forceUpdate();
        },

        navigateSub(level) {
            this.$emit('hidesub', level);
            this.hideRecursivelyUntil(level);
        },

        hideRecursivelyUntil(level) {
            if(this.level >= level) this.showsub = false;
            if(!this.$refs.sub) return;
            this.$refs.sub[0].hideRecursivelyUntil(level);
        },

        hideSubfield() {
            this.$emit('hidesub', this.level);
            this.$refs.sub[0].showsub = false;
            this.showsub = false;
        },

    },

    computed: {
        classes() {
            return {
                'group--showsub': this.showsub
            }
        }
    }
}
</script>
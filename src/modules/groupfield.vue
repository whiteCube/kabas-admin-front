<template>
    <div class="field group" :class="classes">
        <label class="field__label" v-if="level == 0">
            <template v-for="(crumb, index) in crumbs">
                <transition name="slideLeft">
                <a v-if="index <= lastcrumb" @click="navigateSub(crumb)" class="group__crumb"><span v-if="index > 0 && index <= lastcrumb" class="group__crumbseparator"></span>{{ crumb.label }}</a>
                </transition>
            </template>
        </label>
        <div class="field__container">
            <a v-show="showsub" class="group__backlink" @click.prevent="hideSubfield">{{ trans('fields.group.backlink', label) }}</a>
            <template v-for="(field, index) in options">

                <template v-if="field.type == 'group'">
                    <div class="group__nested" v-show="shouldDisplay(field, 'group')" >
                        <a class="group__peek" v-show="!showsub" @click.prevent="showSubfield(field, level + 1, index)">
                            <label class="field__label">{{ field.label }}
                                <span class="group__subcount">{{ transchoice('fields.group.subgroupitems', Object.keys(field.options).length) }}</span>
                            </label>
                            <span class="group__action">{{ trans('fields.group.editgroup') }}</span>
                        </a>
                        <transition name="slide">
                        <div class="group__sub" v-show="showsub == field">
                            <groupfield :ref="index" :label="field.label" :values="values[index]" :options="field.options" :nestinglevel="level + 1"></groupfield>
                        </div>
                        </transition>
                    </div>
                </template>

                <template v-if="field.type == 'repeater'">
                <div class="group__nested" v-show="shouldDisplay(field, 'repeater')" >
                    <a class="group__peek" v-show="!showsub" @click.prevent="showSubfield(field, level + 1, index)">
                        <label class="field__label">{{ field.label }}
                            <span class="group__subcount">{{ transchoice('fields.group.subrepeateritems', values[index].length) }}</span>
                        </label>
                        <span class="group__action">{{ trans('fields.group.editrepeater') }}</span>
                    </a>
                    <transition name="slide">
                    <div class="group__sub" v-show="showsub == field">
                        <repeater :ref="index" :label="field.label" :items="values[index]" :structure="field.options" :nestinglevel="level + 1"></repeater>
                    </div>
                    </transition>
                </div>
                </template>

                <template v-if="field.type == 'gallery'">
                <div class="group__nested" v-show="shouldDisplay(field, 'gallery')" >
                    <a class="group__peek" v-show="!showsub" @click.prevent="showSubfield(field, level + 1, index)">
                        <label class="field__label">{{ field.label }}
                            <span class="group__subcount">{{ transchoice('fields.group.subgalleryitems', values[index].length) }}</span>
                        </label>
                        <span class="group__action">{{ trans('fields.group.editgallery') }}</span>
                    </a>
                    <transition name="slide">
                    <div class="group__sub" v-show="showsub == field">
                        <gallery :ref="index" :label="field.label" :items="values[index]" :structure="field.options" :nestinglevel="level + 1"></gallery>
                    </div>
                    </transition>
                </div>
                </template>

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
Investigate why we have an error if we dont give an initial value to a nested field
Add flexible
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

        showSubfield(field, level, index) {
            this.showsub = field;
            this.$emit('showsub', {label: field.label, level, index});
            this.lastcrumb = level;
            this.$forceUpdate();

            // This fixes the issue with codemirror (wysiwyg) where the initial value does not appear right away.
            // Can be removed safely the day we stop using simplemde.
            setTimeout(() => {
                document.dispatchEvent(new Event('update'));
            }, 1);
        },

        navigateSub(crumb, index) {
            this.$emit('hidesub', crumb.level);
            this.hideRecursivelyUntil(crumb.level, crumb.index);
        },

        hideRecursivelyUntil(level, index) {
            if(this.level >= level) this.showsub = false;
            if(!this.$refs[index]) return;
            this.$refs[index][0].hideRecursivelyUntil(level);
        },

        hideSubfield() {
            this.$emit('hidesub', this.level);
            for(let key in this.$refs) { this.$refs[key][0].showsub = false; }
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
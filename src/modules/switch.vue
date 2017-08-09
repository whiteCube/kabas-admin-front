<template>
    <a class="switcher__item" :class="classes">
        <span class="sro">
            <slot></slot>
        </span>
    </a>
</template>

<script>
export default {
    props: ['icon', 'active'],
    computed: {
        classes() {
            let classes = {
                'switcher__item--active': this.hasProp('active')
            };

            if(this.hasProp('icon')) classes['switcher__item--' + this.icon] = true;

            return classes;
        }
    }
}
</script>
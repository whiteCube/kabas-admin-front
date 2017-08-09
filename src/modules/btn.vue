<template>
    <a class="btn" :class="classes">
        <slot></slot>
    </a>
</template>

<script>
export default {
    props: ['primary', 'secondary', 'tiny', 'icon'],
    computed: {
        classes() {
            let classes = { 
                'btn--primary': this.hasProp('primary'), 
                'btn--secondary': this.hasProp('secondary'), 
                'btn--tiny': this.hasProp('tiny'),
            };

            if(this.hasProp('icon')) {
                classes['btn--icon'] = true;
                classes['btn--' + this.icon] = true;
            }
            
            return classes;
        }
    }
}
</script>
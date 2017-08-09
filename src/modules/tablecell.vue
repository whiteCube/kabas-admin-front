<template>
    <div class="table__col" :class="classes" :aria-labelledby="label">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: ['main', 'right', 'label'],
    computed: {
        classes() {
            return { 
                'table__col--main': this.hasProp('main'),
                'table__col--right': this.hasProp('right')
            };
        }
    }
}
</script>
<template>
    <div class="table__heading table__col" :class="classes">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: ['main', 'right'],
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
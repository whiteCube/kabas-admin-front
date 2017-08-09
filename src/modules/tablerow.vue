<template>
    <a class="table__row" :class="{ 'table__row--danger': this.hasProp('danger') }">
        <slot></slot>
    </a>
</template>

<script>
export default {
    props: ['danger']
}
</script>
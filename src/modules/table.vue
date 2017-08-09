<template>
    <div class="table" :class="{ 'table--numbered': this.hasProp('numbered') }">
        <div class="table__element">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: ['numbered']
}
</script>
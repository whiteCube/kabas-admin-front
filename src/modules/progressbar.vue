<template>
    <div class="progressbar" :class="{ 'progressbar--danger': this.hasProp('danger') }">
        <span class="progressbar__fill" :style="{ width: value + '%' }"></span>
    </div>
</template>

<script>
export default {
    props: ['value', 'danger']
}
</script>
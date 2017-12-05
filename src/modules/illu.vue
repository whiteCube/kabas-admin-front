<template>
    <div>
        <Tex class="tex" v-if="type == 'tex'"></Tex>
    </div>
</template>

<script>
import Tex from '../illustrations/tex.svg';

export default {
    props: ['type'],
    components: { Tex }
}
</script>
<template>
    <div class="searchbox">
        <div class="searchbox__container">
            <input type="text" :name="name" :placeholder="placeholder" class="searchbox__textfield" v-model="query">
            <button type="submit" class="searchbox__submit">
                <span class="sro">{{ btntext }}</span>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['name', 'placeholder', 'btntext', 'value'],
        data() {
            return {
                query: ''
            }
        },
        created() {
            this.query = this.value;
        }
    }
</script>

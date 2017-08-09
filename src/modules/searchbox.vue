<template>
    <form class="searchbox" :class="{ 'searchbox--shake': shaking }" @submit="submit">
        <div class="searchbox__container">
            <input type="text" :placeholder="placeholder" class="searchbox__textfield" v-model="query">
            <button type="submit" class="searchbox__submit">
                <span class="sro">{{ btntext }}</span>
            </button>
        </div>
    </form>
</template>

<script>
export default {
    props: ['placeholder', 'btntext'],
    data() {
        return {
            query: '',
            shaking: false,
            shakeDuration: 400
        }
    },
    methods: {
        submit(e) {
            if(!this.query) {
                e.preventDefault();
                return this.shake();
            } 
            console.log('Sending query ' + this.query);
        },

        shake() {
            this.shaking = true;
            setTimeout(() => {
                this.shaking = false;
            }, this.shakeDuration);
        }
    }
}
</script>
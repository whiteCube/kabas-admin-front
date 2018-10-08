export default {
    props: ['error'],
    
    data() {
        return {
            errormessage: ''
        }
    },

    created() {
        this.errormessage = this.error;
    },
    
    mounted() {
        this.$el.addEventListener('kabas-error', (e) => {
            this.errormessage = e.detail.message;
        });
    },

    methods: {
        showError(message, e = false) {
            if(e) e.preventDefault();
            this.errormessage = message;
        },

        hideError() {
            this.errormessage = '';
        }
    }
}
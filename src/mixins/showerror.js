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
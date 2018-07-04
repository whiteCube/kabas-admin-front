export default {
    props: ['error'],
    
    data() {
        return {
            error: ''
        }
    },

    methods: {
        showError(message, e = false) {
            if(e) e.preventDefault();
            this.error = message;
        },

        hideError() {
            this.error = '';
        }
    }
}
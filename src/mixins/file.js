import ShowError from '../mixins/showerror.js';

export default {
    props: ['label', 'name', 'formats', 'maxSize', 'position'],
    mixins: [ShowError],

    data() {
        return {
            file: null,
            highlight: false
        }
    },

    methods: {
        getFile(e) {
            if(!this.hasFile(e)) return false;
            return e.target.files[0];
        },

        getDroppedFile(e) {
            this.highlight = false;
            return e.dataTransfer.files[0];
        },

        hasFile(e) {
            return e.target && e.target.files && e.target.files[0];
        },

        hasDroppedFile(e) {
            return e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        },

        getType(file) {
            return file.type.split('/')[1];
        },

        exceedsSize(file) {
            return this.maxSize < file.size;
        },

        isSupported(file) {
            if(!this.hasProp('formats')) return true;
            return this.supported.indexOf(this.getType(file)) > -1;
        }
    },

    computed: {
        supported() {
            if(!this.formats) return true;
            return this.formats.map(value => value.toLowerCase());
        },

        classes() {
            return {
                'field--error': this.errormessage,
                'file--highlighted': this.highlight
            }
        }
    }
}
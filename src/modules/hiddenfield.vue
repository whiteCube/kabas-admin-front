<template>
    <div class="sro" :class="classes">
        <input v-model="val"
            type="hidden" :name="computedName"
            class="field__element" :id="randomID">
    </div>
</template>

<script>
/*
Todo:
Check limit on textarea and wysiwyg
*/

export default {
    props: ['label', 'placeholder', 'name', 'limit', 'password', 'email', 'textarea', 'value', 'position', 'description', 'readonly', 'required'],

    data() {
        return {
            val: '',
            shaking: false,
            randomID: this._uid
        }
    },

    created() {
        if(this.value && typeof this.value !== 'undefined' && !this.hasProp('password')) this.val = '' + this.value;

        this.$store.commit('registerField', {
            name: this.computedName,
            type: 'text',
            value: this.value
        });
    },

    methods: {
        input(e) {
            this.$emit('input', this.val);
            this.updateValue();
            if(!this.hasProp('limit') || this.remaining != 0) return;
            this.shake();
            this.val = this.val.substring(0, this.limit);
        },

        shake() {
            this.shaking = true;
            setTimeout(() => {
                this.shaking = false;
            }, 400);
        },

        getUpdateValue() {
            return this.val;
        }
    },

    computed: {
        classes() {
            return {
                'field--error': this.errormessage,
                'textfield--limited': this.hasProp('limit'),
                'textfield--password': this.hasProp('password'),
                'textfield--email': this.hasProp('email'),
                'textfield--textarea': this.hasProp('textarea'),
                'textfield--readonly': this.hasProp('readonly'),
                'field--shake': this.shaking
            };
        },

        remaining() {
            let remaining = this.limit - this.val.length;
            return remaining > 0 ? remaining : 0;
        }
    },

    watch: {
        value(newVal) {
            newVal = '' + newVal;
            this.val = newVal.substring(0, this.limit);
            this.updateValue();
        }
    }
}
</script>

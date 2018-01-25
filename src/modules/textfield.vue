<template>
    <div class="field textfield" :class="classes">
        <label class="field__label" :for="randomID" v-html="label"></label>
        <div class="field__container" :data-remaining="remaining">
            <input  v-if="!this.hasProp('email') && !this.hasProp('password') && !this.hasProp('textarea')" 
                    @input="input" v-model="val" 
                    type="text" :name="computedName" 
                    class="field__element" :id="randomID"
                    :placeholder="placeholder">
            <input  v-if="this.hasProp('email')" 
                    @input="input" 
                    v-model="val" type="email" 
                    :name="computedName" class="field__element" 
                    :placeholder="placeholder" :id="randomID">
            <input  v-if="this.hasProp('password')" 
                    @input="input" 
                    v-model="val" type="password" 
                    :name="computedName" class="field__element" 
                    :placeholder="placeholder" :id="randomID">
            <textarea   v-if="this.hasProp('textarea')"
                        @input="input" 
                        class="field__element" :id="randomID"
                        v-model="val" :name="computedName"
                        :placeholder="placeholder"></textarea>
        </div>
    </div>
</template>

<script>
/*
Todo:
Check limit on textarea and wysiwyg
*/

export default {
    props: ['label', 'placeholder', 'name', 'limit', 'password', 'email', 'textarea', 'value', 'position'],

    data() {
        return {
            val: '',
            shaking: false,
            randomID: this._uid
        }
    },

    created() {
        if(this.value && typeof this.value !== 'undefined') this.val = this.value;
    },

    methods: {
        input(e) {
            this.$emit('input', this.val);
            if(!this.hasProp('limit') || this.remaining != 0) return;
            this.shake();
            this.val = this.val.substring(0, this.limit);
        },

        shake() {
            this.shaking = true;
            setTimeout(() => {
                this.shaking = false;
            }, 400);
        }
    },

    computed: {
        classes() {
            return {
                'textfield--limited': this.hasProp('limit'),
                'textfield--password': this.hasProp('password'),
                'textfield--email': this.hasProp('email'),
                'textfield--textarea': this.hasProp('textarea'),
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
            this.val = this.val.substring(0, this.limit);
        }
    }
}
</script>
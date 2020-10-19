<template>
    <div class="field textfield" :class="classes">
        <label class="field__label" :for="randomID" v-html="label"></label>
        <p class="field__description" v-if="description" v-html="description"></p>
        <div class="field__container" :data-remaining="remaining">
            <input  v-if="!this.hasProp('email') && !this.hasProp('password') && !this.hasProp('textarea')"
                    @input="input" v-model="val"
                    type="text" :name="computedName"
                    class="field__element" :id="randomID"
                    :placeholder="placeholder" :disabled="readonly" :required="required">
            <input  v-if="this.hasProp('email')"
                    @input="input" :disabled="readonly"
                    v-model="val" type="email"
                    :name="computedName" class="field__element"
                    :placeholder="placeholder" :id="randomID" :required="required">
            <input  v-if="this.hasProp('password')"
                    @input="input" :disabled="readonly"
                    v-model="val" type="password"
                    :name="computedName" class="field__element"
                    :placeholder="placeholder" :id="randomID" :required="required">
            <textarea   v-if="this.hasProp('textarea')"
                        @input="input"
                        class="field__element" :id="randomID"
                        v-model="val" :name="computedName"
                        :placeholder="placeholder" :disabled="readonly" :required="required"></textarea>
        </div>
        <transition name="slideDown">
            <p class="field__error" v-if="errormessage">{{ errormessage }}</p>
        </transition>
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

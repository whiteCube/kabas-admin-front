<!-- <template>
    <div class="genericfield">
        <textfield v-if="type == 'text'" :value="value" :label="label" :name="name"></textfield>
        <textfield email v-if="type == 'email'" :value="value" :label="label" :name="name"></textfield>
        <textfield textarea v-if="type == 'textarea'" :value="value" :label="label" :name="name"></textfield>
        <textfield password v-if="type == 'password'" :value="value" :label="label" :name="name"></textfield>
        <colorfield v-if="type == 'color'" :value="value" :label="label" :name="name"></colorfield>
        <imagefield v-if="type == 'image'" :value="value" :label="label" :name="name"></imagefield>
        <urlfield v-if="type == 'url'" :value="value" :label="label" :name="name"></urlfield>
    </div>
</template> -->

<script>
export default {
    props: ['value', 'structure', 'name'],

    data() {
        return {
            properties: {},
            tags: {
                'text': 'textfield',
                'email': 'textfield',
                'textarea': 'textfield',
                'password': 'textfield',
                'color': 'colorfield',
                'image': 'imagefield',
                'file': 'filefield',
                'url': 'urlfield',
                'wysiwyg': 'wysiwyg'
            }
        }
    },

    render(createElement) {
        return createElement(this.component, {
            props: this.getProps()
        });
    },

    methods: {

        addRule(rule) {
            if(this.structure.rules[rule]) this.properties[rule] = this.structure.rules[rule];
        },

        addProp(key, value = true) {
            this.properties[key] = value;
        },

        is(...types) {
            return types.indexOf(this.component) > -1;
        },

        getProps() {
            this.addCommonProps();
            if(this.is('textfield', 'wysiwyg')) this.addTextProps();
            if(this.is('imagefield')) this.addImageProps();
            if(this.is('imagefield', 'filefield')) this.addFileProps();

            return this.properties;
        },

        addCommonProps() {
            this.properties = {
                label: this.label,
                value: this.value,
                name: this.name,
                placeholder: this.placeholder
            };
        },

        addTextProps() {
            if(this.type == 'email') this.addProp('email');
            if(this.type == 'textarea') this.addProp('textarea');
            if(this.type == 'password') this.addProp('password');
            if(!this.structure.rules) return;
            this.addRule('limit');
        },

        addImageProps() {
            if(!this.structure.rules) return;
            this.addRule('minHeight');
            this.addRule('height');
            this.addRule('maxHeight');
            this.addRule('minWidth');
            this.addRule('width');
            this.addRule('maxWidth');
        },

        addFileProps() {
            if(!this.structure.rules) return;
            this.addRule('formats');
            this.addRule('maxSize');
        }

    }, 

    computed: {
        type() {
            return this.structure.type;
        },

        label() {
            return this.structure.label;
        },

        placeholder() {
            return this.structure.placeholder;
        },

        component() {
            return this.tags[this.type];
        }
    }
}
</script>
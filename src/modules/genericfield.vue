<script>
export default {
    props: ['value', 'structure', 'name', 'nestinglevel', 'primary', 'position'],

    data() {
        return {
            isField: false,
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
                'wysiwyg': 'wysiwyg',
                'checkbox': 'checkboxfield',
                'radio': 'radiofield',
                'repeater': 'repeater',
                'group': 'groupfield',
                'date': 'datefield',
                'select': 'selectfield',
                'gallery': 'gallery',
                'flexible': 'flexible'
            }
        }
    },

    render(createElement) {
        return createElement(this.component, {
            props: this.getProps(),
            on: { input: data => this.$emit('input', data) },
            ref: 'field'
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
            if(this.is('repeater', 'gallery', 'flexible')) this.addRepeaterProps();
            if(this.is('flexible')) this.addFlexibleProps();
            if(this.is('groupfield')) this.addGroupProps();
            if(this.is('checkboxfield')) this.addCheckboxProps();
            if(this.is('selectfield')) this.addSelectProps();
            return this.properties;
        },

        addCommonProps() {
            this.properties.label = this.label;
            this.properties.value = this.value;
            this.properties.name = this.name;
            this.properties.placeholder = this.placeholder;
            this.properties.nestinglevel = this.nestinglevel;
            this.properties.position = this.position;
            this.properties.description = this.structure.description;
        },

        addTextProps() {
            if(this.structure.readonly) this.addProp('readonly');
            if(this.type == 'email') this.addProp('email');
            if(this.type == 'textarea') this.addProp('textarea');
            if(this.type == 'password') this.addProp('password');
            if(!this.structure.rules) return;
            this.addRule('limit');
        },

        addCheckboxProps() {
            if(this.structure.readonly) this.addProp('readonly');
            if(this.value) this.addProp('checked');
            this.properties.value = '1';
        },

        addImageProps() {
            if(this.value) {
                this.properties.value = this.value;
                this.properties.filedata = this.value.file || null;
            }
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
        },

        addRepeaterProps() {
            if(!this.structure.options) return;
            this.properties.items = this.value;
            this.properties.primary = this.primary;
            this.properties.structure = this.structure.options;
        },

        addFlexibleProps() {
            if(!this.structure.options) return;
            this.properties.options = this.structure.options;
        },

        addGroupProps() {
            if(!this.structure.options) return;
            this.properties.primary = this.primary;
            this.properties.options = this.structure.options;
            this.properties.values = this.value;
        },

        addSelectProps() {
            if(!this.structure.options) return;
            this.addProp('showSearch', this.structure.showSearch);
            this.addProp('options', this.structure.options);
            if(this.structure.multiple) {
                this.addProp('multiple', this.structure.multiple);
            }
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
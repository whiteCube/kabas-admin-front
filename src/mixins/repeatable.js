import EventBus from './event-bus.js';

export default {
    props: ['nestinglevel'],

    data() {
        return {
            level: 0,
            height: '75px',
            animating: false
        }
    },

    created() {
        this.level = this.hasProp('nestinglevel') ? this.nestinglevel : 0;

        EventBus.$on('resize', this.resize);
        EventBus.$on('initialsize', this.initialSize);
    },

    methods: {
        hideRecursivelyUntil(level, index) {
            if(this.level >= level) {
                this.showsub = false;
                this.$emit('hidesub', level);
            } 
            if(!this.$refs[index]) return;
            this.$refs[index][0].hideRecursivelyUntil(level);
        },

        calculateHeight() {
            let height = 0;
            let container = this.$el.querySelector('.field__container');
            for(let i = 0; i < container.children.length; i++) {
                if(this.isExcluded(container.children[i])) continue;
                let el = container.children[i].cloneNode(true);
                el.style.display = 'block';
                container.appendChild(el);
                height += el.clientHeight;
                container.removeChild(el);
            }
            return height + 4 + 'px';
        },

        initialSize(parent, height) {
            if(parent != this.id) return;
            this.height = height + 75 + 'px' || this.calculateHeight();
            this.animating = true;
        },

        resize(parent) {
            if(parent != this.id) return;
            this.height = this.calculateHeight();
            setTimeout(() => {
                this.animating = false;
            }, 200);
        },

        isExcluded(el) {
            return (this.showfields && el.className == 'repeater__items') ||
                   (!this.showfields && el.className == 'repeater__editable');
        }
    },

    computed: {
        calculatedHeight() {
            if(!this.animating) return '';
            return this.height;
        }
    }
}
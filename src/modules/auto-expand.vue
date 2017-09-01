<script>
import EventBus from '../mixins/event-bus.js';

export default {
    render(createElement) {
        let data = {
            props: {
                name: 'slide'
            },
            on: {
                enter: this.enter,
                afterEnter: this.afterEnter,
                beforeLeave: this.beforeLeave,
                afterLeave: this.afterLeave
            }
        };
        return createElement('transition', data, this.$slots.default);
    },

    data() {
        return {
            duration: 200,
            baseHeight: '1px',
            easing: 'cubic-bezier(0.215,  0.610, 0.355, 1.000)'
        }
    },

    created() {
        EventBus.$on('ae-baseheight', (height, parent) => {
            if(parent != this.getAbsoluteParent()) return;
            this.baseHeight = height;
        });
    },
    
    methods: {

        enter(el) {
            el.style.height = 'auto !important';
            let endHeight = getComputedStyle(el).height;
            let style = getComputedStyle(el);
            el.style.height = this.baseHeight;
            this.startTransition(el);
            el.offsetHeight; // force repaint
            el.style.height = endHeight;
            this.stopTransition(el);
        },

        afterEnter(el) {
            el.style.height = 'auto';
        },

        beforeLeave(el) {
            let baseHeight = getComputedStyle(el).height;
            EventBus.$emit('ae-baseheight', baseHeight, this.getAbsoluteParent());
        },

        afterLeave() {
            this.$emit('after-leave');
        },

        startTransition(el) {
            el.style.transition = 'all ' + this.duration + 'ms ' + this.easing;
        },

        stopTransition(el) {
            setTimeout(() => {
                el.style.transition = '';
            }, this.duration);
        }
    }
}
</script>
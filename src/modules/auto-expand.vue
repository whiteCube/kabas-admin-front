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
            caught: '1px',
            easing: 'cubic-bezier(0.215,  0.610, 0.355, 1.000)'
        }
    },

    created() {
        EventBus.$on('catch', height => {
            this.caught = height;
        });
    },
    
    methods: {

        enter(el) {
            el.style.height = 'auto'
            var endHeight = getComputedStyle(el).height;
            el.style.height = this.caught
            this.startTransition(el);
            el.offsetHeight // force repaint
            el.style.height = endHeight;
            this.stopTransition(el);
        },

        afterEnter(el) {
            el.style.height = 'auto'
        },

        beforeLeave(el) {
            EventBus.$emit('catch', getComputedStyle(el).height);
            el.style.height = getComputedStyle(el).height
            this.startTransition(el);
            el.offsetHeight // force repaint
            el.style.height = this.caught
            this.stopTransition(el);
        },

        afterLeave() {
            this.$emit('after-leave');
        },

        startTransition(el) {
            el.style.transition = 'all ' + this.duration + 'ms ' + this.easing;
        },

        stopTransition(el) {
            setTimeout(() => {
                el.style.transition = 'transform ' + this.duration/2 + 'ms ' + this.easing;
            }, this.duration);
        }
    }
}
</script>
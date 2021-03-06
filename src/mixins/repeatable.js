import EventBus from './event-bus.js';

export default {
    props: ['nestinglevel'],

    data() {
        return {
            level: 0
        }
    },

    created() {
        this.level = this.hasProp('nestinglevel') ? this.nestinglevel : 0;
    },

    methods: {
        hideRecursivelyUntil(level, index) {
            if(this.level >= level) {
                this.showsub = false;
                this.$emit('hidesub', level);
            } 
            if(!this.$refs[index] || !this.$refs[index][0].hideRecursivelyUntil) return;
            this.$refs[index][0].hideRecursivelyUntil(level);
        },

        emptyValue(item) {
            if(item == '') return true;
            if(typeof item == 'object') {
                for(let index in item) {
                    if(this.primaryCheck(index) && (item[index] == '' || item[index].length == 0)) return true;
                    if(item[index] != '' || item[index].length != 0) return false;
                }
            }
            return false;
        }
    }
}
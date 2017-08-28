export default {
    data() {
        return {
            showsub: false,
            crumbs: [],
            lastcrumb: 0,
            level: 0
        }
    },

    methods: {
        showSub(data) {
            if(this.level > 0) return this.$parent.$emit('showsub', data);
            this.lastcrumb = data.level;
            this.crumbs[data.level] = data;
        },

        hideSub(level) {
            if(this.level > 0) {
                delete this.crumbs[level];
                this.$parent.$emit('hidesub', level);
            } 
            this.lastcrumb = level;
        },

        hideRecursivelyUntil(level, index) {
            if(this.level >= level) {
                this.showsub = false;
                this.$emit('hidesub', level);
            } 
            if(!this.$refs[index]) return;
            this.$refs[index][0].hideRecursivelyUntil(level);
        },

        hideSubfield() {
            this.$emit('hidesub', this.level);
            this.$parent.$emit('hidesub', this.level);
            for(let key in this.$refs) { this.$refs[key][0].showsub = false; }
            this.showsub = false;
        },
    }
}
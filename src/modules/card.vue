<template>
    <div class="card" :class="classes">
        <div class="card__header">
            <em class="card__title"><slot name="title"></slot></em>
            <a :href="edit" class="card__link"><slot name="edit"></slot></a>
            <dl class="card__metas">
                <dt class="meta__title"><slot name="editedlabel"></slot></dt>
                <dd class="meta__data"><time><slot name="edited"></slot></time></dd>
                <dt class="meta__title"><slot name="statuslabel"></slot></dt>
                <dd class="meta__data"><slot name="status"></slot></dd>
            </dl>
        </div>
        <p class="card__main">
            <slot name="description"></slot>
        </p>
        <div class="card__footer">
            <a :href="view" class="card__view"><slot name="view"></slot></a>
            <a href="#" v-if="this.hasProp('destroy')" class="card__delete" @click.prevent="deleting = true">
                <span class="sro"><slot name="delete"></slot></span>
            </a>
        </div>
        <transition v-if="this.hasProp('destroy')" name="slideUp">
            <div class="delete" v-if="deleting">
                <p class="delete__warning"><slot name="confirmdelete"></slot></p>
                <a :href="destroy" class="delete__confirm"><slot name="yes"></slot></a>
                <a href="#" class="delete__cancel" @click.prevent="deleting = false"><slot name="no"></slot></a>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: ['edit', 'view', 'destroy', 'icon'],
    data() {
        return {
            deleting: false
        }
    },

    computed: {
        classes() {
            let classes = {
                'card--delete': this.deleting
            };
            if(this.hasProp('icon')) classes['card--' + this.icon] = true;
            return classes;
        }
    }
}
</script>
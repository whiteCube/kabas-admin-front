import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

Vue.config.devtools = true;

// Create the store
export default new Vuex.Store({
    state: {
        fields: {}
    },
    mutations: {
        registerField(state, structure) {
            Vue.set(state.fields, structure.name, structure);
        },
        updateValue(state, payload) {
            if(!payload.name || !state.fields[payload.name]) return;
            state.fields[payload.name].value = payload.value;
        }
    }
});
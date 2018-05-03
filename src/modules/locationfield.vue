<template>
     <div class="field location" :class="classes">
        <label class="field__label">{{ label }}</label>
        <p class="field__description" v-if="description" v-html="description"></p>
        <map-selector :zoom="8" :latitude="latitude" :longitude="longitude" @locationUpdated="locationUpdated"></map-selector>

        <div class="location__inputs">
            <textfield label="Latitude" :value="latitude" :name="computedName + '[lat]'"></textfield>
            <textfield label="Longitude" :value="longitude" :name="computedName + '[lng]'"></textfield>
        </div>
    </div>
</template>

<script>
import MapSelector from 'vue-latlng-picker';

export default {
    props: ['label', 'description', 'name', 'lat', 'lng'],
    components: { 'map-selector': MapSelector },

    data() {
        return {
            latitude: 50.63356990,
            longitude: 5.56318220
        }
    },

    mounted() {
        this.latitude = this.lat || 50.63356990;
        this.longitude = this.lng || 5.56318220;
    },

    methods: {
        locationUpdated(latlng) {
            this.latitude = latlng.lat;
            this.longitude = latlng.lng;
        }
    },

    computed: {
        classes() {
            let classes = { 
                'btn--primary': this.hasProp('primary'), 
                'btn--secondary': this.hasProp('secondary'), 
                'btn--tiny': this.hasProp('tiny'),
            };

            if(this.hasProp('icon')) {
                classes['btn--icon'] = true;
                classes['btn--' + this.icon] = true;
            }
            
            return classes;
        }
    }
}
</script>
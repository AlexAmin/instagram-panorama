<template>
  <b-row>
    <b-col sm="12">
      <HelloWorld />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'Home',
  components: {
    HelloWorld,
  },
});
</script>

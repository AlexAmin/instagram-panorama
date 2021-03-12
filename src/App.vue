<template>
  <b-container fluid="true">
    <b-navbar sticky type="light" toggleable="md">
      <b-navbar-brand>
        Insta Panorama
      </b-navbar-brand>
    </b-navbar>
    <router-view />
  </b-container>
</template>

<script lang="ts">
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: 'App',
  components: {},
  props: {},
  setup() {
    return {
    }
  }
});
</script>

<style>
</style>

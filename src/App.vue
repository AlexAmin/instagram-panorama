<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-container>
        <b-navbar-brand href="#">Insta Panorama</b-navbar-brand>
      </b-container>
    </b-navbar>
    <b-container>
      <router-view />
    </b-container>
  </div>

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

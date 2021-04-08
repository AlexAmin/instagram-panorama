<template>
  <b-row class="justify-content-center">
    <b-col cols="12" sm="7" v-if="inputFile && !processing">
      <ResultCarousel
          @reset="reset"
          :inputFile="inputFile"
          :previews="previews"
      />
    </b-col>
    <b-col sm="12" v-else-if="inputFile && processing">
      <p>Loading</p>
    </b-col>
    <b-col sm="12" v-else>
      <b-jumbotron class="upload-jumbotron">
        <b-row>
          <b-col sm="12"><h1>Use your panoramas on Insta</h1></b-col>
          <b-col sm="12"><p>
            Ever wanted to use panoramas on Instagram but got frustrated trying to trim them down to fit?
            <br/>
            Select the panorama you would like to convert and we'll cut it down into a few square-sized photos that will work on Instagram
            <br/>
            And the best part? Your data never leaves your computer. Your privacy matters!
          </p></b-col>
          <b-col sm="12">
            <b-form-group>
              <b-form-file id="file-large" size="lg"  accept="image/*" @change="fileSelected"/>
            </b-form-group>
          </b-col>
        </b-row>
      </b-jumbotron>
    </b-col>

    <!-- Used for image editing -->
    <img style="display: none;" ref="imageFile" alt="hidden preview" src="#"/>
  </b-row>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "@vue/composition-api";
import {ImageSlicing} from "@/ImageSlicing";
import ResultCarousel from "@/components/ResultCarousel.vue";

export default defineComponent({
  name: 'App',
  components: {
    ResultCarousel
  },
  setup(){
    const processing = ref(false);
    const previews: Ref<Blob[]> = ref([]);
    const uiFactor = ref(3)
    const inputImage = ref();
    const inputFile: Ref <File | null> = ref();

    async function fileSelected(e) {
      const files = e.target.files;
      if (files.length === 0) return
      processing.value = true;
      inputFile.value = files[0];
      inputImage.value = URL.createObjectURL(inputFile.value);
      if(inputFile.value === null) return
      const blobs = await new ImageSlicing(inputFile.value).render();
      processing.value = false;
      previews.value = blobs;
    }
    function reset(){
      inputFile.value = null;
      processing.value = false;
    }
    return {
      processing,
      inputFile,
      inputImage,
      previews,
      fileSelected,
      uiFactor,
      reset
    }
  }
});
</script>

<style>
html, body{
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>

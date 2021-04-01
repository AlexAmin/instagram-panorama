<template>
  <b-row>
    <ResultCarousel
        v-if="inputFile && !processing"
        @reset="reset"
        :inputFile="inputFile"
        :previews="previews"
        />
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
#app {
  overflow: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.carousel-buttons {
  display: table-cell;
  vertical-align: middle;
}
.carousel-button {
  background-color: white;
  height: 25px;
  text-align: center;
  width: 25px;
  color: black;
  font-weight: bold;
  border-radius: 15px;
  box-shadow: 1px 1px 0px gray;
}
.carousel-button-right {
  float: right;
  margin-right: 5vh;
}
.carousel-button-left {
  float: left;
  margin-left: 5vh;
  vertical-align: middle;
}
.input-file-preview{
  height: 20vh;
  width: 100%;
}
.image-background {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  margin: 0 auto;
}
.carousel-container {
  height: 50vh;
  width: 100%;
}
.upload-jumbotron{
  margin-top: 5vh;
}
.dotActive{
  background-color: blue !important;
}
.profile-picture{
  background-color: grey;
  border-radius: 90px;
  height: 50px;
  width: 50px;
}
</style>

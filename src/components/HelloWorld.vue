<template>
  <b-row>
    <b-col sm="12">
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
    <b-col sm="12" v-if="!inputFile">none</b-col>
    <b-col sm="12" v-else-if="processing">
      <p>Loading</p>
    </b-col>
    <slot v-else>
      <b-col sm="6">
        <b-col sm="12">Original</b-col>
        <b-col sm="12"
               class="carousel-container"
               :style="`background-image:url(${inputImage};`"/>
      </b-col>
      <b-col sm="6">
        <b-row>
          <b-col sm="12">Panorama</b-col>
          <b-col sm="12"
                 v-if="previews.length > 0"
                 class="carousel-container"
                 :style="`background-image:url(${loadImage(previews[previewIndex])};`">
            <div class="carousel-buttons">
            <span
                v-if="nextImageAvailable"
                @click="previousImage" class="carousel-button carousel-button-left">&lt;</span>
              <span
                  v-if="nextImageAvailable"
                  @click="nextImage" class="carousel-button carousel-button-right">&gt;</span>
            </div>
          </b-col>
          <b-col sm="12">
            <ul>
              <li
                  v-for="i in previews.length"
                  :key="i+'-preview-dot'"
                  style="display: inline-block; height: 8px; width: 8px; margin-left: 4px; border-radius: 16px; background-color: grey;"
                  v-bind:class="{dotActive: i === previewIndex+1}"
              />
            </ul>
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="6" cols="12">
        <p>{{previewIndex}}</p>
      </b-col>
    </slot>
    <!-- Used for image editing -->
    <img style="display: none;" ref="imageFile" alt="hidden preview" src="#"/>
  </b-row>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "@vue/composition-api";
import {ImageSlicing} from "@/ImageSlicing";

export default defineComponent({
  name: 'App',
  components: {},
  setup(){
    const processing = ref(false);
    const previews: Ref<Blob[]> = ref([]);
    const uiFactor = ref(3)
    const inputImage = ref("");
    const previewIndex = ref(0);
    const inputFile: Ref <File | null> = ref(null);

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

    function loadImage(file: File){
      return URL.createObjectURL(file)
    }
    function download(){
      previews.value.forEach((renderedFile, index)=>{
        setTimeout(()=>{
          if(inputFile.value === null) return
          const element = document.createElement('a');
          element.setAttribute('href', URL.createObjectURL(renderedFile));
          element.setAttribute('download', "pano-"+"-"+index+inputFile.value.name);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          setTimeout(()=>{
            document.body.removeChild(element);
          }, 10000)
        }, 200 * index)

      })
    }

    function nextImageAvailable(){
      const max = previews.value.length;
      const newIndex = previewIndex.value+1;
      return newIndex < max;
    }
    function previousImageAvailable(){
      const min = 0;
      const newIndex = previewIndex.value-1;
      return newIndex >= min;
    }
    function nextImage(){
      if(!nextImageAvailable()) return;
      previewIndex.value++;
    }
    function previousImage(){
      if(!previousImageAvailable()) return
      previewIndex.value--;
    }
    return {
      processing,
      inputFile,
      inputImage,
      previews,
      download,
      fileSelected,
      loadImage,
      previewIndex,
      nextImage,
      previousImage,
      nextImageAvailable,
      previousImageAvailable,
      uiFactor
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
.carousel-container {
  height: 50vh;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  margin: 0 auto;
}
.upload-jumbotron{
  margin-top: 5vh;
}
.dotActive{
  background-color: blue !important;
}
</style>

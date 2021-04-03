<template>
  <b-row v-if="inputFile && previews">
    <b-col cols="12">
      <b-row>
        <b-col cols="2">
          <div class="profile-picture"/>
        </b-col>
        <b-col cols="6">
          <b-row>
            <b-col cols="12">
              <span>Alex</span>
            </b-col>
            <b-col cols="12">
              <span>At a place</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="12">
      <b-row>
        <b-col sm="12"
               class="carousel-container image-background"
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
      </b-row>
    </b-col>
    <b-col cols="12">
      <b-row>
        <b-col cols="1">
          <button @click="reset"><b-icon-trash/></button>
        </b-col>
        <b-col cols="1" offset="1">
          <button @click="download"><b-icon-download/></button>
        </b-col>
        <b-col cols="1" v-for="(file, index) in files" v-bind:key="'file-'+index">
          <a :href="file.href" :download="file.download">File {{index}}</a>
        </b-col>
        <b-col cols="5">
          <ul>
            <li
                v-for="i in previews.length"
                :key="i+'-preview-dot'"
                class="preview-dot"
                v-bind:class="{dotActive: i === previewIndex+1}"
            />
          </ul>
        </b-col>
      </b-row>
    </b-col>
    <b-col v-if="inputImage" cols="12"
           class="input-file-preview image-background"
           :style="`background-image:url(${inputImage};`"/>
  </b-row>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "@vue/composition-api";
import {ImageSlicing} from "@/ImageSlicing";

export default defineComponent({
  name: 'ResultCarousel',
  components: {},
  props:{
    inputFile: File,
    previews: Array
  },
  setup(props, {emit}){
    const inputImage = ref()
    const previewIndex = ref(0);
    const files = ref([])

    function reset(){
      emit("reset")
    }
    function download(){
      files.value.forEach((value, index)=>{
        setTimeout(()=>{
          if(props.inputFile === null) return
          const element = document.createElement('a');
          element.setAttribute('href', value.href);
          element.setAttribute('download', value.download);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          setTimeout(()=>{
            document.body.removeChild(element);
          }, 10000)
        }, 200 * index)

      })
    }
    function loadImage(file: File){
      if(!file) return null;
      return URL.createObjectURL(file)
    }
    function nextImageAvailable(){
      const max = props.previews.length;
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
    inputImage.value = loadImage(props.inputFile)

    files.value = [];
    files.value = props.previews.map((renderedFile, index)=>{
      return {
        href: URL.createObjectURL(renderedFile),
        download: "pano-" + "-" + index + props.inputFile.name
      }
    });

    return {
      nextImage,
      previousImage,
      files,
      nextImageAvailable,
      previousImageAvailable,
      previewIndex,
      loadImage,
      reset,
      inputImage,
      download
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
.preview-dot{
  display: inline-block;
  height: 5px;
  width: 5px;
  margin-left: 4px;
  border-radius: 16px;
  background-color: grey;
}
</style>

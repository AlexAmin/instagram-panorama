<template>
  <div class="result-carousel-container">
    <b-row v-if="inputFile && previews" class="result-card">
      <b-col cols="12" class="title-row">
        <b-row>
          <b-col sm="1" cols="2">
            <div class="profile-picture"/>
          </b-col>
          <b-col cols="6" class="my-auto">
            <span class="title-text">insta-panorama</span>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12" class="image-container">
        <img :src="loadImage(previews[previewIndex])"
             class="image-background"
             alt="rendered image"/>
        <div class="carousel-buttons">
            <span
                v-if="nextImageAvailable"
                @click="previousImage" class="carousel-button carousel-button-left">
              <b-icon-chevron-left/>
            </span>
          <span
              v-if="nextImageAvailable"
              @click="nextImage" class="carousel-button carousel-button-right"><b-icon-chevron-right/></span>
        </div>
      </b-col>
      <b-col cols="12">
        <div class="action-container">
          <b-btn variant="link" @click="reset" class="text-danger action-btn-reset"><b-icon-trash/></b-btn>
          <div class="preview-dot-container justify-content-center">
            <div
                v-for="i in previews.length"
                :key="i+'-preview-dot'"
                class="preview-dot"
                v-bind:class="{dotActive: i === previewIndex+1}"/>
          </div>
          <b-btn variant="link" @click="download" class="text-body action-btn-download"><b-icon-download/></b-btn>
        </div>
      </b-col>
      <b-col cols="1" v-for="(file, index) in files" v-bind:key="'file-'+index">
        <a :href="file.href" :download="file.download">File {{index}}</a>
      </b-col>
      <b-col v-if="inputImage" cols="12"
             class="input-file-preview image-background"
             :style="`background-image:url(${inputImage};`"/>
    </b-row>
  </div>
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

.result-carousel-container{
  padding-left: 8px;
  padding-right: 8px;
}
.result-card{
  border: 1px solid rgba(219,219,219);
  border-radius: 3px;
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 16px;
  padding: 0;
}

.carousel-buttons {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.title-row{
  padding-top: 8px;
  padding-bottom: 8px;
}
.title-text{
  font-weight: 600;
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
  margin-right: 12px;
}
.carousel-button-left {
  margin-left: 12px;
}
.input-file-preview{
  height: 20vh;
  width: 100%;
}
.image-container.col-12{
  padding: 0 !important;
  margin: 0 !important;
}
.image-background {
  width: 100%;
}
.carousel-container {
  width: 100%;
}
.upload-jumbotron{
  margin-top: 5vh;
}
.dotActive{
  background-color: black !important;
}
.profile-picture{
  background-color: grey;
  border-radius: 60px;
  height: 42px;
  width: 42px;
}
.action-container{
  display: flex;
  align-items: stretch;
  flex-direction: row;
}
.action-container .action-btn-reset{

}
.action-container .action-btn-download{
  margin-left: auto;
}
.preview-dot-container{
  width: 100%;
  padding-top: 4px;
  padding-bottom: 4px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  display: flex
}
.preview-dot{
  display: inline-block;
  height: 5px;
  width: 5px;
  margin-left: 4px;
  border-radius: 16px;
  background-color: grey;
}
.button-borderless{
  outline: none;
  background: none;
}
</style>

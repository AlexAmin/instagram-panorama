<template>
  <b-row style="background-color: red">
    <b-col sm="6">
      <input type="range" min="2" max="10" v-model="factor" @change="render"/> <span>{{factor}} </span>
      <input ref="directoryInput" type="file" accept="image/*" @change="fileSelected">
      <button @click="download">Download</button>
    </b-col>
    <p v-if="processing">loading</p>
    <b-col sm="12">
      <div
          v-if="previews.length > 0"
          class="carousel-container"
          :style="`background-image:url(${loadImage(previews[previewIndex])};`">
        <div class="carousel-buttons">
            <span
                v-if="previousImageAvailable"
                @click="previousImage" class="carousel-button carousel-button-left">&lt;</span>
          <span
              v-if="nextImageAvailable"
              @click="nextImage" class="carousel-button carousel-button-right">&gt;</span>
        </div>
      </div>
    </b-col>
    <img style="display: none;" ref="image" alt="hidden preview" src="#"/>
  </b-row>
</template>

<script>
import {defineComponent, ref} from "@vue/composition-api";
import {Carousel, Slide} from 'vue-carousel';

export default defineComponent({
  name: 'App',
  components: {Carousel, Slide},
  setup(){
    const processing = ref(false);
    const previews = ref([]);
    const uiFactor = ref(3)
    const image = ref(null);
    const previewIndex = ref(0);
    const factor = ref(3);
    const file = ref(null);

    function findFactor(sourceWidth, sourceHeight){
      //Find a factor that will help us get closest to a 1:1 aspect ratio
      const factor = {factor: null, value: null}
      for(let i = 2; i<10; i++){
        console.log("loop", i)
        const value = (sourceWidth/i) / sourceHeight;
        if(!factor.factor || !factor.value || (Math.abs(value) > factor.value)){
          factor.factor = i;
          factor.value = value;
          console.log("New best factor", factor, i)
        }else{
          console.log("Bad factor", value, i)
        }
      }
      console.log("Found factor", factor)
      return factor;
    }
    function loadImage(image){
      return URL.createObjectURL(image)
    }
    function render(){
      console.log("Load file", file)
      image.value.onload = async function() {
        const sourceWidth = image.value.width;
        const sourceHeight = image.value.height;
        uiFactor.value = 12 / factor.value
        //const factor = Math.abs(sourceWidth / targetWidth);
        const targetWidth = sourceWidth / factor.value;
        console.log("factor", factor.value)
        console.log("target", factor.value, "@", targetWidth, "px")
        const tasks = [];
        for (let i = 0; i < factor.value; i++) {
          const canvas = document.createElement("canvas");
          const canvasContext = canvas.getContext("2d");
          canvas.height = sourceHeight;
          canvas.width = targetWidth;
          canvasContext.drawImage(image.value, 0, 0, sourceWidth, sourceHeight, -(targetWidth*i), 0, sourceWidth, sourceHeight)
          console.log("Draw y offset", targetWidth * i)
          tasks.push(new Promise((resolve) => {
            canvas.toBlob(function(blob) {
              resolve(blob.slice(0, blob.size, file.value.type))
            })
          }))
        }
        const renderedFiles = await Promise.all(tasks);
        console.log(renderedFiles)
        previews.value = renderedFiles;
        processing.value = false;
      }
      image.value.src = loadImage(file.value)
    }
    async function fileSelected(e) {
      const files = e.target.files;
      if (files.length === 0) return;
      processing.value = true;
      file.value = files[0];
      factor.value = findFactor(file.width, file.height).factor
      render();
    }
    function download(){
      previews.value.forEach((renderedFile, index)=>{
        setTimeout(()=>{
          const element = document.createElement('a');
          element.setAttribute('href', loadImage(renderedFile));
          element.setAttribute('download', "pano-"+"-"+index+file.value.name);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }, 1500 * index)

      })
    }

    function nextImageAvailable(){
      return previewIndex.value <= 0;
    }
    function previousImageAvailable(){
      return previewIndex.value >= previews.value.length - 1;
    }
    function nextImage(){
      if(!nextImageAvailable()) return
      previewIndex.value++;
    }
    function previousImage(){
      if(!previousImageAvailable()) return
      previewIndex.value--;
    }
    return {
      processing,
      image,
      factor,
      previews,
      download,
      fileSelected,
      loadImage,
      render,
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
  display: table;
  height: 50vh;
  width: 50vh;
  background-color: blue;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  margin: 0 auto;
}
@media only screen and (max-height: 800px){
  .carousel-container {
    height: 70vh;
    width: 70vh;
    background-color: red;
  }
}

</style>

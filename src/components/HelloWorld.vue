<template>
  <b-row>
    <b-col sm="12">
      <input ref="directoryInput" type="file" accept="image/*" @change="fileSelected">
      <button @click="download">Download</button>
    </b-col>
    <b-col cols="12" sm="6">
      <div
          class="carousel-container"
          :style="`background-image:url(${inputImage};`"/>
    </b-col>
    <b-col cols="12" sm="6" v-if="processing">
      <p>loading</p>
    </b-col>
    <b-col v-else sm="6" cols="12">
      <p>{{previewIndex}}</p>
      <div
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
      </div>
    </b-col>
    <!-- Used for image editing -->
    <img style="display: none;" ref="imageFile" alt="hidden preview" src="#"/>
  </b-row>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "@vue/composition-api";
import {Factor} from "@/Factor";

export default defineComponent({
  name: 'App',
  components: {},
  setup(){
    const processing = ref(false);
    const previews = ref([]);
    const uiFactor = ref(3)
    const inputImage = ref("");
    const previewIndex = ref(0);
    const inputFile: Ref <File | null> = ref(null);
    const calculatedImageQuotient = ref(new Factor(-1))

    function findFactor(sourceWidth: number, sourceHeight: number): Factor{
      //Find out into how many images the image should be split to get a bunch of squares
      /*
      4032x3024
      3024 / 4032 = 0.75 -> Image is not square
      If the quotient is <1 -> Two squares aren't possible
      Else is the quotient even? -> Quotient = Number of images
      else Quotient = 1.75 -> 2 pictures
       */
      //Is the image already square?
      if(sourceWidth / sourceHeight === 1) return new Factor(1)
      console.log(sourceWidth/sourceHeight, Math.ceil(sourceWidth/sourceHeight), Math.abs(sourceWidth/sourceHeight))
      return new Factor(sourceWidth/sourceHeight)
    }
    function loadImage(image: File | null){
      if(!image) return "";
      return URL.createObjectURL(image)
    }

    function render(file: File, objectUrl: string) {
      if(inputFile.value === null) return
      const fileReader = new FileReader();
      //Load file
      fileReader.onload = async function() {
        console.log("File loaded")
        const image = new Image();
        image.src = fileReader.result as string;
        //Load file as image
        image.onload = async function(){
          //Fetch height and width
          const sourceWidth = image.width;
          const sourceHeight = image.height;
          console.log(sourceWidth, sourceHeight, "Image Loaded")
          const factor = findFactor(sourceWidth, sourceHeight)
          const tasks = [];
          /*
          Quotient = 3.4
          Abs Quotient = 3
          5652 / 3 = 1884
          i = 1 = 0 to 1884
          i = 2 = 1884 to 3768
          i = 3 = 3768 to 5652
             */
          const sliceWidth = (sourceWidth / Math.abs(factor.factor))
          for (let i = 0; i < factor.factor; i++) {
            const canvas = document.createElement("canvas");
            const canvasContext = canvas.getContext("2d");
            if(canvasContext === null) throw new Error("Failed to load canvas")
            canvas.height = sourceHeight;
            canvas.width = sliceWidth;

            const sourceMarginLeft = sliceWidth * i
            console.log(sourceMarginLeft, sliceWidth)
            canvasContext.drawImage(image, sourceMarginLeft, 0, sliceWidth, sourceHeight, 0, 0, sliceWidth, sourceHeight)
            //canvasContext.drawImage(image, 0, 0, sourceWidth, sourceHeight, -(sliceWidth), 0, sourceWidth, sourceHeight)
            tasks.push(new Promise((resolve) => {
              canvas.toBlob(function(blob) {
                if(blob === null) throw new Error("Canvas Blob is null");
                resolve(blob.slice(0, blob.size, inputFile.value.type))
              })
            }))
          }
          const renderedFiles = await Promise.all(tasks);
          console.log(renderedFiles)
          previews.value = renderedFiles;
          processing.value = false;
        }
      }
      fileReader.readAsDataURL(file)
    }

    async function fileSelected(e: any) {
      const files = e.target.files;
      if (files.length === 0) return console.log("No files selected")
      processing.value = true;
      inputFile.value = files[0];
      inputImage.value = loadImage(inputFile.value);
      render(inputFile.value, inputImage.value);
    }
    function download(){
      previews.value.forEach((renderedFile, index)=>{
        setTimeout(()=>{
          const element = document.createElement('a');
          element.setAttribute('href', loadImage(renderedFile));
          element.setAttribute('download', "pano-"+"-"+index+inputFile.value.name);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }, 1500 * index)

      })
    }

    function nextImageAvailable(){
      const max = previews.value.length;
      const newIndex = previewIndex.value+1;
      console.log(newIndex, "<=",max)
      return newIndex < max;
    }
    function previousImageAvailable(){
      const min = 0;
      const newIndex = previewIndex.value-1;
      console.log(newIndex, ">=",min);
      return newIndex >= min;
    }
    function nextImage(){
      console.log("next", previewIndex.value)
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
  height: 50vh;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  margin: 0 auto;
}

</style>

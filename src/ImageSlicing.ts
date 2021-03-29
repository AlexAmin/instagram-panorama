export class ImageSlicing{

    private image: HTMLImageElement | null = null;
    private file: File;
    private fileReader: FileReader | null = null;

    //Promise callbacks
    private resolve: Function | null = null;
    private reject: Function | null = null;

    constructor(file: File) {
        this.file = file;
    }

    async render(): Promise<Blob[]> {
        this.fileReader = new FileReader();
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        this.fileReader.onload = ()=>this.fileLoaded()
        this.fileReader.readAsDataURL(this.file)

        //Return a promise so we can continue asynchronously
        return new Promise<Blob[]>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    private fileLoaded(){
        if(this.fileReader === null) throw new Error("FileReader is not initialized")
        this.image = new Image();
        this.image.onload = ()=>this.imageLoaded()
        //Load file as image
        this.image.src = this.fileReader.result as string;
    }

    private async imageLoaded(){
        if(this.image === null) throw new Error("Image not initialized");
        console.log("image loaded");
        //Fetch height and width
        const sourceWidth = this.image.width;
        const sourceHeight = this.image.height;
        //Calculate the quotient
        const imageQuotient = sourceWidth / sourceHeight;
        /*
        Quotient = 3.4
        Abs Quotient = 3
        Image is 5652px wide
        5652 / 3 = 1884px
        i = 1 = 0 to 1884px
        i = 2 = 1884px to 3768px
        i = 3 = 3768px to 5652px
           */
        //The width if each image slice is width divided by absolute quotient
        const sliceWidth = (sourceWidth / Math.abs(imageQuotient))
        const tasks = [];
        for (let i = 0; i < imageQuotient; i++) {
            const canvas = document.createElement("canvas");
            const canvasContext = canvas.getContext("2d");
            if(canvasContext === null) throw new Error("Failed to load canvas")
            canvas.height = sourceHeight;
            canvas.width = sliceWidth;
            const sourceMarginLeft = sliceWidth * i
            //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
            canvasContext.drawImage(
                this.image,
                sourceMarginLeft,
                0,
                sliceWidth,
                sourceHeight,
                0,
                0,
                sliceWidth,
                sourceHeight
            )

            console.log("Generate Blobs");
            //Actually generating the image requires a callback
            tasks.push(new Promise((resolve) => {
                canvas.toBlob((blob: Blob | null): void => {
                    if(blob === null) throw new Error("Blob failed to load")
                    //Inject a content type into the blob
                    //This is needed for browser to allow downloading them
                    console.log("Blob Ready");
                    const blobWithContentType = blob.slice(0, blob.size, this.file.type)
                    resolve(blobWithContentType)
                })
            }))

        }

        //Wait for the blobs to generate and return them via the promise setup in render()
        const blobs: Blob[] = (await Promise.all(tasks)) as Blob[];
        if(this.resolve === null) throw new Error("Resolve promise not initialized");
        console.log("REsolve", blobs.length)
        this.resolve(blobs);
    }
}

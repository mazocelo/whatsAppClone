const pdfjsLib = require('pdfjs-dist')
const path = require('path')

pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js')

export class DocumentPreviewController{

    constructor(file){
        this._file = file;
    }

    getPreviewData(){
        
        //começa a PROMISE retorna o S OU F
        return new Promise((s,f)=>{
            let reader = new FileReader();

            switch(this._file.type){

                case'image/png':
                case'image/jpeg':
                case'image/jpg':
                case'image/gif':
                reader.onload = e =>{
                    s({
                        src:reader.result,
                        info:this._file.name
                    })
                }
                reader.onerror = e=>{
                    f(e);
                }
                reader.readAsDataURL(this._file)
                break;

                case'application/pdf':
                
                reader.onload = e =>{
                    var array =new Uint8Array(reader.result)
                    var load = pdfjsLib.getDocument(array)
                    load.promise.then(pdf=>{
                        console.log('pdf loaded')
                            pdf.getPage(1).then(page=>{
                            console.log('pageloaded')
                            var scale = 1;
                            var viewport = page.getViewport({ scale: scale, });
                            var canvas = document.createElement('canvas')
                            var canvasContext = canvas.getContext('2d')
                            canvas.width = viewport.width
                            canvas.height = viewport.height
                            var renderContext={
                                canvasContext,
                                viewport
                            }
                            var renderTask = page.render(renderContext)

                            renderTask.promise.then(()=>{
                                let _ss=(pdf.numPages >1 )?'s': ';'
                                console.log(canvas)
                                console.log(renderTask)
                                s({
                                    src: canvas.toDataURL('image/png'),
                                    info: `${pdf.numPages} página${_ss}`
                                })
                            }).catch(err=>{
                                
                                f(err)
                            })
                        }).catch(err=>{
                            f(err)
                        })
                    }).catch(err=>{
                        console.log(err)
                    })
                    
                }
                reader.readAsArrayBuffer(this._file)


                break;
                default:
                    f()

            }
        })
    }
}


/*.then(pdf=>{
                        console.log('pdf',pdf)
                    }).catch(err=>{
                        f(err)
                        console.log(err)
                    })
                    */

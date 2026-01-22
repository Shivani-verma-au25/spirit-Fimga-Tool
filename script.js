// canvas
const canvasarea = document.querySelector('.canvasarea');
let layers = [];

let layerCounter ={
    frame :0,
    rectangle : 0,
    text:0
}
const colr = 
`
`
const fontsizeinput = document.querySelector('#fontsize');
let selectedElementId =null;
let selectedElement =null;
let isResize = false;
let selectedTextelm = null;

// remove resize element
function removeReSizeClass(){
    document.querySelectorAll('.resizeHandler').forEach((hdlr) =>{
        hdlr.remove()
    })
}

// resize handler
 function reSizeHandler(elm){
    removeReSizeClass()

    const handler = document.createElement('div');
    handler.className = 'resizeHandler'
    elm.appendChild(handler);

    handler.addEventListener('mousedown',(e) =>{
        e.stopPropagation()
        isResize = true
        const x = e.clientX;
        const y = e.clientY;
        const width = elm.offsetWidth;
        const height = elm.offsetHeight;
    
        function resize(e){
            if (!isResize) return ;
            elm.style.width = width + (e.clientX - x) + 'px';
            elm.style.height = height + (e.clientY - y) + 'px';
        }

        function stopResize(){
            isResize = false
            document.removeEventListener('mousemove' , resize)
            document.removeEventListener('mouseup' , stopResize)
        }

        document.addEventListener('mousemove',resize);
        document.addEventListener('mouseup',stopResize)

    })

 }

// dragging elements
function dragElemt(elem){
    let  isDragedElm = false;
    let x ;
    let y ;

    elem.addEventListener('mousedown',(e)=>{
        if(isResize) return;
        e.stopPropagation();
        isDragedElm = true;
        x = e.offsetX;
        y = e.offsetY;

        document.querySelectorAll('.selected').forEach((elm)=>{
            elm.classList.remove('selected')
        })

        allSelcetElement(elem)
        elem.classList.add('selected')
        reSizeHandler(elem)
    })

    document.addEventListener('mousemove' ,(e)=>{
        if(!isDragedElm || isResize) return;

        let rectCanv = canvasarea.getBoundingClientRect();
        elem.style.left = Math.max(0, e.clientX - rectCanv.left - x) +'px';
        elem.style.top = Math.max(0, e.clientY - rectCanv.top - y) +'px';
    });

    document.addEventListener('mouseup',()=>{
        isDragedElm =  false;
    })


    // delete function

    document.addEventListener('keydown',(e)=>{
        if (e.key === 'Delete' && selectedElement) {
            selectedElement.remove();
            selectedElement = null;
            selectedTextelm = null;
        }
    })

    // deselect function
    // canvasarea.addEventListener('mousedown',()=>{
    //     document.querySelectorAll('.selected').forEach((s) =>{
    //         s.classList.remove('selected')
    //     })
    //     selectedElement = null;
    // }) 
}
// creating elements rectangle
function createRectangle(){
    // updating count of rectangles
    layerCounter.rectangle++;
    const id = crypto.randomUUID();
    
    const rect = document.createElement('div');

    rect.style.width = `${100}px`;
    rect.style.height = `${100}px`;
    rect.dataset.id = id
    // rect.innerText = `Rectangle ${layerCounter.rectangle}`
    rect.style.backgroundColor = `#FAFAFA`;
    rect.style.top = `${200}px`;
    rect.style.left = `${500}px`;
    rect.style.transformStyle = `tranlate(${-50 -50}%)`,
    rect.style.cursor ='move'
    rect.style.zIndex = 9
    // rect

    // saving in layer array
    layers.push({
        id,
        type:'rectangle',
        name: `Rectangle ${layerCounter.rectangle}`,
        element : rect 
    })

    //now appned chlid into parent
    canvasarea.appendChild(rect);
    dragElemt(rect)
}


// creating frame elements

function creatFrame (){
    layerCounter.frame++;
    const id = crypto.randomUUID();
    const frm = document.createElement('div');
    frm.className = 'frm';

    frm.style.width = `${200}px`
    frm.style.height = `${400}px`
    frm.dataset.id = id
    frm.style.backgroundColor = `#D9D9D9`
    frm.style.top = `${300}px`
    frm.style.left = `${500}px`
    frm.style.transformStyle = `tranlate(${-100 -100}px)`
    frm.style.cursor = 'move'

    // updating layer arry 
    layers.push({
        id,
        type:'frmae',
        name: `Frame ${layerCounter.frame}`,
        element : frm 
    })

    // append into child
    canvasarea.appendChild(frm)
    dragElemt(frm)
}


//canvas  deselecte elements
canvasarea.addEventListener('mousedown',(e)=>{
    if (e.target !== canvasarea) return;

    document.querySelectorAll('.selected').forEach((e)=>{
        e.classList.remove('selected')
    })

    removeReSizeClass()
    selectedElement = null
    selectedElementId = null
    // createRectangle();
})


// adding text


let button = document.querySelector('#text');

function createTextElement(){
    layerCounter.text++;
    let id = crypto.randomUUID()
        let txt = document.createElement('div');
        txt.className = 'textcontainer'

        txt.textContent = 'Edit Text',
        txt.contentEditable = true;
        txt.style.position = 'absolute';
        txt.dataset.id = id
        txt.style.top = '100px';
        txt.style.left = '100px';
        txt.style.cursor = 'move';
        txt.style.padding = '4px';
        txt.style.border = 'none';
        txt.style.color = 'white'
        txt.style.backgroundColor = 'black'
        txt.style.zIndex = 99
        // update layers array
        layers.push({
            id,
            type:'Text',
            name: `Text ${layerCounter.frame+1}`,
            element : txt 
        })

        // append and drage
        canvasarea.appendChild(txt);
        dragElemt(txt)

        txt.addEventListener('mousedown', (e) => {
            e.stopPropagation();

            selectedTextelm = txt;
            selectedElement = txt; 
        });
    }


// function alignText(){
//     innertext = document.getElementsByClassName('.container').innerHTML;
//     console.log(innertext);
    
// }

// alignText()



// side bar
// title chnage function



function changeFileName(){
   let title = document.querySelector('.info');

   title.addEventListener('dblclick',(e)=>{
     if(title.querySelector('input')) return ;

        let currentText = title.innerText;

        let input = document.createElement('input')
        input.className = 'title'
        input.type = 'text'
        input.value = currentText

        // same text editable
        input.value = currentText === 'Untitled' ? '' : currentText

        title.innertext = "";
        title.appendChild(input)
        input.focus();

        // save on enter and blur

        input.addEventListener('blur', save);
        input.addEventListener('keydown',(e)=>{
            if (e.key === 'Enter') {
                save()
            }
            if (e.key=== 'Escape') {
                cancel()
            }
        })

        //save function
        function save(){
            const value = input.value.trim();
            title.innerHTML = value  === ""? 'Untitled': value;
        }

        // cancel function
        function cancel(){
            title.innerText = currentText
        }
    })
}
changeFileName()


// layer  part

// display layer detail in side bar
function displayLayers(){
    const layerPanel = document.querySelector('.layers>.innerLayers');
    layerPanel.innerHTML = ''

    layers.forEach((layer) =>{
        const spanItem = document.createElement('span')
        spanItem.innerText = layer.name;
        spanItem.innerText = layer.name;
        spanItem.dataset.id = layer.id;

        if (layer.id === selectedElementId) {
            spanItem.classList.add('active')
        }

        spanItem.onclick=()=> selecTElementLayerByID(layer.id)
        layerPanel.appendChild(spanItem);
    })
}

// selects layer by id's
function selecTElementLayerByID(id){
    // document.querySelectorAll('.selected').forEach(el=>{
    //     el.classList.remove('selected')
    // })

    const lyr = layers.find((l) => l.id === id);
    if (!lyr) {
        return
    }
    // selected elemnet
    allSelcetElement(lyr.element)

    selectedElementId = id;
    lyr.element.classList.add('selected')

    displayLayers()
}

// select layer by clcking elements

canvasarea.addEventListener('click',(e)=>{
    const target = e.target.closest('[data-id]');
    if(!target) return;
    selectedElementId = target.dataset.id;

    // add class
    document.querySelectorAll('.selected').forEach((el)=>{
        el.classList.remove();
    })

    target.classList.add('selected');
    displayLayers();
})



// select and editfont size
function fontSizeEdit(){
    fontsizeinput.addEventListener('input',()=>{
        if (!selectedElement) {
            return;
        }
    // only appy to text
        if(!selectedElement.classList.contains('textcontainer')){
            return;
        }

        selectedElement.style.fontSize = fontsizeinput.value + 'px';
    })
}

// select elemnt for fontsize
function selectTextElement(elem){
    selectedElement = elem;
    selectedTextelm = elem
    if (elem.classList.contains('textcontainer')) {
        const size  = window.getComputedStyle(elem).fontSize;
        fontsizeinput.value = parseInt(size)
    }
    
}

// seleceted elements
function allSelcetElement(elem){
    if (!elem) {
        return;
    }
    document.querySelectorAll('.selected').forEach((e)=>{
        e.classList.remove('selected');
    })

    selectedElement = elem;
    selectedTextelm = elem
    elem.classList.add('selected');

    reSizeHandler(elem);

    // ui
    fontSizeEdit()
    pickColor()
}

// text aligment

// function alignText(){
//     const aligntext = document.querySelectorAll('.align-text button').forEach((aln) =>{
//        aln.onclick=()=>{
//          if (!selectedTextelm) {
//             return;
//         }

//         selectedTextelm.style.textAlign = aln.dataset.align
//        }
//     })

// }

function alignLeft(){
    if (!selectedTextelm) {
        return;
    }
     selectedTextelm.style.display = 'block';
  selectedTextelm.style.textAlign = 'left';
}

function aligneCenter(){
    if (!selectedTextelm) {
        return;
    }
    selectedTextelm.style.display = 'block';
  selectedTextelm.style.textAlign = 'center';
}

function alignRight(){
    if (!selectedTextelm) {
        return;
    }
    selectedTextelm.style.display = 'block';
  selectedTextelm.style.textAlign = 'right';
}




// color picker functions
function openPallet(){
    const colorClick =  document.querySelector('.color');
    const palette  =  document.querySelector('.palette');
    colorClick.addEventListener('click',()=>{
        // pickColor()
        palette.style.opacity = palette.style.opacity === '1' ? '0' : '1';
    })
    
}


function pickColor(){
    document.querySelectorAll('.palette button').forEach((btn) =>{
       const color = btn.dataset.color;
        btn.style.backgroundColor = color
        
        btn.onclick = (e)=>{
            if (!selectedElement) {
                return;
            }
            selectedElement.style.backgroundColor = color;
        }

    })
}


// save all data
function getDataFromApp() {
    const data = [];

    canvasarea.querySelectorAll('[data-id]').forEach(elm => {
        data.push({
            id: elm.dataset.id,
            type: elm.dataset.type,
            text: elm.innerText,
            style: {
                top: elm.style.top,
                left: elm.style.left,
                width: elm.style.width,
                height: elm.style.height,
                color: elm.style.color,
                backgroundColor: elm.style.backgroundColor,
                textAlign: elm.style.textAlign,
                fontSize: elm.style.fontSize,
            }
        });
    });

    return data;
}

// save fnction
function daveData(){
    const savedata = getDataFromApp()
    if (savedata.length ===0) {
         alert("Nothing to save");
         return;
    }
    localStorage.setItem('design',JSON.stringify(savedata))
    alert('Design Saved')
}



// load all data from localstorage

function loadAllSavedData() {
    const savedData = JSON.parse(localStorage.getItem('design'));
    if (!savedData) return;

    canvasarea.innerHTML = '';

    savedData.forEach((sData) => {
        const element = document.createElement('div');

        // restore dataset
        element.dataset.id = sData.id;
        element.dataset.type = sData.type;

        // restore text
        element.innerText = sData.text || '';

        // restore styles
        element.style.position = 'absolute';
        Object.assign(element.style, sData.style);

        canvasarea.appendChild(element);
        dragElemt(element);
    });
}



// clear canvas
function clearAllCanvasStoredData(){
    localStorage.removeItem('design');
    canvasarea.innerHTML = ""
    alert("Desgin deleted")
}

// download as pdf

function downloadAsPDF(){
    const pdf = document.createElement('div');
    html2pdf()
      .from(pdf)
      .set({
        margin: 0,
        filename: 'design.pdf',
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: 'px',
          format: 'a4',
          orientation: 'portrait'
        }
      })
      .save();

}




// calling functions
// calling create rectanlge function
document.getElementById('rect').addEventListener('click' , createRectangle);
// calling create frame function
document.getElementById('frame').addEventListener('click' , creatFrame);
// calling create text function
document.getElementById('text').addEventListener('click' , createTextElement);
document.querySelector('.left' ,alignLeft);
document.querySelector('.right' ,alignRight);
document.querySelector('.center' ,aligneCenter);
document.querySelector('#save').addEventListener('click' ,daveData);
document.querySelector('#remove').addEventListener('click' ,clearAllCanvasStoredData);
window.onload=()=>{
    loadAllSavedData();
};
openPallet();
// document.querySelector('.savecontainer #pdf').addEventListener("click",downloadAsPDF)

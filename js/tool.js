const svg = document.querySelector("svg")
const svgns = "http://www.w3.org/2000/svg"

const svgParameters = document.forms[0]
const svgClear = document.getElementById('clear')
const svgExport = document.getElementById('export')
const svgShape = document.getElementById("svgShape")

const shapeRadius = document.getElementById("shapeRadius")
const shapeWidth = document.getElementById("shapeWidth")
const shapeHeight = document.getElementById("shapeHeight")
const shapeRotation = document.getElementById("shapeRotation")
const generate = document.getElementById("submit")
const clear = document.getElementById("clear")
const exprt = document.getElementById("export")

svgShape.addEventListener('change', () => {
    let selectedShape = svgShape.options[svgShape.selectedIndex].value;

    function disableCircle(){
        shapeRadius.setAttribute("disabled", "disabled")
    }

    function disableRect(){
        shapeWidth.setAttribute("disabled", "disabled")
        shapeHeight.setAttribute("disabled", "disabled")
        shapeRotation.setAttribute("disabled", "disabled")
    }

    function enableButtons(){
        generate.removeAttribute("disabled")
        clear.removeAttribute("disabled")
        exprt.removeAttribute("disabled")
    }

    function disableButtons(){
        generate.setAttribute("disabled", "disabled")
        clear.setAttribute("disabled", "disabled")
        exprt.setAttribute("disabled", "disabled")
    }

    switch (selectedShape){
        case 'default':

            disableCircle()
            disableRect()
            disableButtons()

            break;
        case 'circ':

            disableRect()
            enableButtons()

            shapeRadius.removeAttribute("disabled")

            break;
/*        case 'ellipse':
            console.log("ellipse")
            break;*/
        case 'rect':

            disableCircle()
            enableButtons()

            shapeWidth.removeAttribute("disabled")
            shapeHeight.removeAttribute("disabled")
            shapeRotation.removeAttribute("disabled")

            break;
    }
})

svgParameters.addEventListener('submit', (e) => {
    e.preventDefault()
    new FormData(svgParameters)
})

svgParameters.addEventListener('formdata', (e) => {

    let objects = e.formData.get('svgObjects')
    let diameter = e.formData.get('svgDiameter')
    let shape = e.formData.get('svgShape')
    let width = e.formData.get('shapeWidth')
    let height = e.formData.get('shapeHeight')
    let rotation = e.formData.get('shapeRotation')
    let radius = e.formData.get('shapeRadius')

    function convertDegree(deg) {
        return deg * (Math.PI / 180)
    }

    function svgObjects(objects){
        let val = (360 / objects)
        return convertDegree(val)
    }

    function rotateObject(object, deg, x, y, width, height){
        let originX = x + (width / 2)
        let originY = y + (height / 2)

        return object.setAttribute("transform", "rotate(" + deg + " " + originX + " " + originY + ")")
    }

    function drawCirc(x, y, radius){
        const circ = document.createElementNS(svgns, "circle");

        circ.setAttribute("cx", x)
        circ.setAttribute("cy", y)
        circ.setAttribute("r", radius)

        svg.appendChild(circ)
    }

    function drawEllipse(x, y, rx, ry){
        const ellipse = document.createElementNS(svgns, "ellipse");

        ellipse.setAttribute("cx", x)
        ellipse.setAttribute("cy", y)
        ellipse.setAttribute("rx", rx)
        ellipse.setAttribute("ry", ry)

        svg.appendChild(ellipse)
    }

    function drawRect(x, y, width, height, rotation = null){
        const rect = document.createElementNS(svgns, "rect");

        rect.setAttribute("x", x)
        rect.setAttribute("y", y)
        rect.setAttribute("width", width)
        rect.setAttribute("height", height)

        if(rotation !== null){
            rotateObject(rect, rotation, x, y, width, height)
        }

        svg.appendChild(rect)
    }

    for (let i = 0; i < objects; i++){
        let x = 50 + ((diameter) * Math.cos( svgObjects(objects) * i ))
        let y = 50 + ((diameter) * Math.sin( svgObjects(objects) * i ))

        switch (shape){
            case 'circ':
                drawCirc(x, y, radius)
                break;
/*            case 'ellipse':
                drawEllipse(x,y,10,10)
                break;*/
            case 'rect':
                drawRect(x, y, width, height, rotation)
                break;
        }

    }

})

svgClear.addEventListener('click', (e) => {
    e.preventDefault()

    while (svg.firstChild) {
        svg.firstChild.remove()
    }
})

function saveSvg(svgEl, name) {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    let svgData = svgEl.outerHTML
    let preface = '<?xml version="1.0" standalone="no"?>\r\n'
    let svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"})
    let svgUrl = URL.createObjectURL(svgBlob)
    let downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = name
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}

svgExport.addEventListener('click', (e) => {
    e.preventDefault()

    saveSvg(svg, 'export.svg')
})

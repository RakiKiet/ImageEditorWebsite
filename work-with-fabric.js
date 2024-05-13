const reader1 = new FileReader();
let isAddingText = false;
let currentSize = 15;
let currentColor = "#4285f4";
let currentTextSize = 15;
let currentFont = 'arial';
let select = document.querySelector('.select');
let draw = document.querySelector('.draw');
let text = document.querySelector('.text');
let colorPicker = document.querySelector('.color-picker');


//init canvas
const initCanvas = (id) => {
    return new fabric.Canvas(id, {
        width: 700,
        height: 290,
        backgroundColor: 'white',
        selection: true,
        freeDrawingCursor: 'crosshair'
    });
}

let canvas = initCanvas('canvas');

function resizeCanvas() {
    const outerCanvasContainer = document.getElementById('drawing-area');

    const ratio = canvas.getWidth() / canvas.getHeight();
    const containerWidth = outerCanvasContainer.clientWidth;
    const scale = containerWidth / canvas.getWidth();
    const zoom = canvas.getZoom() * scale;

    canvas.setDimensions({ width: containerWidth, height: containerWidth / ratio });
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
}
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);


$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

//select mode
select.addEventListener('click', () => {
    canvas.isDrawingMode = false;
    isAddingText = false;
});
//draw mode
draw.addEventListener('click', () => {
    canvas.isDrawingMode = true;
    isAddingText = false;
    canvas.freeDrawingBrush.color = currentColor;
    canvas.freeDrawingBrush.width = currentSize;
    setColorAndSize();
});
//add text mode
text.addEventListener('click', () => {
    isAddingText = !isAddingText;
    if (isAddingText) {
        canvas.defaultCursor = 'text';
    }
});

canvas.on('mouse:down', function (options) {
    if (isAddingText) { // Kiểm tra nếu chế độ thêm văn bản đang được kích hoạt
        const pointer = canvas.getPointer(options.e);
        let textObject = new fabric.IText('', { // Tạo đối tượng văn bản
            left: pointer.x,
            top: pointer.y,
            fontFamily: currentFont,
            fill: currentColor,
            fontSize: currentSize,
            editable: true
        });
        canvas.add(textObject);
        textObject.enterEditing(); // Chuyển đối tượng văn bản sang chế độ chỉnh sửa
        textObject.setSelectionStart(textObject.text.length);
        textObject.setSelectionEnd(textObject.text.length);
        canvas.setActiveObject(textObject);
        // isAddingText = false; // Tắt chế độ thêm văn bản sau khi thêm đối tượng văn bản
        // text.classList.remove('active');
        //canvas.defaultCursor = 'default';
    } else {
        canvas.defaultCursor = 'default';
    }
});
//color picker mode
currentColor = colorPicker.value;
colorPicker.addEventListener('input', () => {
    currentColor = colorPicker.value;
    canvas.freeDrawingBrush.color = currentColor;
    setColor();
});



//activce tool
document.addEventListener('DOMContentLoaded', function () {
    // Lấy tất cả các nút công cụ
    var tools = document.querySelectorAll('.tool');

    tools.forEach(function (tool) {
        // Thêm sự kiện click cho mỗi nút
        tool.addEventListener('click', function () {
            // Loại bỏ class 'active' khỏi tất cả các nút
            tools.forEach(function (item) {
                item.classList.remove('active');
            });
            //console.log(tool.classList[1]);
            // Thêm class 'active' vào nút được click
            tool.classList.add('active');
            showSubTool(tool.classList[1]);
        });

    });
});
//active sub tool
document.addEventListener('DOMContentLoaded', function () {
    // Lấy tất cả các nút công cụ
    var tools = document.querySelectorAll('.sub-tool');

    tools.forEach(function (tool) {
        // Thêm sự kiện click cho mỗi nút
        tool.addEventListener('click', function () {
            // Loại bỏ class 'active' khỏi tất cả các nút
            tools.forEach(function (item) {
                item.classList.remove('active');
            });

            // Thêm class 'active' vào nút được click
            tool.classList.add('active');
        });
    });
});

//show and hide subtool
function showSubTool(toolName) {
    if (toolName != 'color') {
        hideSubTool()
    }
    if (toolName == 'draw') {
        let subTool = document.querySelector('.drawing-tool');
        if (subTool.classList.contains('hide')) {
            subTool.classList.remove('hide');
        }
    }
    if (toolName == 'text') {
        let subTool = document.querySelector('.text-tool');
        if (subTool.classList.contains('hide')) {
            subTool.classList.remove('hide');
            canvas.isDrawingMode = false;
        }
    }
    if (toolName == 'shape') {
        let subTool = document.querySelector('.shape-tool');
        if (subTool.classList.contains('hide')) {
            subTool.classList.remove('hide');
            canvas.isDrawingMode = false;
        }
    }
    if (toolName == 'delete') {
        canvas.isDrawingMode = false;
    }

}


function hideSubTool() {
    let subTool = document.querySelectorAll('.tools-detail .tools');
    subTool.forEach(function (tool) {
        if (!(tool.classList.contains('hide'))) {
            tool.classList.add('hide');
        }
    });
}

//drawing brush mode

function PencilBrush() {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    setColorAndSize();
    hideDensity();
}
function CircleBrush() {
    canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
    setColorAndSize();
    hideDensity();
}
function SprayBrush() {
    canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
    setColorAndSize();
    addDensity();
}
function EraserBrush() {
    canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    canvas.freeDrawingBrush.width = currentSize;
    hideDensity();
}
function setColorAndSize() {
    canvas.freeDrawingBrush.color = currentColor;
    canvas.freeDrawingBrush.width = parseInt(currentSize, 10) || 1;
    canvas.renderAll();
}
//drawing spray mode

//hide spray density input
function hideDensity() {
    let density = document.querySelector('.spray-input');
    if (!(density.classList.contains('hide'))) {
        density.classList.add('hide');
    }
}
function addDensity() {
    let density = document.querySelector('.spray-input');
    if (density.classList.contains('hide')) {
        density.classList.remove('hide');
    }
}

//get brush input

let sizeInput = document.querySelector('#brushSizeInput')
let brushSizeLabel = document.querySelector('#brushSize')
brushSizeLabel.innerHTML = "Kích thước cọ: " + (sizeInput.value / 10).toFixed(2);
sizeInput.addEventListener('input', () => {
    currentSize = document.querySelector('#brushSizeInput').value;
    brushSizeLabel.innerHTML = "Kích thước cọ: " + (sizeInput.value > 0 ? (sizeInput.value / 10).toFixed(2) : 1);
    setColorAndSize();
});
//density input
let densityInput = document.querySelector('#sprayDensityInput')
let densityLabel = document.querySelector('#sprayDensity')
densityLabel.innerHTML = "Mật độ hạt: " + densityInput.value;
densityInput.addEventListener('input', () => {
    canvas.freeDrawingBrush.density = document.querySelector('#sprayDensityInput').value;
    densityLabel.innerHTML = "Mật độ hạt: " + (densityInput.value > 0 ? densityInput.value : 1);
    canvas.renderAll();
});
//get text value input
let textSizeInput = document.querySelector('#textSizeInput');
let textSizeLabel = document.querySelector('#textSize');
textSizeLabel.innerHTML = "Kích thước văn bản: " + textSizeInput.value;
textSizeInput.addEventListener('input', () => {
    currentTextSize = textSizeInput.value;
    textSizeLabel.innerHTML = "Kích thước văn bản: " + (textSizeInput.value > 0 ? textSizeInput.value : 1);
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().set('fontSize', currentTextSize);
    }
    canvas.renderAll();
});
let font = document.querySelector('#textFontInput');
font.addEventListener('input', () => {
    currentFont = font.value;
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().set('fontFamily', currentFont);
    }
    canvas.renderAll();
});

//shape mode

function DrawCircle() {
    canvas.isDrawingMode = false;
    canvas.add(new fabric.Circle({
        radius: 20, fill: currentColor, left: 100, top: 100
    }));
}
function DrawSquare() {
    canvas.isDrawingMode = false;
    canvas.add(new fabric.Rect({
        width: 40, height: 40, fill: currentColor, left: 100, top: 100
    }));
}
function DrawTriangle() {
    canvas.isDrawingMode = false;
    canvas.add(new fabric.Triangle({
        width: 40, height: 40, fill: currentColor, left: 100, top: 100
    }));
}
//upload image không cần gọi hàm vì khi chọn file sẽ tự động chèn hình
const inputFile2 = document.getElementById('upload');
inputFile2.addEventListener("change", function () {
    const file = inputFile2.files[0];
    // Đọc file ảnh
    if (isFileImage(file)) {
        reader1.readAsDataURL(file);
    }
});
//draw image
reader1.addEventListener("load", () => {
    fabric.Image.fromURL(reader1.result, img => {
        canvas.add(img);
        if (!canvas.item(1)) {
            canvas.getObjects()[0].scaleToHeight(canvas.height);
            canvas.getObjects()[0].scaleToWidth(canvas.width);
            console.log(canvas.getObjects()[0].scaleToHeight(canvas.height));
            img.selectable = false;
            img.defaultCursor = 'default';
            img.hoverCursor = 'default';
        } else {
            img.scale(0.25)
        }

        img.viewportCenter();
        canvas.renderAll();
    })
})

//image validation
function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/heic'];

    return file && acceptedImageTypes.includes(file['type'])
}

//delete object
let upperCanvas = document.body
upperCanvas.addEventListener('keydown', (event) => {
    if (event.key === 'Delete') {
        deleteObject()
    }
})

function deleteObject() {
    if (canvas.getActiveObjects().length > 0) {
        canvas.getActiveObjects().forEach(obj => {
            canvas.remove(obj)
        })
    } else {
        canvas.remove(canvas.getActiveObject())
    }
}

//set color for selected object 
function setColor() {
    if (canvas.getActiveObjects().length > 0) {
        console.log(canvas.getActiveObjects()[0].type);
        canvas.getActiveObjects().forEach(obj => {
            if (obj.type === 'i-text') {
                obj.set({ fill: currentColor })
            } else {
                obj.set({ stroke: currentColor })
            }

            if (obj.type === 'group') {
                setTimeout(() => {
                    obj._objects.forEach(item => {
                        item.set({ fill: currentColor })
                    })
                    canvas.renderAll()
                }, 500);
            }

            canvas.renderAll()

            if (obj.type === 'circle' || obj.type === 'rect' || obj.type === 'triangle') {
                obj.set({ fill: currentColor })
                obj.set({ stroke: currentColor })
            }
        })
    }
    canvas.renderAll()
}
//get clicked object

// When a new object is selected
canvas.on('selection:created', function (event) {
    if (event.selected[0].text || isAddingText) {
        let subTool = document.querySelector('.text-tool');
        subTool.classList.remove('hide');
    } else {
        let subTool = document.querySelector('.text-tool');
        subTool.classList.add('hide');
    }
});

// When the selection changes to another object
canvas.on('selection:updated', function (event) {
    if (event.selected[0].text || isAddingText) {
        let subTool = document.querySelector('.text-tool');
        subTool.classList.remove('hide');
    } else {
        let subTool = document.querySelector('.text-tool');
        subTool.classList.add('hide');
    }

});

//undo redo
canvas.on('object:added', function () {
    if (!isRedoing) {
        h = [];
    }
    isRedoing = false;
});

var isRedoing = false;
var h = [];
function undo() {
    if (canvas._objects.length > 0) {
        h.push(canvas._objects.pop());
        canvas.renderAll();
    }
}
function redo() {

    if (h.length > 0) {
        isRedoing = true;
        canvas.add(h.pop());
    }
}

window.addEventListener('keydown', function (e) {
    // Check if Ctrl or Cmd key is pressed along with Z
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undo();
    }
    // Check if Ctrl or Cmd key is pressed along with Shift and Z
    else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        redo();
    }
});

canvas.on('mouse:wheel', function (opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
});
//khai báo
let reader = new FileReader();
const fileInput = document.getElementById('file-input');
const mainImage = document.querySelector('.img-area img');
const templateFilter = document.querySelector('#carouselExampleDark');
const inputFile = document.getElementById("file-input");
var cropImage = document.getElementById('image');
var imagePath = '';
let rotate = 0, flipHorizontal = 1, flipVertical = 1;
const drawBtn = document.getElementById('draw');
const drawBackground = document.querySelector('.drawing-area-background');
const templateImageFilter = document.querySelectorAll('.innerImage');

//đọc file
inputFile.addEventListener("change", function () {
    const file = inputFile.files[0];
    // Đọc file ảnh
    if (isFileImage(file)) {
        reader.readAsDataURL(file);
        inputFile.classList.remove('invalid');
        canvas.clear()
    } else {
        inputFile.classList.add('invalid');
    }

});
//laod ảnh
reader.onload = function () {
    mainImage.src = reader.result;
    imagePath = reader.result;
    resizeTemplateSection()
    showTemplateFilter();
    setImage(reader.result);
    setImageFilter()
    resetSettings()
};

//download ảnh
let download = document.getElementById('downloadBtn')
download.addEventListener('click', downloadImage)
//check neu file là ảnh
function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg', 'image/svg+xml', 'image/svg+xml;charset=utf-8', 'img/heic'];

    return file && acceptedImageTypes.includes(file['type'])
}

function downloadImage() {
    if (imagePath === '') {
        noIamge();
        return
    }
    //tạo canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = mainImage.naturalWidth;
    canvas.height = mainImage.naturalHeight;
    //thêm filter
    ctx.filter = generateFilter();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    //xoay ảnh
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    //lật ảnh
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(mainImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    // //tải ảnh
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}
//crop ảnh


const cropBtn = document.getElementById('crop-btn');
const cropArea = document.querySelector('.crop-area');
var cropper;

function newCropper(cropImage) {
    cropper = new Cropper(cropImage, {
        aspectRatio: 0,
        viewMode: 0
    });
}

function noIamge() {
    inputFile.classList.add('invalid');
    inputFile.classList.add('shake');

    setTimeout(() => {
        inputFile.classList.remove('shake');
    }, 500);
}

//xử lý sự kiện click vào nút crop
cropBtn.addEventListener('click', () => {

    if (imagePath === '') {
        noIamge();
        return
    }
    let img = new Image();
    img.src = mainImage.src;
    cropImage.src = img.src;
    cropArea.style.display = 'flex';
    newCropper(cropImage);

    setTimeout(() => {
        let copperCanvasImg = document.querySelector(".cropper-canvas img");
        copperCanvasImg.style.filter = generateFilter();
    }, 1);
});
//ẩn crop area
let closeCropBtn = document.querySelector('.crop-area .btn-close');

closeCropBtn.addEventListener('click', () => {
    cropArea.style.display = 'none';
    cropper.destroy();
});

cropArea.addEventListener('click ', (e) => {
    if (e.target.classList.contains('crop-area')) {
        cropArea.style.display = 'none';
        cropper.destroy();
    }
});

cropArea.addEventListener('touch', (e) => {
    if (e.target.classList.contains('crop-area')) {
        cropArea.style.display = 'none';
        cropper.destroy();
    }
});
//crop ảnh và trả về ảnh đã crop
const crop = document.getElementById('crop');

crop.addEventListener('click', () => {
    var copperImage = cropper.getCroppedCanvas().toDataURL("image/png");
    imagePath = copperImage;
    mainImage.src = copperImage;
    cropper.destroy();
    cropArea.style.display = 'none';
});
//các nút filter
const brightnessInput = document.querySelector("#brightness");
const saturationInput = document.querySelector("#saturation");
const blurInput = document.querySelector("#blur");
const inversionInput = document.querySelector("#inversion");
const hueRotateInput = document.querySelector("#hue-rotate");
const sepiaInput = document.querySelector("#sepia");
const grayscaleInput = document.querySelector("#gray-scale");
const contrastInput = document.querySelector("#contrast");
const resetBtn = document.querySelector("#reset");
const settings = {};


function resetSettings() {
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    settings.brightness = "100";
    settings.saturation = "100";
    settings.contrast = "100";
    settings.blur = "0";
    settings.inversion = "0";
    settings.hueRotate = "0";
    settings.sepia = "0";
    settings.grayscale = "0";
    brightnessInput.value = settings.brightness;
    saturationInput.value = settings.saturation;
    blurInput.value = settings.blur;
    inversionInput.value = settings.inversion;
    hueRotateInput.value = settings.hueRotate;
    sepiaInput.value = settings.sepia;
    grayscaleInput.value = settings.grayscale;
    contrastInput.value = settings.contrast;
    let borderBottom = document.querySelectorAll(".accordion-button>.after");
    borderBottom.forEach((border) => {
        border.style.width = "0";
    });
}

function updateSetting(key, value) {
    if (!image) return;

    settings[key] = value;
    renderImage();
}

function generateFilter() {
    const { brightness, saturation, blur, inversion, hueRotate, sepia, grayscale, contrast } = settings;

    return `brightness(${brightness}%) saturate(${saturation}%) blur(${blur}px) invert(${inversion}%) hue-rotate(${hueRotate}deg) sepia(${sepia}% ) grayscale(${grayscale}%) contrast(${contrast}%)`;
}
function renderImage() {
    mainImage.style.filter = generateFilter();
    mainImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
}
brightnessInput.addEventListener("input", () => {
    let borderBottom = document.querySelector(`.accordion-button[data-accordion-btn="1"]`).querySelector(".after");
    borderBottom.insertAdjacentHTML("afterend", " ");
    borderBottom.style.width = `${brightnessInput.value / 200 * 100}%`;
    updateSetting("brightness", brightnessInput.value)
}
);
saturationInput.addEventListener("input", () => {
    let borderBottom = document.querySelector(`.accordion-button[data-accordion-btn="2"]`).querySelector(".after");
    borderBottom.insertAdjacentHTML("afterend", " ");
    borderBottom.style.width = `${saturationInput.value / 200 * 100}%`;
    updateSetting("saturation", saturationInput.value)
}
);
blurInput.addEventListener("input", () => {
    let borderBottom = document.querySelector(`.accordion-button[data-accordion-btn="3"]`).querySelector(".after");
    borderBottom.insertAdjacentHTML("afterend", " ");
    borderBottom.style.width = `${blurInput.value / 25 * 100}%`;
    updateSetting("blur", blurInput.value)
}
);
inversionInput.addEventListener("input", () => {
    let borderBottom = document.querySelector(`.accordion-button[data-accordion-btn="4"]`).querySelector(".after");
    borderBottom.insertAdjacentHTML("afterend", " ");
    borderBottom.style.width = `${inversionInput.value / 100 * 100}%`;
    updateSetting("inversion", inversionInput.value)
}
);
hueRotateInput.addEventListener("input", () => {
    let borderBottom = document.querySelector(`.accordion-button[data-accordion-btn="5"]`).querySelector(".after");
    borderBottom.insertAdjacentHTML("afterend", " ");
    borderBottom.style.width = `${hueRotateInput.value / 360 * 100}%`;
    updateSetting("hueRotate", hueRotateInput.value)
}
);
sepiaInput.addEventListener("input", () => {
    let borderBottom = document.querySelector(`.accordion-button[data-accordion-btn="6"]`).querySelector(".after");
    borderBottom.insertAdjacentHTML("afterend", " ");
    borderBottom.style.width = `${sepiaInput.value / 100 * 100}%`;
    updateSetting("sepia", sepiaInput.value)
}
);
grayscaleInput.addEventListener("input", () => {
    let borderBottom = document.querySelector(`.accordion-button[data-accordion-btn="7"]`).querySelector(".after");
    borderBottom.insertAdjacentHTML("afterend", " ");
    borderBottom.style.width = `${grayscaleInput.value / 100 * 100}%`;
    updateSetting("grayscale", grayscaleInput.value)
}
);
contrastInput.addEventListener("input", () => {
    let borderBottom = document.querySelector(`.accordion-button[data-accordion-btn="8"]`).querySelector(".after");
    borderBottom.insertAdjacentHTML("afterend", " ");
    borderBottom.style.width = `${contrastInput.value / 300 * 100}%`;
    updateSetting("contrast", contrastInput.value)
});

// rotate option

const rotateInput = document.querySelectorAll(".option");
rotateInput.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else if (option.id === "vertical") {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        renderImage();
    });
});





resetSettings();
// show range input
$(document).ready(function () {
    $('#reset').on('click', function () {

        resetSettings();
        renderImage()
    });

    $('#draw').on('click', function () {

        $(".drawing-area-background")[0].style.zIndex = 99;
        fabric.Image.fromURL(imagePath, function (img) {
            img.filter = generateFilter();
            //canvas.add(img);
            if (canvas.getObjects().length > 0) {
                canvas.remove(canvas.item(0));
            }
            canvas.insertAt(img, 0);
            // canvas.getObjects()[0].scaleToWidth(canvas.width);
            // canvas.getObjects()[0].scaleToHeight(canvas.height);
            var imgObj = canvas.getObjects()[0];
            var scaleFactor = Math.min(
                canvas.width / imgObj.width,
                canvas.height / imgObj.height
            );
            imgObj.scale(1, 1);
            canvas.setZoom(scaleFactor);
            img.selectable = false;
            img.defaultCursor = 'default';
            img.hoverCursor = 'default';
            //thay vì scale trực tiếp thì có thể scale không đổi kích thước và đổi góc nhìn thông qua zoom
            // if (canvas.getObjects()[0].scaleX > 1) {
            //     canvas.getObjects()[0].scaleX = 1;
            // }
            // if (canvas.getObjects()[0].scaleY > 1) {
            //     canvas.getObjects()[0].scaleY = 1;
            // }
            img.viewportCenter();
            img.set("erasable", false);
            canvas.renderAll();
        });

        // var activeObject = canvas.getActiveObject();
        // if (activeObject) {
        //     if (activeObject.type === 'group') {
        //         activeObject.toActiveSelection();
        //         canvas.requestRenderAll();
        //     }
        // }
    });

    $('.exit').on('click', function () {
        $(".drawing-area-background")[0].style.zIndex = -9999;

    });
});

function showTemplateFilter() {
    templateFilter.classList.remove('hide');
}
function setImage(src) {
    for (let i = 0; i < templateImageFilter.length; i++) {
        templateImageFilter[i].src = src;
    }
}

function resizeTemplateSection() {
    templateFilter.style.width = mainImage.width + 'px';
}
function setImageFilter() {
    for (let i = 0; i < templateImageFilter.length; i++) {
        switch (i) {
            //1977
            case 0:
                settings.contrast = "110";
                settings.brightness = "110";
                settings.saturation = "130";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.sepia = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 1:
                //Aden
                settings.contrast = "90";
                settings.brightness = "120";
                settings.saturation = "85";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.sepia = "0";
                settings.hueRotate = "20";
                settings.blur = "0";
                break;
            case 2:
                //Amaro
                settings.contrast = "90";
                settings.brightness = "110";
                settings.saturation = "150";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 3:
                //Brannan
                settings.contrast = "140";
                settings.brightness = "100";
                settings.saturation = "100";
                settings.sepia = "50";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 4:
                //Brooklyn
                settings.contrast = "90";
                settings.brightness = "110";
                settings.saturation = "100";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 5:
                //Clarendon
                settings.contrast = "120";
                settings.brightness = "100";
                settings.saturation = "125";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 6:
                //Earlybird
                settings.contrast = "90";
                settings.brightness = "100";
                settings.saturation = "100";
                settings.sepia = "20";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 7:
                //Gingham
                settings.contrast = "100";
                settings.brightness = "105";
                settings.saturation = "100";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "350";
                settings.blur = "0";
                break;
            case 8:
                //Hudson
                settings.contrast = "90";
                settings.brightness = "120";
                settings.saturation = "110";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 9:
                //Inkwell
                settings.contrast = "110";
                settings.brightness = "110";
                settings.saturation = "100";
                settings.sepia = "30";
                settings.grayscale = "100";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 10:
                //Lofi
                settings.contrast = "150";
                settings.brightness = "100";
                settings.saturation = "110";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 11:
                //Maven
                settings.contrast = "95";
                settings.brightness = "95";
                settings.saturation = "150";
                settings.sepia = "25";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 12:
                //Perpetua
                settings.contrast = "100";
                settings.brightness = "100";
                settings.saturation = "100";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 13:
                //Reyes
                settings.contrast = "85";
                settings.brightness = "110";
                settings.saturation = "75";
                settings.sepia = "22";
                settings.grayscale = "0";
                settings.sepia = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 14:
                //Stinson
                settings.contrast = "75";
                settings.brightness = "115";
                settings.saturation = "85";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 15:
                //Toaster
                settings.contrast = "150";
                settings.brightness = "90";
                settings.saturation = "100";
                settings.sepia = "0";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 16:
                //Walden
                settings.contrast = "100";
                settings.brightness = "110";
                settings.saturation = "160";
                settings.sepia = "30";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "350";
                settings.blur = "0";
                break;
            case 17:
                //Valencia
                settings.contrast = "108";
                settings.brightness = "108";
                settings.saturation = "100";
                settings.sepia = "8";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            case 18:
                //Xpro2
                settings.contrast = "100";
                settings.brightness = "100";
                settings.saturation = "100";
                settings.sepia = "30";
                settings.grayscale = "0";
                settings.inversion = "0";
                settings.hueRotate = "0";
                settings.blur = "0";
                break;
            default:
                resetSettings();
                break;

        }

        templateImageFilter[i].style.filter = generateFilter();
    }
}

function choiseFilter(selection) {
    switch (selection) {
        //1977
        case 0:
            settings.contrast = "110";
            settings.brightness = "110";
            settings.saturation = "130";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.sepia = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 1:
            //Aden
            settings.contrast = "90";
            settings.brightness = "120";
            settings.saturation = "85";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.sepia = "0";
            settings.hueRotate = "20";
            settings.blur = "0";
            break;
        case 2:
            //Amaro
            settings.contrast = "90";
            settings.brightness = "110";
            settings.saturation = "150";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 3:
            //Brannan
            settings.contrast = "140";
            settings.brightness = "100";
            settings.saturation = "100";
            settings.sepia = "50";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 4:
            //Brooklyn
            settings.contrast = "90";
            settings.brightness = "110";
            settings.saturation = "100";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 5:
            //Clarendon
            settings.contrast = "120";
            settings.brightness = "100";
            settings.saturation = "125";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 6:
            //Earlybird
            settings.contrast = "90";
            settings.brightness = "100";
            settings.saturation = "100";
            settings.sepia = "20";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 7:
            //Gingham
            settings.contrast = "100";
            settings.brightness = "105";
            settings.saturation = "100";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "350";
            settings.blur = "0";
            break;
        case 8:
            //Hudson
            settings.contrast = "90";
            settings.brightness = "120";
            settings.saturation = "110";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 9:
            //Inkwell
            settings.contrast = "110";
            settings.brightness = "110";
            settings.saturation = "100";
            settings.sepia = "30";
            settings.grayscale = "100";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 10:
            //Lofi
            settings.contrast = "150";
            settings.brightness = "100";
            settings.saturation = "110";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 11:
            //Maven
            settings.contrast = "95";
            settings.brightness = "95";
            settings.saturation = "150";
            settings.sepia = "25";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 12:
            //Perpetua
            settings.contrast = "100";
            settings.brightness = "100";
            settings.saturation = "100";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 13:
            //Reyes
            settings.contrast = "85";
            settings.brightness = "110";
            settings.saturation = "75";
            settings.sepia = "22";
            settings.grayscale = "0";
            settings.sepia = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 14:
            //Stinson
            settings.contrast = "75";
            settings.brightness = "115";
            settings.saturation = "85";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 15:
            //Toaster
            settings.contrast = "150";
            settings.brightness = "90";
            settings.saturation = "100";
            settings.sepia = "0";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 16:
            //Walden
            settings.contrast = "100";
            settings.brightness = "110";
            settings.saturation = "160";
            settings.sepia = "30";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "350";
            settings.blur = "0";
            break;
        case 17:
            //Valencia
            settings.contrast = "108";
            settings.brightness = "108";
            settings.saturation = "100";
            settings.sepia = "8";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        case 18:
            //Xpro2
            settings.contrast = "100";
            settings.brightness = "100";
            settings.saturation = "100";
            settings.sepia = "30";
            settings.grayscale = "0";
            settings.inversion = "0";
            settings.hueRotate = "0";
            settings.blur = "0";
            break;
        default:
            resetSettings();
            break;

    }
    setInputRange()
    renderImage();
}

function setInputRange() {
    brightnessInput.value = settings.brightness;
    saturationInput.value = settings.saturation;
    blurInput.value = settings.blur;
    inversionInput.value = settings.inversion;
    hueRotateInput.value = settings.hueRotate;
    sepiaInput.value = settings.sepia;
    grayscaleInput.value = settings.grayscale;
    contrastInput.value = settings.contrast;
}

document.querySelector('.moveDown').addEventListener('click', function () {
    setTimeout(() => { window.scrollBy(10000, window.innerHeight); }, 400)
});


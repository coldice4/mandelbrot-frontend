const canvas = document.getElementById("mandelbrot-canvas");
const ctx = canvas.getContext('2d');
//let xstart = 1500;
//let ystart = 800;

let xstart = 4600;
let ystart = 1800;

function up() {
    ystart = ystart - 100;
    getData();
}

function down() {
    ystart = ystart + 100;
    getData();
}

function left() {
    xstart = xstart - 100;
    getData();
}

function right() {
    xstart = xstart + 100;
    getData();
}

function getOnPosition() {
    const xinput = document.getElementById('inputX');
    const yinput = document.getElementById('inputY');

    xstart = Number(xinput.value);
    ystart = Number(yinput.value);

    console.log(xinput.value);
    console.log(yinput.value);

    getData();
}


const getData = async () => {
    let xend = xstart + canvas.width;
    let yend = ystart + canvas.height;

    //const response = await fetch(`http://localhost:8081/?xstart=${xstart}&xend=${xend}&ystart=${ystart}&yend=${yend}`);
    const response = await fetch(`https://mandelbrot.unicornheaven.net/api?xstart=${xstart}&xend=${xend}&ystart=${ystart}&yend=${yend}`);
    const jsonData = await response.json();

    let minIteration = 9999999999;
    let maxIteration = 0;
    for (const pixel of jsonData.data.pixels) {
        if (pixel.i > maxIteration) {
            maxIteration = pixel.i;
        }
        if (pixel.i < minIteration) {
            minIteration = pixel.i;
        }
    }

    const imageData = ctx.createImageData(canvas.width, canvas.height);

    let pixels = new Array(canvas.width * canvas.height);
    for (const px of jsonData.data.pixels) {
        const pos = (px.y - ystart) * canvas.width + (px.x - xstart);
        pixels[pos] = px.i;
    }

    let pixel = 0;
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const rgb = getColour(maxIteration, minIteration, pixels[pixel]);
        //console.log(rgb);

        data[i + 0] = rgb[0];
        data[i + 1] = rgb[1];
        data[i + 2] = rgb[2];
        data[i + 3] = 255;

        pixel++;
    }

    console.log(jsonData.data.pixels);
    ctx.putImageData(imageData, 0, 0);


};

function getColour(maxIteration, minIteration, iteration) {
    const f = (iteration - minIteration) / (maxIteration - minIteration);

    const a = (1 - f) / 0.25;
    const X = Math.floor(a);
    const Y = Math.floor(255 * (a - X));

    let r;
    let g;
    let b;

    switch (X) {
        case 0: r = 255; g = Y; b = 0; break;
        case 1: r = 255 - Y; g = 255; b = 0; break;
        case 2: r = 0; g = 255; b = Y; break;
        case 3: r = 0; g = 255 - Y; b = 255; break;
        case 4: r = 0; g = 0; b = 255; break;
    }
    return [r, g, b];
}

getData();
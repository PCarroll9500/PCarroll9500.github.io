// Get the canvas element
var canvas = document.getElementById('pattern');
var ctx = canvas.getContext('2d');

// Set the canvas size to the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Draw the pattern
function createPattern() {
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ffffff';

    for (var i = 0; i < canvas.width; i += 50) {
        for (var j = 0; j < canvas.height; j += 50) {
            if (Math.random() < 0.5) {
                ctx.beginPath();
                ctx.moveTo(i, j);
                ctx.lineTo(i + 25, j + 25);
                ctx.stroke();
            }
        }
    }
}

createPattern();
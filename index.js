const canvas = document.getElementById('pattern');
const ctx = canvas.getContext('2d');

let angle = 0;
const SPEED = 0.006;
const TRAIL = 1.1; // radians of sweep trail

// Fixed blip positions [angle (rad), radius fraction]
const blips = [
    [0.7, 0.55], [1.8, 0.38], [2.6, 0.70], [3.9, 0.45],
    [4.8, 0.62], [5.5, 0.32], [0.2, 0.78], [3.2, 0.58],
];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw() {
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.52;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#07080c';
    ctx.fillRect(0, 0, w, h);

    // Radar circles
    ctx.lineWidth = 0.8;
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * i / 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232,168,48,${0.05 + i * 0.01})`;
        ctx.stroke();
    }

    // Crosshairs
    ctx.strokeStyle = 'rgba(232,168,48,0.06)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    // Diagonals
    const d = R * 0.707;
    ctx.strokeStyle = 'rgba(232,168,48,0.03)';
    ctx.beginPath(); ctx.moveTo(cx - d, cy - d); ctx.lineTo(cx + d, cy + d); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + d, cy - d); ctx.lineTo(cx - d, cy + d); ctx.stroke();

    // Sweep trail (fan of lines fading from sweep angle back)
    const STEPS = 48;
    for (let i = 0; i < STEPS; i++) {
        const a = angle - (i / STEPS) * TRAIL;
        const alpha = (1 - i / STEPS) * 0.18;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.strokeStyle = `rgba(232,168,48,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // Main sweep line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
    ctx.strokeStyle = 'rgba(232,168,48,0.55)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Blips — glow when sweep passes them
    blips.forEach(([ba, br]) => {
        const bx = cx + Math.cos(ba) * R * br;
        const by = cy + Math.sin(ba) * R * br;

        // Angular distance behind the sweep (0 = just hit, TRAIL = faded)
        let delta = ((angle - ba) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (delta > Math.PI * 2 - 0.01) delta = 0;
        const fade = delta < TRAIL ? 1 - delta / TRAIL : 0;

        if (fade > 0) {
            // Outer glow ring
            ctx.beginPath();
            ctx.arc(bx, by, 6 + fade * 4, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(232,168,48,${fade * 0.25})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            // Core dot
            ctx.beginPath();
            ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(232,168,48,${0.4 + fade * 0.55})`;
            ctx.fill();
        } else {
            // Dim persistent dot
            ctx.beginPath();
            ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232,168,48,0.12)';
            ctx.fill();
        }
    });

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(232,168,48,0.5)';
    ctx.fill();

    angle += SPEED;
    if (angle > Math.PI * 2) angle -= Math.PI * 2;

    requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();

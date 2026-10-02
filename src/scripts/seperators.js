
function initiateDotSeperator(seperator) {
    const w = seperator.getBoundingClientRect().width;
    const h = seperator.getBoundingClientRect().height;

    const temp_dot = document.createElement("div");
    temp_dot.classList.add("dot");
    document.body.appendChild(temp_dot);
    const r = temp_dot.getBoundingClientRect().width/2;
    document.body.removeChild(temp_dot);
    let d = r*3;

    for (let i = 0; i < w/(2*d)-1; i++) {
        const holder = document.createElement("div");
        holder.classList.add("dotHolder");
        holder.style.left = `${(2*i+1)*d}px`;
        holder.style.top = `${h/2 - r}px`;
        const dot = document.createElement("div");
        dot.classList.add("dot");
        holder.appendChild(dot);

        seperator.appendChild(holder);
    }
}

function initiateDotSeperators() {
    const seperators = document.querySelectorAll('.dotSeperator');
    seperators.forEach(seperator => {
        initiateDotSeperator(seperator);
    });
}

initiateDotSeperators();
initiateLineSeperators();



function distance(dx, dy) {
    return Math.sqrt(dx*dx + dy*dy);
}

var dot_radius = 20;
const influenceRange = 100;


const particles = Array.from(document.querySelectorAll(".dot, .linePart"), element => {
    const rect = element.getBoundingClientRect();
    return {
        element,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
});











function initiateLineSeperator(seperator) {
    const w = seperator.getBoundingClientRect().width;
    const h = seperator.getBoundingClientRect().height;

    for (let i = 0; i < w; i++) {
        const holder = document.createElement("div");
        holder.classList.add("linePartHolder");
        holder.style.left = `${i}px`;
        holder.style.top = `${h/2}px`;
        const spec = document.createElement("div");
        spec.classList.add("linePart");
        holder.appendChild(spec);

        seperator.appendChild(holder);
    }
}

function initiateLineSeperators() {
    const seperators = document.querySelectorAll('.lineSeperator');
    seperators.forEach(seperator => {
        initiateLineSeperator(seperator);
    });
}

let pointerX = 0;
let pointerY = 0;
let frameScheduled = false;

document.addEventListener('mousemove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (frameScheduled) return;
    frameScheduled = true;
    
    requestAnimationFrame(() => {
        frameScheduled = false;

        particles.forEach(particle => {
            const dx = pointerX - particle.x;
            const dy = pointerY - particle.y;
            const d = distance(dx, dy);
            const strength = Math.max(0, 1 - d / influenceRange) ** 2;
            const offsetX = d ? -(dx / d) * dot_radius * strength : 0;
            const offsetY = d ? -(dy / d) * dot_radius * strength : 0;

            particle.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
});





function initiateBarSeperator(seperator) {
    const w = seperator.getBoundingClientRect().width;
    const h = seperator.getBoundingClientRect().height;
    
    const temp_bar = document.createElement("div");
    temp_bar.classList.add("bar");
    document.body.appendChild(temp_bar);
    document.body.removeChild(temp_bar);

    for (let i = 0; i < w/10-1; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");

        seperator.appendChild(bar);
    }
}

function initiateBarSeperators() {
    const seperators = document.querySelectorAll('.barSeperator');
    seperators.forEach(seperator => {
        initiateBarSeperator(seperator);
    });
}

initiateBarSeperators(); 


document.addEventListener('mousemove', (event) => {
    var x = event.clientX;
    var y = event.clientY;

    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        var rect = bar.getBoundingClientRect();
        var bx = rect.left; var by = rect.top;

        const dx = x - bx;
        const dy = y - by;
        const d = distance(dx, dy);
        bar.style.scale = `1 ${1 + 9/(1+Math.exp(d/dot_radius - 3))}`
    });
});




let lastScrollX = window.scrollX;
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    const deltaX = window.scrollX - lastScrollX;
    const deltaY = window.scrollY - lastScrollY;

    particles.forEach(particle => {
        particle.x -= deltaX;
        particle.y -= deltaY;
    });

    lastScrollX = window.scrollX;
    lastScrollY = window.scrollY;
}, { passive: true });
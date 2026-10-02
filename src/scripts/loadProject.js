var projectID;
async function get_project() {
    const params = new URLSearchParams(window.location.search);

    projectID = params.get("id");
}
get_project();

const projectPath = `https://ashmanser7-collab.github.io/${projectID}/`;
const projectOrigin = new URL(projectPath).origin;
//const projectPath = "../imaginary-github/";
//const projectOrigin = new URL(projectPath, window.location.href).origin;
let projectData;
let programReady = false;
let programFrame = null;

async function addSlider(id, min, max, step, type, start) {
    const section = document.getElementById(`${type}-variables`);

    var container = document.createElement("div");
    container.classList.add("variableContainer");

    const label = document.createElement("label");
    label.textContent = id;

    var slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.id = id;
    slider.value = start;
    label.htmlFor = slider.id;

    const value = document.createElement("input");
    value.type = "number";
    value.classList.add("variableValue");
    value.min = min;
    value.max = max;
    value.step = step;
    value.value = slider.value;
    value.setAttribute("aria-label", `${id} value`);

    const updateModule = () => {
        if (type !== "active" || !programReady) return;

        programFrame.contentWindow.postMessage(
            {type: "set-variable", id, value: Number(slider.value)},
            projectOrigin
        );
    };

    slider.addEventListener("input", () => {
        value.value = slider.value;
        updateModule();
    });

    value.addEventListener("input", () => {
        if (value.value === "") return;

        slider.value = value.value;
        value.value = slider.value;
        updateModule();
    });

    container.append(label, value, slider);
    section.appendChild(container);
}

addSlider("width", 0, screen.width * 0.96, 1, "other", 500);
addSlider("height", 0, screen.height, 1, "other", 500);


async function loadData() {
    const file = await fetch(projectPath + "data.json");
    projectData = await file.json();

    const heading = document.getElementById("heading");
    heading.textContent = projectData.name;

    for (const variable of projectData.variables) {
        addSlider(variable.id, variable.min, variable.max, variable.step, variable.type, variable.default);
    }

    const description = document.getElementById("description");
    description.textContent = projectData.description;
    const controls = document.getElementById("controls");
    controls.textContent = projectData.controls;
}


async function startProgram() {
    const width = Number(document.getElementById("width").value);
    const height = Number(document.getElementById("height").value);

    programFrame = document.getElementById("programFrame");
    programFrame.width = width;
    programFrame.height = height;
    var src = projectPath + `program.html?width=${width}&height=${height}`;

    for (const variable of projectData.variables) {
        src += `&${variable.id}=${document.getElementById(variable.id).value}`;
    }

    programFrame.src = src;
}

async function startup() {
    await loadData();
    await startProgram();
}
startup();

//Path to test github directory: https://ashmanser7-collab.github.io/test-opengl-project/


let firstOutputMessageLogged = false;
window.addEventListener("message", event => {
    if (event.origin !== projectOrigin || event.source !== programFrame?.contentWindow) {
        return;
    }
    if (event.data?.type === "program-ready") {
        programReady = true;

        for (const variable of projectData.variables) {
            if (variable.type !== "active") continue;

            programFrame.contentWindow.postMessage(
                {
                    type: "set-variable",
                    id: variable.id,
                    value: Number(document.getElementById(variable.id).value)
                },
                projectOrigin
            );
        }
        return;
    }

    if (event.data?.type !== "emscripten-output") {return;}

    if (!firstOutputMessageLogged) {
        console.debug("Received Emscripten output message:", {
            origin: event.origin,
            expectedOrigin: projectOrigin,
            data: event.data
        });
        firstOutputMessageLogged = true;
    }

    const output = document.getElementById("console");
    const prefix = event.data.stream === "stderr" ? "[error] " : "";
    const lines = output.value ? output.value.split("\n") : [];
    lines.push(`${prefix}${event.data.text}`);
    if (lines.length > 100) lines.splice(0, lines.length - 100);
    output.value = lines.join("\n");
    output.scrollTop = output.scrollHeight;
});

document.getElementById("reset").addEventListener("click", () => {
    startProgram();
});

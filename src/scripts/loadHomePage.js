async function loadProjects() {
//    const response1 = await fetch("../data/project-types.json");
//    const types = await response1.json();
//
//
//    for (const type of types) {
//        projectSetDict[type.name] = document.createElement("div");
//
//        projectSetDict[type.name].classList.add("projectSection");
//
//        const header = document.createElement("div");
//        header.classList.add("row");
//        header.innerHTML = `<h2>${type.name} Projects<\h2>`
//
//        projectSetDict[type.name].appendChild(header);
//    }
    const projectSetDict = {};
    
    const response = await fetch("../data/project-list.json");
    const projects = await response.json();

    for (const project of projects) {
        const box = document.createElement("div");

        box.classList.add("project");

        box.innerHTML = `
            <img src="../../public/images/thumbnails/${project.thumbnail}" class="img">
            <div class="projectTxt">
                <strong style="font-size: 1.3em;">${project.name}</strong>
                <p style="text-indent: 5%;">${project.description}</p>
            </div>
        `;

        box.addEventListener("click", () => {
                window.location.href = `${project.type}-project.html?id=${project.id}`;
        });

        if (!(project.type in projectSetDict)) {
            projectSetDict[project.type] = document.createElement("div");

            projectSetDict[project.type].classList.add("projectSection");

            const header = document.createElement("div");
            header.classList.add("row");
            header.innerHTML = `<h2>${project.type} Projects<\h2>`

            projectSetDict[project.type].appendChild(header);
        }

        projectSetDict[project.type].appendChild(box);
    }

    for (const projectSet of Object.values(projectSetDict)) {
        const seperator = document.createElement("div");
        seperator.classList.add("seperatorBasic");
        const line = document.createElement("div");
        line.classList.add("middle-line");
        seperator.appendChild(line);
        document.body.appendChild(seperator)
        document.body.appendChild(projectSet);
    }
    
    const footer = document.createElement("footer");
    const gitLink = document.createElement("a");
    gitLink.href = "https://github.com/ashmanser7-collab";
    const gitLogo = document.createElement("img");
    gitLogo.src = "../../public/images/githubWhite.png";
    gitLogo.title = "Check out my Github";
    gitLogo.style.height = '50px';
    gitLink.appendChild(gitLogo);
    footer.appendChild(gitLink);
    document.body.appendChild(footer);
}

loadProjects();
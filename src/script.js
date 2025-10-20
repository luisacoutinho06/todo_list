const board = document.getElementById("board");
const addGroupBtn = document.getElementById("add-group");
const groupNameInput = document.getElementById("group-name");
const groupColorInput = document.getElementById("group-color");
const channel = new BroadcastChannel("postit-board");

let groupCount = 0;

addGroupBtn.addEventListener("click", () => {
    const name = groupNameInput.value.trim() || `Group ${groupCount + 1}`;
    const color = groupColorInput.value;
    const x = 120 + groupCount * 30;
    const y = 120 + groupCount * 30;

    const postit = createGroup(name, color, x, y);

    channel.postMessage({
        type: "addGroup",
        name,
        color,
        x,
        y,
        tasks: []
    });

    groupNameInput.value = "";
});


function createGroup(name, color, x, y, tasks = []) {
    const postit = document.createElement("div");
    postit.className = "postit";
    postit.style.background = color;
    postit.style.left = `${x}px`;
    postit.style.top = `${y}px`;

    postit.innerHTML = `
    <h5 contenteditable="true">${name}</h5>
    <div class="task-list"></div>
    <div class="input-group mt-2">
      <input type="text" class="form-control form-control-sm bg-transparent" placeholder="Add task">
      <button class="btn btn-outline-dark btn-sm">+</button>
    </div>
  `;

    board.appendChild(postit);
    enableDrag(postit);
    setupTaskSystem(postit);

    const list = postit.querySelector(".task-list");
    tasks.forEach(taskText => {
        const task = document.createElement("div");
        task.className = "task";
        task.innerHTML = `
      <span>${taskText}</span>
      <div>
        <button title="Done">✓</button>
        <button title="Delete">✕</button>
      </div>
    `;
        list.appendChild(task);
        setupTaskActions(task);
    });

    groupCount++;
    return postit;
}


function setupTaskSystem(postit) {
    const input = postit.querySelector("input");
    const btn = postit.querySelector("button");
    const list = postit.querySelector(".task-list");

    btn.addEventListener("click", () => {
        const text = input.value.trim();
        if (!text) return;

        const task = document.createElement("div");
        task.className = "task";
        task.innerHTML = `
    <span>${text}</span>
    <div>
      <button title="Done">✓</button>
      <button title="Delete">✕</button>
    </div>
  `;
        list.appendChild(task);
        input.value = "";
        setupTaskActions(task);

        channel.postMessage({
            type: "addTask",
            groupName: postit.querySelector("h5").textContent,
            text
        });
    });
}

function setupTaskActions(task) {
    const [doneBtn, delBtn] = task.querySelectorAll("button");

    doneBtn.addEventListener("click", () => {
        task.classList.toggle("completed");
        channel.postMessage({
            type: "toggleTask",
            text: task.querySelector("span").textContent,
        });
    });

    delBtn.addEventListener("click", () => {
        task.remove();
        channel.postMessage({
            type: "removeTask",
            text: task.querySelector("span").textContent,
        });
    });
}

function enableDrag(el) {
    let isDragging = false, offsetX, offsetY;

    el.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        el.style.transition = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        requestAnimationFrame(() => {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            el.style.left = `${newX}px`;
            el.style.top = `${newY}px`;

            // Broadcast da posição
            channel.postMessage({
                type: "moveGroup",
                name: el.querySelector("h5").textContent,
                x: newX,
                y: newY
            });
        });
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            el.style.transition = "transform 0.2s ease";
            isDragging = false;
        }
    });
}


// --- BroadcastChannel Sync ---
channel.onmessage = (e) => {
    const { type, name, color, x, y, tasks, groupName, text } = e.data;

    if (type === "addGroup") {
        createGroup(name, color, x || 150 + Math.random() * 100, y || 100 + Math.random() * 100, tasks || []);
    }

    if (type === "moveGroup") {
        const postit = [...document.querySelectorAll(".postit")]
            .find(p => p.querySelector("h5").textContent === name);
        if (postit) {
            postit.style.left = `${x}px`;
            postit.style.top = `${y}px`;
        }
    }

    if (type === "addTask") {
        const postit = [...document.querySelectorAll(".postit")]
            .find(p => p.querySelector("h5").textContent === groupName);
        if (postit) {
            const list = postit.querySelector(".task-list");
            const task = document.createElement("div");
            task.className = "task";
            task.innerHTML = `
        <span>${text}</span>
        <div>
          <button title="Done">✓</button>
          <button title="Delete">✕</button>
        </div>
      `;
            list.appendChild(task);
            setupTaskActions(task);
        }
    }
};

const groupColorSelect = document.getElementById("group-color");

groupColorSelect.addEventListener("change", () => {
    const selectedColor = groupColorSelect.value;
    groupColorSelect.style.backgroundColor = selectedColor;
    groupColorSelect.style.color = "#000";
});

window.addEventListener("DOMContentLoaded", () => {
    groupColorSelect.style.backgroundColor = groupColorSelect.value;
    groupColorSelect.style.color = "#000";
});

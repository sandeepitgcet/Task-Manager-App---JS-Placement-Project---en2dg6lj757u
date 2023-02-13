const createTaskRef = document.querySelector(".create-task");
const root = document.querySelector(":root");
const modal = document.querySelector(".modal");
modal.style.display = "none";

const taskStatus = {
  OPEN: "open",
  INPROGRESS: "inProgress",
  INREVIEW: "inReview",
  DONE: "done",
};

const openTask = document.getElementById("open");
const inProgressTask = document.getElementById("inProgress");
const inReviewTask = document.getElementById("inReview");
const doneTask = document.getElementById("done");

//let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//console.log(tasks);
let uid = 1;

document.querySelectorAll(".tasks").forEach((task) => {
  new Sortable(task, {
    group: "shared",
    ghostClass: "ghost",
    animation: 200,

    setData: function (dataTransfer, dragEl) {
      dataTransfer.setData("Text", dragEl.textContent);
      console.log(dragEl, dragEl.textContent);
    },
    onAdd: function (/**Event*/ evt) {
      console.log(evt);
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      console.log(evt.item.id);
      tasks.forEach((t) => {
        if (evt.item.id == t.id) {
          t.status = evt.target.id;
        }
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log(tasks);
    },
  });
});

function render() {
  document.querySelectorAll(".tasks").forEach((task) => {
    task.innerHTML = "";
  });
  //console.log("total tasks: " + tasks.length);
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task card p-2 rounded-0";
    div.id = task.id;
    div.onclick = (event) => {
      showModal(event, task.id);
    };

    const divBody = document.createElement("div");
    divBody.className = "card-body p-2";
    divBody.style.height = "80px";
    divBody.id = task.id;

    const title = document.createElement("h5");
    title.className = "card-title";
    title.innerText = task.title;
    title.id = task.id;

    const description = document.createElement("p");
    description.className = "card-text text-truncate w-100";
    description.innerText = task.desc;
    description.id = task.id;

    divBody.appendChild(title);
    divBody.appendChild(description);
    div.appendChild(divBody);
    if (task.status === taskStatus.OPEN) {
      openTask.appendChild(div);
    } else if (task.status === taskStatus.INPROGRESS) {
      inProgressTask.appendChild(div);
    } else if (task.status === taskStatus.INREVIEW) {
      inReviewTask.appendChild(div);
    } else {
      doneTask.appendChild(div);
    }
  });
}
render();

function createTaskHandler(event) {
  //console.log(event.key);
  showModal(event, window.crypto.randomUUID());
}

document
  .querySelector(".create-task")
  .addEventListener("click", createTaskHandler);

document.querySelector(".close").onclick = function () {
  modal.style.display = "none";
};

document.querySelectorAll(".task").forEach((task) => {
  task.addEventListener("click", (event) => {
    const taskId = event.currentTarget.id;

    showModal(event, taskId);
  });
});

function showModal(event, taskId) {
  console.log("task Id is " + event.target.id);
  //console.log("Src ELement "+event.currentTarget.outerHTML);
  modal.style.display = "flex";
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-desc");
  const id = document.getElementById("id");
  const category = document.getElementById("category");
  const modalRef = document.querySelector(".modal-header");
  let tasks = localStorage.getItem("tasks");
  if (tasks) {
    tasks = JSON.parse(tasks);
  } else {
    tasks = [];
  }
  console.log(tasks.findIndex((task) => task.id === taskId));
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    title.value = "";
    desc.value = "";
    id.value = taskId;
    category.value = "open";
    document.getElementById("deleteTask").disabled = true;
    modalRef.style.backgroundColor = "blueviolet";
  } else {
    taskId = event.target.id;
    title.value = tasks[taskIndex].title;
    desc.value = tasks[taskIndex].desc;
    id.value = tasks[taskIndex].id;
    category.value = tasks[taskIndex].status;
    document.getElementById("deleteTask").disabled = false;
    switch (tasks[taskIndex].status) {
      case taskStatus.OPEN:
        modalRef.style.backgroundColor = "blueviolet";
        break;
      case taskStatus.INPROGRESS:
        modalRef.style.backgroundColor = "yellowgreen";
        break;
      case taskStatus.INREVIEW:
        modalRef.style.backgroundColor = "rgb(235, 60, 208)";
        break;
      case taskStatus.DONE:
        modalRef.style.backgroundColor = "green";
        break;
      default:
        break;
    }
  }
}

const saveHandler = (event) => {
  event.preventDefault();
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-desc");
  const id = document.getElementById("id");
  const category = document.getElementById("category");
  if (title.value == "") {
    alert("Please enter Title");
    return;
  }
  const data = {
    id: id.value,
    title: title.value,
    desc: desc.value,
    status: category.value,
  };
  let tasks = localStorage.getItem("tasks");
  if (tasks) {
    tasks = JSON.parse(tasks);
  } else {
    tasks = [];
  }
  const taskIndex = tasks.findIndex((x) => x.id == data.id);
  if (taskIndex === -1) {
    tasks.push(data);
  } else {
    tasks[taskIndex] = data;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  modal.style.display = "none";
  render();
};

document.querySelector("#save").addEventListener("click", saveHandler);
document.getElementById("deleteTask").addEventListener("click", (event) => {
  const ID = document.getElementById("id").value;
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(
    tasks.findIndex((task) => task.id === ID),
    1
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
  modal.style.display = "none";
  render();
});

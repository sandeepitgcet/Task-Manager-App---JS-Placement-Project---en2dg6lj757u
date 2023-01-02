

const taskBar = document.querySelector("header h1");
const createTaskRef = document.querySelector(".create-task");

const root = document.querySelector(":root");
const taskBarWidth = taskBar.offsetWidth;
const taskBarHeight= taskBar.offsetHeight;
root.style.setProperty('--width',`${taskBarWidth}px`);
//console.log("width is "+taskBarWidth);

const modal = document.querySelector(".modal")
modal.style.display="none";

const taskStatus = {
    OPEN : "open",
    INPROGRESS: "inProgress",
    INPRVIEW: "inReview",
    DONE: "done"
}
const tasks = [];
let id=1;

// function generateID(){
//     return id++;
// }

document.querySelectorAll(".tasks").forEach(task=>{
    new Sortable(task,
        {
            group: 'shared',
            ghostClass: 'ghost',
            animation:200,
            
            setData: function (dataTransfer, dragEl) {
                dataTransfer.setData('Text', dragEl.textContent);
                //console.log(dragEl.id);
            },
            onAdd: function (/**Event*/evt) {
                console.log();
                tasks.forEach(t=>{
                    if(Number(evt.item.id)==t.id){
                        t.status=evt.target.id;
                    }
                })
            },
            
        }
        
        

    )
})

function render(){
    document.querySelectorAll(".tasks").forEach(task=>{
        task.innerHTML='';
    });
    tasks.forEach(task=>{
        const div = document.createElement("div");
        div.className="task";
        div.innerHTML=task.title;
        //console.log("div id is "+task.id)
        div.id=task.id;
        div.onclick=(event)=>{showModal(event)};
        document.getElementById(task.status).appendChild(div);
    });
}

function createTask(taskTitle){
    const obj = {
        "id":id,
        "title":taskTitle,
        "description":'',
        "status": taskStatus.OPEN
    }
    id++;
    tasks.push(obj);
    render();
    createTaskRef.value='';
}

function createTaskHandler(event){
    //console.log(event.key);
    if(event.key=="Enter" && createTaskRef.value!=''){
        createTask(createTaskRef.value);
    }
}

document.querySelector(".create-task").addEventListener("keydown", createTaskHandler);

function openModal(taskId){
    console.log("On click added on taskID "+taskId);
    modal.style.display="flex";
}

document.querySelector(".close").onclick=function(){
    modal.style.display="none";
}

document.querySelectorAll(".task").forEach(task=>{
    task.addEventListener("click",showModal);
})


function showModal(event){
    console.log(event.target.id);
    modal.style.display="flex";

    const title= document.getElementById("modal-title");
    const desc= document.getElementById("modal-desc");
    //console.log(tasks[event.target.id-1].title);
    title.value= tasks[event.target.id-1].title;
    title.desc=tasks[event.target.id-1].desc;
    

}

const saveHandler = (event) => {
    event.preventDefault();
    document.forms.namedItem("form");
    const formData = new FormData(form);
    console.log(formData);
}

document.querySelector("#save").addEventListener("click", saveHandler);
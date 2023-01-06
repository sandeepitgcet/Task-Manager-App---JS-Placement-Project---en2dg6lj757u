

const createTaskRef = document.querySelector(".create-task");

const root = document.querySelector(":root");

const modal = document.querySelector(".modal")
modal.style.display="none";

const taskStatus = {
    OPEN : "open",
    INPROGRESS: "inProgress",
    INPRVIEW: "inReview",
    DONE: "done"
}

const openTask = document.getElementById("open");
const inProgressTask = document.getElementById("inProgress");
const inReviewTask = document.getElementById("inReview");
const doneTask = document.getElementById("done");

const tasks = [];
// const openTasks = [];
// const inProgressTasks = [];
// const inReviewTasks = [];
// const doneTasks = [];
let uid=1;

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
    console.log("total tasks: "+tasks.length);
    tasks.forEach(task=>{
        const div = document.createElement("div");
        div.className="task card p-2 rounded-0";
        div.id=task.id;
        div.onclick=(event)=>{showModal(event,task.id)};
        

        const divBody = document.createElement("div");
        divBody.className="card-body p-2";
        divBody.style.height="80px";
        divBodyid=task.id;
        
        const title = document.createElement("h5");
        title.className="card-title";
        title.innerText = task.title;
        title.id=task.id;

        const description = document.createElement("p");
        description.className = "card-text text-truncate w-100";
        description.innerText = task.desc;
        description.id=task.id;

        divBody.appendChild(title);
        divBody.appendChild(description);
        div.appendChild(divBody);
        if(task.status === taskStatus.OPEN){
            openTask.appendChild(div);
        }else if(task.status === taskStatus.INPROGRESS){
            inProgressTask.appendChild(div);
        }else if(taskStatus === taskStatus.INPRVIEW){
            inReviewTask.appendChild(div);
        }else{
            doneTask.appendChild(div);
        }
    });
}


function createTaskHandler(event){
    //console.log(event.key);
    showModal(event,0);
}

document.querySelector(".create-task").addEventListener("click", createTaskHandler);

document.querySelector(".close").onclick=function(){
    modal.style.display="none";
}

document.querySelectorAll(".task").forEach(task=>{
    task.addEventListener("click",(event)=>{
        const taskId = event.event.currentTarget.id;
        
        showModal(event,taskId)
    });
})


function showModal(event,taskId){
    console.log("task Id is "+event.target.id);
    console.log("Src ELement "+event.currentTarget.outerHTML);
    modal.style.display="flex";
    if(taskId==0){
        
        event.target.setAttribute("taskCategory",'open');
    }else{
        taskId=event.target.id;
    }
    const taskCategory = event.target.getAttribute("taskCategory");
    
    
    const title= document.getElementById("modal-title");
    const desc= document.getElementById("modal-desc");
    const id = document.getElementById("id");
    const category = document.getElementById("category");
    if(taskId==0){
        title.value= '';
        desc.value='';
        id.value= uid;
        category.value='open';
        document.getElementById("deleteTask").disabled = true;
    }
    else{
        const task = tasks.find(x => x.id === taskId);
        console.log(JSON.stringify(task));
        title.value= task.title;
        desc.value=task.desc;
        id.value=task.id;
        category.value=task.status;
        document.getElementById("deleteTask").disabled = false;
    }
    //console.log(tasks[event.target.id-1].title);
    
    

}

const saveHandler = (event) => {
    event.preventDefault();
    const title= document.getElementById("modal-title");
    const desc= document.getElementById("modal-desc");
    const id = document.getElementById("id");
    const category = document.getElementById("category");
    if(title.value==''){
        alert("Please enter Title");
        return;
    }
    const data = {
        "id":id.value,
        "title":title.value,
        "desc":desc.value,
        "status":category.value
    }
    console.log("The data is "+ JSON.stringify(data));
    // if(category==='open'){
    //     openTasks.unshift(data);
    // }else if(category === 'inProgress'){
    //     inProgressTasks.unshift(data);
    // }else if(category === 'inReview'){
    //     inReviewTasks.unshift(data);
    // }else if(category === 'done'){
    //     doneTasks.unshift(data);
    // }
    
    if(tasks.findIndex( x => x.id == data.id) !== -1){
        tasks.map(task => {
            if(task.id===data.id){
                task.title=data.title;
                task.desc=data.desc;
                return task;
            }else{
                return task;
            }
        })
    }else{
        uid++;
        tasks.unshift(data);
    }
    
    modal.style.display="none";
    render();
    
}

document.querySelector("#save").addEventListener("click", saveHandler);
document.getElementById("deleteTask").addEventListener("click",(event)=>{
    const ID = document.getElementById("id").value;
    tasks.splice(tasks.findIndex((task) => task.id === ID), 1);
    modal.style.display="none";
    render();
});
const pendingList = document.getElementById("js_pending"),
    finishedList = document.getElementById("js_finished"),
    todoForm = document.querySelector(".js_toDoForm"),
    todoInput = todoForm.querySelector("input"),
    entireTodolist = document.querySelector(".list"),
    progessDiv = document.querySelector(".progress"),
    countPending = progessDiv.querySelector(".count_pending"),
    progressBar = document.getElementById("progress_bar");

const PENDING = "PENDING";
const FINISHED = "FINISHED";

let pendingTask, finishedTask;

function progressFunction() {
    if (pendingList.childElementCount || finishedList.childElementCount) {
        countPending.innerHTML = `${pendingList.childElementCount} more to go`;
        progressBar.max = pendingList.childElementCount + finishedList.childElementCount;
        progressBar.value = finishedList.childElementCount;
        if (pendingList.childElementCount === 0) {
            countPending.innerHTML =`Finished!! Let's go out and enjoy your life! 😆`
        }
    } else {
        countPending.innerHTML = `Nothing to do. Enjoy your life!`
    }
}


function updateFinishedTask(id, text) {
    finishedTask.map((finishedElement) => {
        if (finishedElement.id === id) {
            finishedElement.text = text
        }
    });
};

function updatePendingTask(id, text) {
    pendingTask.map((pendingElement) => {
        if (pendingElement.id === id) {
            pendingElement.text = text
        }
    });
};

function isLiInTodos(li) {
    return li.parentNode.matches("#js_pending")
};

function nonShowingRemover(li, btnName) {
    li.querySelector(`.${btnName}`).classList.remove("non-showing");
}

function buttonRestorer(li) {
    nonShowingRemover(li, "delBtn");
    if (li.querySelector(".finishBtn")) {
        nonShowingRemover(li, "finishBtn")
    } 
    if (li.querySelector(".backBtn")) {
        nonShowingRemover(li, "backBtn")
    }
}

function handleKeyUp(event) {
    if (event.target.value !== "" && event.key === "Enter") {
        event.target.lastKey = event.key;
        const li = event.target.parentNode;
        const span = document.createElement("span");
        span.innerHTML = event.target.value;
        li.replaceChild(span, event.target);
        if (isLiInTodos(li)) {
            updatePendingTask(li.id, span.innerHTML)
        } else {
            updateFinishedTask(li.id, span.innerHTML)
        }
        saveState();
        buttonRestorer(li)
    } else if (event.key === "Escape") {
        event.target.lastKey = event.key;
        const li = event.target.parentNode;
        const span = document.createElement("span");
        span.innerHTML = event.target.name;
        li.replaceChild(span,event.target);
        buttonRestorer(li);
    }
}

const handleFocusOut = (event) => {
    if(event.target.lastKey === undefined) {
        const li = event.target.parentNode;
        const span = document.createElement("span");
        span.innerHTML = event.target.name;
        li.replaceChild(span, event.target);
        buttonRestorer(li);
    }
}

const handleEdit = (event) => {
    const isSpan = event.target.closest("span");
    if (isSpan) {
        const li = isSpan.parentNode;
        const span = li.querySelector("span");
        const input = document.createElement("input");
        input.value = span.innerText;
        li.querySelector(".delBtn").classList.add("non-showing");
        if (li.querySelector(".finishBtn") !== null){
            li.querySelector(".finishBtn").classList.add("non-showing");
        }
        if (li.querySelector(".backBtn") !== null) {
            li.querySelector(".backBtn").classList.add("non-showing");
        }
        input.name = span.innerHTML;
        input.maxLength = "100";
        input.placeholder = "값을 수정해라카이";
        input.autocomplete = "off";
        input.addEventListener("focusout", handleFocusOut);
        input.addEventListener("keyup", handleKeyUp);
        li.replaceChild(input, span)
        input.focus();
    }
}

function removeFromPending(liId) {
    pendingTask = pendingTask.filter(task => {
        return liId !== task.id
    });
}

function removeFromFinished(liId) {
    finishedTask = finishedTask.filter(task => {
        return liId !== task.id
    });
}

function addToFinished(task) {
    finishedTask.push(task);
}

function addToPending(task) {
    pendingTask.push(task);
}

function saveState() {
    localStorage.setItem(PENDING, JSON.stringify(pendingTask));
    localStorage.setItem(FINISHED, JSON.stringify(finishedTask));
}

function deleteTask(e) {
    const li = e.target.parentNode;
    li.parentNode.removeChild(li);
    removeFromFinished(li.id);
    removeFromPending(li.id);
    saveState();
}

function findInPending(liId) {
    return pendingTask.find(task => {
        return task.id === liId;
    })
}

function findInFinished(liId) {
    return finishedTask.find(task => {
        return task.id === liId;
    })
}


function handleFinishClick(e) {
    if (finishedList.childElementCount > 30) {
        alert("고마해라 finish 개수 30개 넘어뿌따")
    } else {
        const li = e.target.parentNode;
        li.parentNode.removeChild(li);
        const task = findInPending(li.id);
        removeFromPending(li.id);
        addToFinished(task);
        paintFinishedTask(task);
        saveState();
    }
    
}

function handleBackClick(e) {
    const li = e.target.parentNode;
    li.parentNode.removeChild(li);
    const task = findInFinished(li.id);
    removeFromFinished(li.id);
    addToPending(task);
    paintPendingTask(task);
    progressFunction();
    saveState();
}

function buildGenericLi(task) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const deleBtn = document.createElement("button");
    span.innerText = task.text;
    deleBtn.innerText = "❌";
    deleBtn.classList.add("delBtn")
    deleBtn.addEventListener("click", deleteTask);
    li.append(span, deleBtn);//두가지 이상 child 로 추가가능
    li.id = task.id;
    return li
}

function paintPendingTask(task) {
    const genericLi = buildGenericLi(task);
    const completeBtn = document.createElement("button");
    completeBtn.innerText = "✅";
    completeBtn.classList.add("finishBtn")
    completeBtn.addEventListener("click",handleFinishClick);
    genericLi.append(completeBtn);
    pendingList.appendChild(genericLi)

}

function paintFinishedTask(task) {
    const genericLi = buildGenericLi(task);
    const backBtn = document.createElement("button");
    backBtn.innerText = "⏪";
    backBtn.classList.add("backBtn")
    backBtn.addEventListener("click", handleBackClick);
    genericLi.appendChild(backBtn);
    finishedList.appendChild(genericLi);    
    progressFunction();
}

function loadState() {
    pendingTask = JSON.parse(localStorage.getItem(PENDING)) || [];
    finishedTask = JSON.parse(localStorage.getItem(FINISHED)) || [];
    // console.log(pendingTask)
    // 전역변수로 설정해준 pedningTask/finishedTask 변수안의 내용을 여기서 채워준다.
}


function restoreState() {
    // console.log(pendingTask)
    pendingTask.forEach(task => {
        paintPendingTask(task)
    });
    finishedTask.forEach(task => {
        paintFinishedTask(task)
    });
}


function getTaskObj(text) {
    return {
        id: String(Date.now()),
        text
    };
}

function handleFormSubmit(event) {
    event.preventDefault();
    if (pendingList.childElementCount > 30) {
        alert("고마해라 Pending 개수 30개 넘어뿌따")
    } else {
        const taskObj = getTaskObj(todoInput.value);
        todoInput.value = ""
        pendingTask.push(taskObj);
        paintPendingTask(taskObj);
        saveState();
        progressFunction();
    }
    
}


function init() {
    todoForm.addEventListener("submit", handleFormSubmit);
    entireTodolist.addEventListener("dblclick", handleEdit)
    loadState();
    restoreState();
    
}


init();
progressFunction();









const btn = document.querySelectorAll('.filter-btn');
const addBtn = document.querySelector('.add-btn');
const deleteBtn = document.querySelector('.delete-btn');
const ticketContainer = document.querySelector('.ticket-container');
const filterBtn = document.querySelectorAll('.filter-btn');
let popUpVisible = false;
let selectedPriority = 'pink';
let prevTasks = localStorage.getItem('allTasks');
if (prevTasks != null) {
    prevTasks = JSON.parse(prevTasks);
    for (let i = 0; i < prevTasks.length; i++) {
        let ticket = document.createElement('div');
        ticket.classList.add('actual-ticket');
        ticket.classList.add(prevTasks[i].color);
        ticket.id = prevTasks[i].id;
        ticket.innerHTML = `<div class="ticket-content">
                                    ${prevTasks[i].content}
                                </div>`;
        ticketContainer.appendChild(ticket);
    }
    addingListenersToTickets();
}

function idx(color) {
    if (color == 'blue')
        return 0;
    if (color == 'pink')
        return 1;
    if (color == 'yellow')
        return 2;
    return 3;
}

let colors = [1, 1, 1, 1];
function changeFilters(i) {
    colors[i] = 1 - colors[i];
    ticketContainer.innerHTML = '';
    prevTasks = localStorage.getItem('allTasks');
    if(prevTasks!=null){
    prevTasks = JSON.parse(prevTasks);
    for (let i = 0; i < prevTasks.length; i++) {
        if (colors[idx(prevTasks[i].color)] == 1) {
            let ticket = document.createElement('div');
            ticket.classList.add('actual-ticket');
            ticket.classList.add(prevTasks[i].color);
            ticket.id = prevTasks[i].id;
            ticket.innerHTML = `<div class="ticket-content">
                                    ${prevTasks[i].content}
                                </div>`;
            ticketContainer.appendChild(ticket);
        }
    }
    addingListenersToTickets();
    }
}

for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener('click', changeFilters.bind(this, i));
}

function addingListenersToTickets() {
    let allTickets = document.querySelectorAll('.actual-ticket');
    for (let i = 0; i < allTickets.length; i++) {
        allTickets[i].addEventListener('click', function (e) {
            if (e.currentTarget.classList.contains('active')) {
                e.currentTarget.classList.remove('active');
            } else {
                e.currentTarget.classList.add('active');
            }
        });
    }
}

function deleteFromLocalStorage(id) {
    prevTasks = localStorage.getItem('allTasks');
    prevTasks = JSON.parse(prevTasks);
    for (let i = 0; i < prevTasks.length; i++) {
        if (prevTasks[i].id == id) {
            prevTasks.splice(i, 1);
            localStorage.setItem('allTasks', JSON.stringify(prevTasks));
            return;
        }
    }
}

deleteBtn.addEventListener('click', function (e) {
    let allActiveTickets = document.querySelectorAll('.actual-ticket.active');
    for (let i = 0; i < allActiveTickets.length; i++) {
        let idOfDeleted = allActiveTickets[i].getAttribute('id');
        deleteFromLocalStorage(idOfDeleted);
        allActiveTickets[i].remove();
    }
});

function applyTickMark(e) {
    let classes = e.currentTarget.classList;
    if (classes[2] == 'active') {
        e.currentTarget.innerHTML = ``;
        e.currentTarget.classList.remove('active');
    }
    else {
        e.currentTarget.innerHTML = `<i class="tick-mark fas fa-check"></i>`;
        e.currentTarget.classList.add('active');
    }
}

for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', applyTickMark);
}

function openPopUp(e) {
    if (!popUpVisible) {
        selectedPriority = 'blue';
        let popUp = `<div class="modal-container">
                            <div class="modal">
                                <div class="input-task-area">
                                    <div class="input-task" contenteditable="true">Enter your Task</div>
                                </div>
                                <div class="priority-option">
                                    <div class="priority-btn blue-btn active"></div>
                                    <div class="priority-btn pink-btn"></div>
                                    <div class="priority-btn yellow-btn"></div>
                                    <div class="priority-btn green-btn"></div>
                                </div>
                            </div>
                    </div>`;

        ticketContainer.innerHTML = popUp + ticketContainer.innerHTML;
        popUpVisible = true;

        const priorityBtn = document.querySelectorAll('.priority-btn');
        function removeCurrentActiveClassDiv() {
            for (let i = 0; i < priorityBtn.length; i++) {
                if (priorityBtn[i].classList[2] == 'active') {
                    priorityBtn[i].classList.remove('active');
                    return;
                }
            }
        }

        function applyActiveClassForPopUp(idx, e) {
            let classes = e.currentTarget.classList;
            if (classes[2] != 'active') {
                removeCurrentActiveClassDiv();
                e.currentTarget.classList.add('active');
                selectedPriority = priorityBtn[idx].classList[1].split('-')[0];
            }
        }

        for (let i = 0; i < priorityBtn.length; i++) {
            priorityBtn[i].addEventListener('click', applyActiveClassForPopUp.bind(this, i));
        }

        function closePopUpOnEscape(e) {
            if (e.key === "Escape" || e.key === "Esc") {
                document.querySelector('.modal-container').remove();
                popUpVisible = false;
                document.removeEventListener('keydown', closePopUpOnEscape);
            }
        }

        document.addEventListener('keydown', closePopUpOnEscape);
        let countOfTickets = 0;
        function addTicket(e) {
            if (e.key == 'Enter' && e.shiftKey == false && document.querySelector('.input-task').innerText.trim() != "") {

                let ticket = document.createElement('div');
                ticket.classList.add('actual-ticket');
                ticket.classList.add(selectedPriority);
                let id = uid();
                ticket.id = id;
                ticket.innerHTML = `<div class="ticket-content">
                                    ${document.querySelector('.input-task').innerText}
                                </div>`;
                let content = document.querySelector('.input-task').innerText;
                document.querySelector('.modal-container').remove();
                popUpVisible = false;
                document.removeEventListener('keypress', addTicket);
                document.removeEventListener('keydown', closePopUpOnEscape);

                addingListenersToTickets();
                ticket.addEventListener('click', function (e) {
                    if (e.currentTarget.classList.contains('active')) {
                        e.currentTarget.classList.remove('active');
                    } else {
                        e.currentTarget.classList.add('active');
                    }
                });
                for (let i = 0; i < filterBtn.length; i++) {
                    let classes = filterBtn[i].classList;
                    if (classes[2] != 'active') {
                        filterBtn[i].innerHTML = `<i class="tick-mark fas fa-check"></i>`;
                        filterBtn[i].classList.add('active');
                    }
                    colors[i] = 0;
                    changeFilters(i);
                }
                ticketContainer.appendChild(ticket);

                prevTasks = localStorage.getItem('allTasks');
                if (prevTasks == null) {
                    prevTasks = [];
                    prevTasks.push({ color: selectedPriority, content: content, id: id });
                    localStorage.setItem("allTasks", JSON.stringify(prevTasks));
                } else {
                    prevTasks = JSON.parse(prevTasks);
                    prevTasks.push({ color: selectedPriority, content: content, id: id });
                    localStorage.setItem("allTasks", JSON.stringify(prevTasks));
                }
            }
        }

        document.addEventListener('keypress', addTicket);

        let inputBox = document.querySelector('.input-task');

        function removePlaceholder(e) {
            e.currentTarget.innerHTML = '';
            e.currentTarget.style.color = 'black';
        }
        inputBox.addEventListener('click', removePlaceholder);
    }
}

addBtn.addEventListener('click', openPopUp);

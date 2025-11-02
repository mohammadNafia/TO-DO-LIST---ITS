const parent = document.querySelector("ul");
const input = document.querySelector("input");
const counter = document.getElementById("task-counter");

let todoListState = "";
let todoListItems = [
  {
    id: "1",
    title: " front end course",
    isChecked: true,
  },
  {
    id: "2",
    title: "mini-app course",
    isChecked: true,
  },
  {
    id: "3",
    title: "backend course",
    isChecked: false,
  },
];

function makeNewId() {
  let maxId = 0;
  for (let item of todoListItems) {
    let currentId = Number.parseInt(item.id);
    if (currentId > maxId) {
      maxId = currentId;
    }
  }
  return String(maxId + 1);
}

const _reRenderItems = () => {
  parent.innerHTML = "";

  updateCounter();

  if (todoListItems.length === 0) {
    parent.innerHTML = '<li class="text-gray-400 text-center py-4">No todos yet. Add one above!</li>';
    return;
  }

  for (let i = 0; i < todoListItems.length; i++) {
    _addNewTodoItem(todoListItems[i].title, todoListItems[i].isChecked, todoListItems[i].id, i);
  }
};

const _addNewTodoItem = (title, isChecked, id, index) => {
  const li = document.createElement("li");

  let canMoveUp = index > 0;
  let canMoveDown = index < todoListItems.length - 1;

  li.innerHTML = `
            <div
            class="group cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-lg duration-100 ease-in flex items-center gap-2"
          >
            <div class="flex flex-col gap-1">
              <button onclick="_moveTaskUp('${id}')" ${canMoveUp ? '' : 'disabled'} class="p-1 hover:bg-gray-300 rounded text-black" style="color: black;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: black;">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              </button>
              <button onclick="_moveTaskDown('${id}')" ${canMoveDown ? '' : 'disabled'} class="p-1 hover:bg-gray-300 rounded text-black" style="color: black;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: black;">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            </div>

            <input class="bg-transparent border-none outline-none flex-1 text-gray-700 ${isChecked ? 'line-through' : ''}" value="${title}" oninput="_editInput(event,'${id}')" />          

            <div class="flex flex-col gap-1">
              <div 
                  onclick="_toggleListItem('${id}')"
              class="${
                isChecked ? "bg-green-400" : "bg-gray-200"
              } p-1  rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="text-black lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
              </div>

              <div 
                  onclick="_removeListItemById('${id}')"
              class="bg-red-400 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </div>
            </div>
          </div>
  `;

  parent.appendChild(li);
};
let timeOut;
const _editInput = (event, id) => {
  const value = event.target.value;

  clearTimeout(timeOut);

  for (let item of todoListItems) {
    if (item.id === id) {
      item.title = value;
      break;
    }
  }

  timeOut = setTimeout(() => _reRenderItems(), 500);
};

function _removeListItemById(id) {
  let newItems = [];
  for (let item of todoListItems) {
    if (item.id !== id) {
      newItems.push(item);
    }
  }
  todoListItems = newItems;

  _reRenderItems();
}

function _toggleListItem(id) {
  for (let item of todoListItems) {
    if (item.id === id) {
      item.isChecked = !item.isChecked;
      break;
    }
  }

  _reRenderItems();
}

function _moveTaskUp(id) {
  let currentIndex = -1;
  for (let i = 0; i < todoListItems.length; i++) {
    if (todoListItems[i].id === id) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex <= 0) {
    return;
  }

  let temp = todoListItems[currentIndex];
  todoListItems[currentIndex] = todoListItems[currentIndex - 1];
  todoListItems[currentIndex - 1] = temp;

  _reRenderItems();
}

function _moveTaskDown(id) {
  let currentIndex = -1;
  for (let i = 0; i < todoListItems.length; i++) {
    if (todoListItems[i].id === id) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex >= todoListItems.length - 1 || currentIndex === -1) {
    return;
  }

  let temp = todoListItems[currentIndex];
  todoListItems[currentIndex] = todoListItems[currentIndex + 1];
  todoListItems[currentIndex + 1] = temp;

  _reRenderItems();
}

function updateCounter() {
  let count = 0;
  for (let item of todoListItems) {
    if (item.isChecked === false) {
      count = count + 1;
    }
  }
  counter.textContent = count;
}

const _resetInputValue = () => {
  todoListState = "";
  input.value = "";
};

input.addEventListener("input", (ev) => {
  todoListState = ev.target.value;
});

input.addEventListener("keypress", (ev) => {
  const isEnterPressed = ev.key === "Enter";

  if (isEnterPressed && todoListState.trim() !== "") {
    let newId = makeNewId();
    let newItem = {
      id: newId,
      title: todoListState,
      isChecked: false,
    };
    todoListItems.push(newItem);
    _reRenderItems();
    _resetInputValue();
  }
});

_reRenderItems();
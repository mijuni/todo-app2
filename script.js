const newTodoInputElement = document.querySelector("#new-todo");
const btnElement = document.querySelector("#btn-new-todo");
const formElement = document.querySelector("form");
const todoListElement = document.querySelector("#todo-list");
const btnDeleteElement = document.querySelector("#delete-all-done");

let stateArr = [];

// fetch API with URL
function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((data) => {
      //show todos - GET request by default
      stateArr = data;
      console.log(stateArr);
      showTodos();
    });
}

//Sicherheitsabfrage einbauen
/*
if(respond.ok) {
return response.json()
} else {
  console.log("That was not sucessful.")
}
*/

// function to show todos (rendering)
function showTodos() {
  todoListElement.innerHTML = "";
  stateArr.forEach((todo) => {
    // create checkbox element
    const checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.id = todo.id;
    // checkbox.checked = done:true
    checkboxElement.checked = todo.done;

    //create list element
    const newLi = document.createElement("li");

    // create todo text
    const text = document.createTextNode(todo.description);

    // append text and checkbox elements to list element
    newLi.append(text, checkboxElement);
    // append li element to ul
    todoListElement.appendChild(newLi);

    // add Eventhandler for checkbox element
    checkboxElement.addEventListener("change", updateTodo);
  });
}

// create new todo with API
// POST request - object with data is sent to backend
btnElement.addEventListener("click", () => {
  const newTodoText = newTodoInputElement.value;
  // build object to send data to API
  const newTodo = {
    description: newTodoText,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoFromApi) => {
      // not best use for mutli-device
      /* stateArr.push(newTodoFromApi);
      showTodos(); */
      loadTodos();
      // alternative: to execute only loadTodos() - hence complete state will be loaded
    });
});

// function to update todo status to done
// PUT request - update todos by id(event.target.id)
function updateTodo(event) {
  const id = event.target.id;
  const updatedTodo = {
    // event target = checkbox, parentNode = li element, innerText = innerText from li element
    description: event.target.parentNode.innerText,
    done: event.target.checked,
  };

  fetch("http://localhost:4730/todos/" + id, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  })
    .then((res) => res.json())
    .then((updatedTodoFromApi) => {
      loadTodos();
    });
}

// Eventhandler when button is clicked delete todo
btnDeleteElement.addEventListener("click", deleteTodo);

// function to delete todo from API
// DELETE request - delete done todos(done:true) by id(todo.id)
function deleteTodo() {
  stateArr.forEach((todo) => {
    const todoId = todo.id;
    if (todo.done) {
      fetch("http://localhost:4730/todos/" + todoId, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((newTodoFromApi) => {
          loadTodos();
        });
    }
  });
}

loadTodos();

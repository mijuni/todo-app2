const newTodoInputElement = document.querySelector("#new-todo");
const btnElement = document.querySelector("#btn-new-todo");
const formElement = document.querySelector("form");
const todoListElement = document.querySelector("#todo-list");
const btnDeleteElement = document.querySelector("#delete-all-done");
let stateArr = [];

// Funktion um Todo API zu laden
function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      //Todos anzeigen - Fetch API benutzt GET Methode by default
      stateArr = data;
      showTodos();
    });
}

// Funktion um Todos anzuzeigen (rendering)
function showTodos() {
  todoListElement.innerHTML = "";
  stateArr.forEach((todo) => {
    const newLi = document.createElement("li");
    const text = document.createTextNode(todo.description);
    newLi.appendChild(text);

    todoListElement.appendChild(newLi);
  });
}

// Neues Todo anlegen mit Backend
btnElement.addEventListener("click", () => {
  const newTodoText = newTodoInputElement.value;
  // Objekt bauen dass ans Backend geschickt wird
  const newTodo = {
    description: newTodoText,
    done: false,
  };

  //Objekt ans Backend schicken mit POST Methode
  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoFromApi) => {
      // nicht optimal wenn mutli-device
      stateArr.push(newTodoFromApi);
      showTodos();
      // Alternative wäre wenn man nur loadTodos() ausführt - somit wird kompletter State geladen
    });
});

// DELETE Methode um erledigte Todos zu löschen - mit state checked/ done
/*
btnDeleteElement.addEventlistener("click" () => {
  fetch("http://localhost:4730/todos", {
    method: "DELETE"
  })
    .then((res) => res.json())
    .then(() => {

  });
});
*/

// PUT Methode um bestehendes Todo upzudaten - muss nach state checked erfolgen
/*
const updatedTodo = {
  id: welches Todo man updaten möchte,
  description: "Beschreibung des Todos",
  done: true
}
fetch("http://localhost:4730/todos", {
  method: "PUT",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify(updatedTodo),
})
.then ((res) => res.json())
.then((updatedToDoFromApi) => {
  stateArr.push(updatedToDoFromApi);
  showTodos();
});
*/

loadTodos();

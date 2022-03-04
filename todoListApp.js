function Model() {
  this.todos = []

  this.EditTodo = (id, updatedDescription) => {
    this.todos = this.todos.map((todo) =>
      todo.id === id
        ? { id: todo.id, text: updatedDescription, complete: false }
        : todo
    )
    this.OnTodoListChanged(this.todos)
  }

  this.AddTodo = (description) => {
    if (description.length > 0) {
      let todo = {
        id: this.todos.length > 0 ? this.todos.length + 1 : 1,
        text: description,
        complete: false,
      }
      this.todos.push(todo)
      this.OnTodoListChanged(this.todos)
    }
  }

  this.DeleteTodo = (id) => {
    this.todos = this.todos.filter((todo) => todo.id !== id)
    this.OnTodoListChanged(this.todos)
  }

  this.ToggleTodo = (id) => {
    this.todos = this.todos.map((todo, index) => console.log(index))
    this.OnTodoListChanged(this.todos)
  }

  this.OnTodoListChangedHandler = (callback) => {
    this.OnTodoListChanged = callback
  }
}

function View() {
  this.CreateElement = (tag, className) => {
    let element = document.createElement(tag)
    if (className) element.classList.add(className)
    return element
  }

  this.GetElement = (selector) => {
    let element = document.querySelector(selector)
    return element
  }

  this.input = this.GetElement('#taskText')

  this._todoText = () => {
    return this.input.value
  }

  this._todoTemporaryText = () => {
    return this.input.value
  }

  this._resetInput = () => {
    this.input.value = ''
  }

  this.todoList = this.GetElement('#taskContainer')

  this.DeleteAll = () => {
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild)
    }
  }

  this.CreateTaskElements = (todo) => {
    const tempTaskElement = this.CreateElement('div', 'taskElement')
    tempTaskElement.setAttribute('id', todo.id)

    const span = this.CreateElement('span', 'taskDetail')
    span.setAttribute('id', todo.id)

    const deleteButton = this.CreateElement('button', 'delete')
    deleteButton.setAttribute('id', 'taskButtons')
    deleteButton.innerText = 'DELETE'

    const editButton = this.CreateElement('button', 'edit')
    editButton.setAttribute('id', 'taskButtons')
    editButton.innerText = 'EDIT'

    const checkbox = this.CreateElement('input', 'toggle')
    checkbox.setAttribute('id', todo.id)
    checkbox.type = 'checkbox'
    checkbox.checked = todo.complete

    if (todo.complete) {
      const strike = this.CreateElement('s')
      strike.textContent = todo.text
      span.append(strike)
    } else {
      span.textContent = todo.text
    }

    // span.append(checkbox)
    tempTaskElement.append(span)
    tempTaskElement.append(deleteButton)
    tempTaskElement.append(editButton)

    return tempTaskElement
  }

  this.DisplayTodos = (todos) => {
    this.DeleteAll()

    if (todos.length === 0) {
      let p = this.CreateElement('p')
      p.style.fontWeight = '600'
      p.textContent = 'Nothing to do!'
      this.todoList.append(p)
    } else {
      todos.forEach((todo) => {
        this.todoList.append(this.CreateTaskElements(todo))
      })
    }
  }

  this.AddTodoHandler = (handler) => {
    document.getElementById('addButton').addEventListener('click', () => {
      if (this._todoText) {
        handler(this._todoText())
        this._resetInput()
      }
    })
  }

  this.DeleteTodoHandler = (handler) => {
    this.todoList.addEventListener('click', (event) => {
      if (event.target.className === 'delete') {
        const id = parseInt(event.target.parentElement.id)
        handler(id)
      }
    })
  }

  this.bindEditTodo = (handler) => {
    this.todoList.addEventListener('click', (event) => {
      if (event.target.className === 'edit') {
        let tempToDoText = document
          .getElementById(event.target.parentElement.id)
          .getElementsByClassName('taskDetail')[0]

        tempToDoText.contentEditable = true
        tempToDoText.focus()

        tempToDoText.addEventListener('input', (event) => {
          this._temporaryTodoText = event.target.innerText
        })

        tempToDoText.addEventListener('focusout', (event) => {
          if (this._temporaryTodoText) {
            const id = parseInt(event.target.parentElement.id)
            handler(id, this._temporaryTodoText)
            this._temporaryTodoText = ''
          }
        })
      }
    })
  }

  this.ToggleTodoHandler = (handler) => {
    this.todoList.addEventListener('change', (event) => {
      if (event.target.className === 'toggle') {
        const id = parseInt(event.target.id)
        handler(id)
      }
    })
  }
}

function Controller(model, view) {
  this.model = model
  this.view = view

  this.OnTodoListChanged = (todos) => {
    this.view.DisplayTodos(todos)
  }

  this.AddToDoList = (todoText) => {
    this.model.AddTodo(todoText)
  }

  this.DeleteFromTodoList = (id) => {
    this.model.DeleteTodo(id)
  }

  this.ToggleFromTodoList = (id) => {
    this.model.ToggleTodo(id)
  }

  this.EditTodoList = (id, todoText) => {
    this.model.EditTodo(id, todoText)
  }

  this.model.OnTodoListChangedHandler(this.OnTodoListChanged)
  this.view.AddTodoHandler(this.AddToDoList)
  this.view.DeleteTodoHandler(this.DeleteFromTodoList)
  this.view.bindEditTodo(this.EditTodoList)
  this.view.ToggleTodoHandler(this.ToggleFromTodoList)
  this.OnTodoListChanged(this.model.todos)
}

window.addEventListener('DOMContentLoaded', Start, false)

function Start() {
  let app = new Controller(new Model(), new View())
}

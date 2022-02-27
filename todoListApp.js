function Model() {
  this.todos = []

  this.AddTodo = (description) => {
    console.log('actual input', description)
    let todo = {
      id: this.todos.length > 0 ? this.todos.length + 1 : 1,
      text: description,
      complete: false,
    }
    this.todos.push(todo)
    this.OnTodoListChanged(this.todos)
  }

  this.EditTodo = (id, updatedDescription) => {
    this.todos = this.todos.map((todo) => {
      todo.id === id
        ? { id: todo.id, text: updatedDescription, complete: false }
        : todo
    })
    this.OnTodoListChanged(this.todos)
  }

  this.DeleteTodo = (id) => {
    this.todos = this.todos.filter((todo) => todo.id !== id)
    this.OnTodoListChanged(this.todos)
  }

  this.ToggleTodo = (id) => {
    this.todo = this.todo.map((todo) => {
      todo.id === id
        ? {
            id: todo.id,
            text: todo.text,
            complete: true,
          }
        : todo
    })
    this.OnTodoListChanged(this.todos)
  }

  this.OnTodoListChangedHandler = (callback) => {
    this.OnTodoListChanged = callback
  }
}

/**
 * VIEW
 */
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

  this._todoText = () => {
    console.log(this.input.value)
    return this.input.value
  }

  this._resetInput = () => {
    this.input.value = ''
  }

  this.todoList = this.GetElement('#taskContainer')

  this.DeleteAll = () => {
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild)
      console.log(this.todoList)
    }
  }

  this.DisplayTodos = (todos) => {
    if (todos.length === 0) {
      console.log('Nothing to do!')
      let p = this.CreateElement('p')
      p.textContent = 'Nothing to do!'
      this.todoList.append(p)
    } else {
      todos.forEach((todo) => {
        const ele = this.CreateElement('div')
        ele.setAttribute('id', 'taskElement')

        const span = this.CreateElement('span')
        span.setAttribute('id', 'taskDetail')
        span.contentEditable = true
        span.classList.add('editable')

        const deleteButton = this.CreateElement('button', 'delete')
        deleteButton.setAttribute('id', 'taskButtons')
        deleteButton.innerText = 'DELETE'

        const editButton = this.CreateElement('button', 'edit')
        editButton.setAttribute('id', 'taskButtons')
        editButton.innerText = 'EDIT'

        const checkbox = this.CreateElement('input', 'toggle')
        checkbox.setAttribute('id', 'checkbox')
        checkbox.type = 'checkbox'
        checkbox.checked = todo.complete

        if (todo.complete) {
          const strike = this.CreateElement('s')
          strike.textContent = todo.text
          span.append(strike)
        } else {
          span.textContent = todo.text
        }
        span.append(checkbox)
        ele.append(span)
        ele.append(deleteButton)
        ele.append(editButton)

        this.todoList.append(ele)
      })
    }
  }

  this.AddTodoHandler = (handler) => {
    document.getElementById('addButton').addEventListener('click', () => {
      if (this._todoText) {
        handler('from view')
        // this._resetInput()
      }
    })
  }

  this.DeleteTodoHandler = (handler) => {
    this.todoList.addEventListener('click', (event) => {
      if (event.target.className === 'delete') {
        const id = parseInt(event.target.parentElement.id)
        console.log('delete')
        handler(id)
      }
    })
  }

  this.EditTodoHandler = (handler) => {}

  this.ToggleTodoHandler = (handler) => {
    this.todoList.addEventListener('change', (event) => {
      if (event.target.className === 'toggle') {
        const id = parseInt(event.target.parentElement.id)
        console.log('toggle')
        handler(id)
      }
    })
  }
}

/**
 * CONTROLLER
 * @param {*} model
 * @param {*} view
 */
function Controller(model, view) {
  this.model = model
  this.view = view

  this.OnTodoListChanged = (todos) => {
    this.view.DisplayTodos(todos)
  }

  this.AddToDoList = (todoText) => {
    this.model.AddTodo(todoText)
  }

  this.EditTodoList = (id, todoText) => {
    this.model.EditTodo(id, todoText)
  }

  this.DeleteFromTodoList = (id) => {
    this.model.DeleteTodo(id)
  }

  this.ToggleFromTodoList = (id) => {
    this.model.ToggleTodo(id)
  }

  this.model.OnTodoListChangedHandler(this.OnTodoListChanged)
  this.view.AddTodoHandler(this.AddToDoList)
  this.view.DeleteTodoHandler(this.DeleteFromTodoList)
  this.view.ToggleTodoHandler(this.ToggleFromTodoList)
  this.OnTodoListChanged(this.model.todos)
}

let app = new Controller(new Model(), new View())

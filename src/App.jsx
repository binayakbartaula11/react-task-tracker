import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    setTodos([
      ...todos,
      {
        id: crypto.randomUUID(),
        text: newTodo.trim(),
        completed: false
      }
    ])
    setNewTodo('')
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = (id) => {
    if (!editText.trim()) return
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText.trim() } : todo
    ))
    setEditingId(null)
  }

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
          aria-label="New todo input"
        />
        <button 
          type="submit" 
          className="add-button"
          disabled={!newTodo.trim()}
        >
          Add
        </button>
      </form>

      {isLoading ? (
        <ul className="todo-list">
          {[1, 2, 3].map(i => (
            <li key={i} className="todo-item loading">
              <div style={{ height: '24px', width: '100%' }}></div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="todo-list" role="list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>No todos yet. Add one above!</p>
            </div>
          ) : (
            todos.map(todo => (
              <li 
                key={todo.id} 
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                {editingId === todo.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, todo.id)}
                      className="edit-input"
                      autoFocus
                      aria-label="Edit todo input"
                    />
                    <button 
                      onClick={() => saveEdit(todo.id)} 
                      className="save-button"
                      disabled={!editText.trim()}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                      aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                    />
                    <span className="todo-text">{todo.text}</span>
                    <div className="todo-actions">
                      <button 
                        onClick={() => startEditing(todo)} 
                        className="edit-button"
                        aria-label={`Edit "${todo.text}"`}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteTodo(todo.id)} 
                        className="delete-button"
                        aria-label={`Delete "${todo.text}"`}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default App
import React from 'react'
import Footer from './Footer.jsx'
import AddTodo from '../containers/AddToto.jsx'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default App

import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import Todo from "./components/Todo";
import Filter from "./components/Filter";
import Form from "./components/Form";


export default function App(props) {
  const DATA = [
    { id: "todo-0", name: "Eat", completed: true },
    { id: "todo-1", name: "Sleep", completed: false },
    { id: "todo-2", name: "Repeat", completed: false },
  ];
  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };
  const FILTER_NAMES = Object.keys(FILTER_MAP);

  // State for storing tasks
  //const [tasks, setTasks] = useState(DATA);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  let [editCount, setEditCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/todo/all").then((res) => { return res.json() }
    ).then
      ((value) => { setTasks(value); })
  }, [editCount]
  )
  // Function to add a new task
  function addTask(name) {
    fetch("http://localhost:8080/todo/add?name=" + name + "&completed=false", { method: "post" }).then((res) => {
      console.log(res.text());
      setEditCount(++editCount);
    })
    
    //const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    // setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    // const updatedTasks = tasks.map((task) => {
    //   if (id === task.id) {
    //     return { ...task, completed: !task.completed };
    //   }
    //   return task;
    // });
    // setTasks(updatedTasks);
    const updatedTasks = tasks.filter((task) => task.id == id);
    fetch("http://localhost:8080/todo/update?id=" + id + "&completed=" + !updatedTasks.completed, { method: "post" }).then(
      (res) => {
        console.log(res.text());
        setEditCount(++editCount);
      }
    )
  }



  function editTask(id, newName) {
    // const editedTasks = tasks.map((task) => {
    //   if (id === task.id)
    //     return { ...task, name: newName };
    //   return task;
    // });
    //setTasks(editedTasks);
    fetch("http://localhost:8080/todo/edit?id=" + id+"&newName="+newName, { method: "post" }).then(
      (res) => {
        console.log(res.text());
        setEditCount(++editCount);
      })

  }

  function deleteTask(id) {
    // const deletedTasks = tasks.filter((task) => id !== task.id);
    // setTasks(deletedTasks);
    fetch("http://localhost:8080/todo/delete?id=" + id, { method: "post" }).then(
      (res) => {
        console.log(res.text());
        setEditCount(++editCount);
      })

  }

  // Array of tasks mapped to Todo components
  const taskList = tasks.filter(FILTER_MAP[filter]).map((task) => (
    <Todo key={task.id}
      id={task.id}
      name={task.name}
      completed={task.completed}
      toggleTaskCompleted={toggleTaskCompleted}
      editTask={editTask}
      deleteTask={deleteTask} />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <Filter key={name} name={name}
      isPressed={name === filter}
      setFilter={setFilter} />
  ));

  // Heading text showing remaining tasks
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingtext = `${tasks.length} ${tasksNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">{headingtext}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

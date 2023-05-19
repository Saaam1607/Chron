import 'bootstrap/dist/css/bootstrap.min.css';
import "./To-do.css";
import { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from "react-bootstrap";

const CookieManager = require("../tokenManager/cookieManager.js")

const api_base = "/api/v1/todos";


export default function Todo(){
    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [addButtonDisabled, setAddButtonDisabled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(CookieManager.generateHeader() !== undefined);


    useEffect(() => {
        GetTodos();
      }, []);
    
      useEffect(() => {
        setIsAuthenticated(CookieManager.generateHeader() !== undefined);
      }, [CookieManager.generateHeader()]);
    
      const GetTodos = () => {
        fetch(api_base + "/",{
          method: "GET",
          headers: CookieManager.generateHeader()
        })
          .then((res) => {
            if (res.status === 204) {
              return { success: true, message: "Non ci sono task da mostrare" };
            } else if (res.ok) {
              return res.json();
            } else {
              throw new Error("Errore nella richiesta. Status:" + res.status);
            }
    
          })
          .then((data) => {
            if (data && data.tasks) {
              setTodos(data.tasks);
            } else {
              setTodos([]);
            }
          })
          .catch((error) => {
            console.error("Errore: " + error);
            alert(error );
          });
      };
    
      const completeTodo = async (id) => {
        try {
          const response = await fetch(api_base + "/complete/" + id, {
            method: "PUT",
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
          }
      
          const data = await response.json();
      
          setTodos((todos) =>
            todos.map((todo) =>
              todo._id === data?.result._id
                ? { ...todo, contrassegna: data.result.contrassegna }
                : todo
            )
          );
        } catch (error) {
          console.error("Errore: " + error);
          alert(error);
        }
      };
    
      const addTodo = async () => {
        if (addButtonDisabled) {
          return; 
        }
        setAddButtonDisabled(true);
        const data = await fetch(api_base + "/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: newTodo,
            dataScadenza: newDeadline ? newDeadline : null,
          }),
        }).then((res) => res.json());
    
        if (data.success) {
          const { task } = data;
          const updatedTodos = [...todos, task];
          setTodos(updatedTodos);
        } else {
          alert("Error: " + data.message);
        }
    
        setPopupActive(false);
        setNewTodo("");
        setNewDeadline("");
        setAddButtonDisabled(false);
      };
    
      const deleteTodo = async (id) => {
        await fetch(api_base + "/delete/" + id, { method: "DELETE" });
        setTodos((todos) => todos.filter((todo) => todo._id !== id));
      };
    
      return (
        <div className="container py-5">
          {isAuthenticated ? (
                  <>
                  <h1 className="text-center mb-5">Welcome BACK!</h1>
                  <h4 className="mb-3">Your tasks</h4>
        
                  <div className="d-flex justify-content-between mb-3">
                    <Button variant="primary" className="add-button" onClick={() => setPopupActive(true)}>
                      Add Task
                    </Button>
                    <Form.Select className="sort-select">
                      <option>Sort by...</option>
                      <option>Name</option>
                      <option>Deadline</option>
                      <option>Group</option>
                    </Form.Select>
                  </div>
        
                  <Table bordered hover>
                    <thead>
                      <tr>
                        <th className="text-center">Completed</th>
                        <th>Name</th>
                        <th>Deadline</th>
                        <th>Group</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {todos.length > 0 ? (
                        todos.map((todo) => (
                          <tr key={todo._id}>
                            <td className="text-center">
                              <Form.Check
                                type="checkbox"
                                checked={todo.contrassegna}
                                onChange={() => completeTodo(todo._id)}
                              />
                            </td>
                            <td>{todo.nome}</td>
                            <td>
                              {todo.dataScadenza
                                ? new Date(todo.dataScadenza).toLocaleDateString()
                                : "-"}
                            </td>
                            <td>{todo.gruppo ? todo.gruppo : "-"}</td>
                            <td className="text-center">
                              <Button variant="danger" onClick={() => deleteTodo(todo._id)}>
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No tasks found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Modal show={popupActive} onHide={() => setPopupActive(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Add a new task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter task name"
                          value={newTodo}
                          onChange={(e) => setNewTodo(e.target.value)}
                        />
                      </Form.Group>
        
                      <Form.Group className="mb-3" controlId="formDeadline">
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control
                          type="date"
                          value={newDeadline}
                          onChange={(e) => setNewDeadline(e.target.value)}
                        />
                      </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" className="add-button" onClick={() => setPopupActive(false)}>
                        Close
                      </Button>
                      <Button variant="primary" className="add-button" onClick={addTodo}>
                        Add
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </> ) : (
            <div className="text-center mb-5">
              <p>Utente non autenticato. Accedi per visualizzare i task.</p>
              <a href="/profilo">Pagina di autenticazione</a>
            </div>
          )}
        </div>
    );
}
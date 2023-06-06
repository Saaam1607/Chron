import 'bootstrap/dist/css/bootstrap.min.css';
import "./To-do.css";
import { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from "react-bootstrap";

import CookieManager from'../tokenManager/cookieManager';

const api_base = "/api/v1/todos";


export default function Todo(){
    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [addButtonDisabled, setAddButtonDisabled] = useState(false);
    const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(CookieManager.generateHeader() !== undefined);
    const [sortOption, setSortOption] = useState("");


    useEffect(() => {
        GetTodos();
    }, [sortOption]);

    const GetTodos = async () => {
        try {
            const url = sortOption ? `${api_base}/ordinata?sort=${sortOption}` : `${api_base}/`;
            const res = await fetch(url, {
                method: "GET",
                headers: CookieManager.generateHeader(),
            });
        
            if (res.status === 204) {
                return;
            } else if (res.ok) {
                const data = await res.json();
                if (data && data.tasks) {
                    setTodos(data.tasks);
                } else {
                    setTodos([]);
                }
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error("Errore:", error);
            alert(error);
        }
    };

    const addTodo = async () => {
        if (addButtonDisabled) {
            return;
        }
        setAddButtonDisabled(true);
        const data = await fetch(api_base + "/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CookieManager.getAuthToken()}`,
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

    const completeTodo = async (id) => {
        try {
            const response = await fetch(api_base + "/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${CookieManager.getAuthToken()}`,
                },
                body: JSON.stringify({ id }),
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

    const deleteTodo = async (id) => {
        const todo = todos.find((todo) => todo._id === id);
        if (todo.contrassegna) {
            setDeleteButtonDisabled(true);
            try {
                const response = await fetch(api_base + "/", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${CookieManager.getAuthToken()}`,
                    },
                    body: JSON.stringify({ id }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
    
                setTodos((todos) => todos.filter((todo) => todo._id !== id));
            } catch (error) {
                console.error("Errore: " + error);
                alert(error);
            }
            setDeleteButtonDisabled(false);
        } else {
            alert("Non puoi eliminare una task non contrassegnata come completata.");
        }
    };

    const handleSortOptionChange = (e) => {
        const selectedOption = e.target.value;
        if (selectedOption !== "") {
            setSortOption(selectedOption);
        } 
    };

    return (
        <div className="container py-5">
            {isAuthenticated ? (
                <>
                    <h1 className="text-center mb-5">TO-DO</h1>
                    {/* <h4 className="mb-3">Your Task Agenda</h4> */}

                    <div className="d-flex justify-content-between mb-3">
                        <Button variant="primary" className="add-button" onClick={() => setPopupActive(true)}>
                            Aggiungi Task
                        </Button>
                        <Form.Select className="sort-select" value={sortOption} onChange={handleSortOptionChange}>
                            <option value="">Ordina per...</option>
                            <option value="name">Nome</option>
                            <option value="date">Deadline</option>
                            <option value="group">Gruppo</option>
                        </Form.Select>
                    </div>

                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th className="text-center">Completata</th>
                                <th>Nome</th>
                                <th>Deadline</th>
                                <th>Gruppo</th>
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
                                        <td>{todo.nomeGruppo ? todo.nomeGruppo : "-"}</td>
                                        <td className="text-center">
                                            <Button variant="danger" onClick={() => deleteTodo(todo._id)} disabled={deleteButtonDisabled}>
                                                Elimina
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Non ci sono task da mostrare.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Modal
                        show={popupActive}
                        onHide={() => setPopupActive(false)}
                        dialogClassName="custom-modal-dialog"
                        backdrop="static"
                        style={{ minWidth: 'fit-content' }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Aggiungi una nuova task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter task name"
                                    style={{ width: '300pt' }}
                                    value={newTodo}
                                    onChange={(e) => setNewTodo(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formDeadline">
                                <Form.Label>Deadline</Form.Label>
                                <Form.Control
                                    type="date"
                                    style={{ width: '300pt' }}
                                    value={newDeadline}
                                    onChange={(e) => setNewDeadline(e.target.value)}
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" className="add-button" onClick={() => setPopupActive(false)}>
                                Annulla
                            </Button>
                            <Button variant="primary" className="add-button" onClick={addTodo}>
                                Aggiungi
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <div className="text-center mb-5">
                    <p>Utente non autenticato. Accedi per visualizzare le tasks.</p>
                    <a href="/profilo">Pagina di autenticazione</a>
                </div>
            )}
        </div>
    );
}
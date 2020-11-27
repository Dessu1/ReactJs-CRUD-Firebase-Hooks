import React, { useEffect, useState } from "react";
import { firebase } from "./firebase";

function App() {
  const [tareas, setTareas] = useState([]);
  const [tarea, setTarea] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection("tareas").get();

        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTareas(arrayData);
      } catch (error) {
        console.log(error);
      }
    };

    obtenerDatos();
  }, []);

  const agregar = async (e) => {
    e.preventDefault();

    if (!tarea.trim()) {
      console.log("Elemento Vacio");
      return;
    }

    try {
      const db = firebase.firestore();
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now(),
      };

      const data = await db.collection("tareas").add(nuevaTarea);
      setTareas([...tareas, { ...nuevaTarea, id: data.id }]);
      setTarea("");
    } catch (error) {
      console.log(error);
    }
  };

  const eliminar = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("tareas").doc(id).delete();

      const arrayFiltrado = tareas.filter((tarea) => tarea.id !== id); // Sacamos de las tareas el id eliminado
      setTareas(arrayFiltrado);
    } catch (error) {
      console.log(error);
    }
  };

  const activarEdicion = (tarea) => {
    setModoEdicion(true);
    setTarea(tarea.name);
    setId(tarea.id);
  };

  const editar = async (e) => {
    e.preventDefault();

    if (!tarea.trim()) {
      console.log("Elemento Vacio");
      return;
    }

    try {
      const db = firebase.firestore();
      await db.collection("tareas").doc(id).update({
        name: tarea,
      });

      const arrayEditado = tareas.map((item) =>
        item.id === id ? { id: item.id, fecha: item.fecha, name: tarea } : tarea
      );

      setTareas(arrayEditado);
      setModoEdicion(false);
      setTarea("");
      setId("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container mt-3'>
      <div className='row'>
        <div className='col-md-6'>
          <h2>Lista de Tareas</h2>
          <ul className='list-group mt-5'>
            {tareas.map((tarea) => {
              return (
                <li className='list-group-item ' key={tarea.id}>
                  {tarea.name}

                  <button
                    className='btn btn-danger btn-sm - float-right'
                    onClick={() => eliminar(tarea.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className='btn btn-warning btn-sm - float-right mr-2'
                    onClick={() => activarEdicion(tarea)}
                  >
                    Editar
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className='col-md-6'>
          <h2>{modoEdicion ? "Editar Tarea" : "Agregar Tarea"}</h2>
          <form
            className='form-group mt-5'
            onSubmit={modoEdicion ? editar : agregar}
          >
            <input
              type='text'
              placeholder='ingrese tarea'
              className='form-control mb-2'
              onChange={(e) => setTarea(e.target.value)}
              value={tarea}
            />

            <button
              className={
                modoEdicion
                  ? "btn btn-warning btn-block"
                  : "btn btn-dark btn-block"
              }
              type='submit'
            >
              {modoEdicion ? "Editar" : "Agregar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

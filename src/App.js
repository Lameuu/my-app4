import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';

const App = () => {
  const [tarefas, setTarefas] = useState([]);
  const [tarefaInput, setTarefaInput] = useState('');
  const [filtro, setFiltro] = useState('todos');

  // Função para buscar tarefas da API
  const buscarTarefas = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  // Função para adicionar uma nova tarefa
  const adicionarTarefa = async (texto) => {
    try {
      const novaTarefa = { title: texto, completed: false };
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(novaTarefa),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setTarefas([...tarefas, data]);
      setTarefaInput('');
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  // Função para alternar o status de conclusão de uma tarefa
  const alternarConclusao = async (id) => {
    try {
      const tarefa = tarefas.find(tarefa => tarefa.id === id);
      const updatedTarefa = { ...tarefa, completed: !tarefa.completed };
      
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTarefa),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setTarefas(tarefas.map(tarefa => 
        tarefa.id === id ? updatedTarefa : tarefa
      ));
    } catch (error) {
      console.error('Erro ao alternar conclusão:', error);
    }
  };

  // Função para remover uma tarefa
  const removerTarefa = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE'
      });
      setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    }
  };

  // Função para aplicar filtro
  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (filtro === 'concluidos') return tarefa.completed;
    if (filtro === 'pendentes') return !tarefa.completed;
    return true;
  });

  // Buscar tarefas ao montar o componente
  useEffect(() => {
    buscarTarefas();
  }, []);

  return (
    <div className="App">
      <h1>Lista de Tarefas</h1>

      {/* Formulário para adicionar novas tarefas */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (tarefaInput.trim() !== '') {
            adicionarTarefa(tarefaInput);
          }
        }}
      >
        <input 
          type="text" 
          value={tarefaInput} 
          onChange={(e) => setTarefaInput(e.target.value)} 
          placeholder="Nova tarefa" 
        />
        <button type="submit">Adicionar</button>
      </form>

      {/* Filtros */}
      <div>
        <button onClick={() => setFiltro('todos')}>Todos</button>
        <button onClick={() => setFiltro('concluidos')}>Concluídos</button>
        <button onClick={() => setFiltro('pendentes')}>Pendentes</button>
      </div>

      {/* Lista de tarefas */}
      <ul>
        {tarefasFiltradas.map((tarefa) => (
          <li key={tarefa.id}>
            <span 
              style={{ textDecoration: tarefa.completed ? 'line-through' : 'none' }}
              onClick={() => alternarConclusao(tarefa.id)}
            >
              {tarefa.title}
            </span>
            <button onClick={() => removerTarefa(tarefa.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      {/* Rodapé */}
      <footer>
        <p>© 2024 - Lista de Tarefas React</p>
      </footer>
    </div>
  );
}

export default App;

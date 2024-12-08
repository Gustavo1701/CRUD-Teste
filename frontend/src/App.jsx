// src/App.jsx
import React, { useState, useEffect } from 'react';

const App = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nome_usuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [data_nascimento, setDataNascimento] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  // Função para buscar usuários da API
  useEffect(() => {
    const fetchUsuarios = async () => {
      const res = await fetch('http://localhost:3000/usuarios');
      const data = await res.json();
      setUsuarios(data);
    };
    fetchUsuarios();
  }, []);

  // Função para enviar o formulário (criar ou atualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { nome_usuario, senha, data_nascimento };

    if (editingUser) {
      // Atualizar usuário
      await fetch(`http://localhost:3000/usuarios/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
    } else {
      // Criar novo usuário
      await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
    }

    // Limpar o formulário após a operação
    setNomeUsuario('');
    setSenha('');
    setDataNascimento('');
    setEditingUser(null);

    // Recarregar a lista de usuários
    const res = await fetch('http://localhost:3000/usuarios');
    const data = await res.json();
    setUsuarios(data);
  };

  // Função para editar o usuário
  const handleEdit = (user) => {
    setNomeUsuario(user.nome_usuario);
    setSenha(user.senha);
    setDataNascimento(user.data_nascimento.split('T')[0]);
    setEditingUser(user);
  };

  // Função para excluir o usuário
  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/usuarios/${id}`, {
      method: 'DELETE',
    });

    // Recarregar a lista de usuários após exclusão
    const res = await fetch('http://localhost:3000/usuarios');
    const data = await res.json();
    setUsuarios(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4 text-center">
          {editingUser ? 'Editar Usuário' : 'Criar Novo Usuário'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nome de usuário</label>
            <input
              type="text"
              value={nome_usuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
            <input
              type="date"
              value={data_nascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            {editingUser ? 'Atualizar Usuário' : 'Criar Usuário'}
          </button>
        </form>
      </div>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl mb-4 text-center">Lista de Usuários</h2>
        {usuarios.length > 0 ? (
          <ul>
            {usuarios.map((user) => (
              <li key={user.id} className="mb-4 p-4 bg-gray-100 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-bold">{user.nome_usuario}</p>
                  <p>{user.data_nascimento}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-500 text-white py-1 px-4 rounded-md mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white py-1 px-4 rounded-md"
                  >
                    Deletar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Não há usuários cadastrados.</p>
        )}
      </div>
    </div>
  );
};

export default App;

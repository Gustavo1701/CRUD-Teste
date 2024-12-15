// src/App.jsx
import React, { useState, useEffect } from 'react';

const App = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nome_usuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
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

  // ------------- Função para formatar CPF ----------------
  const formatCpf = (value) => {
    //Remover tudo que não for numero
    value = value.replace(/\D/g, "");

    //Aplicar a formatação do CPF (000.000.000-00)
    if (value.length <= 3){
      return value;
    } else if (value.length <= 6) {
      return value.replace(/(\d{3})(\d{0,3})/, "$1.$2");
    } else if (value.length <= 9) {
      return value.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
    } else {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
    }
  };

  //-------1Função para lhe dar com a mudança do CPF---------
  const handleCpfChange = (e) =>{
    const formatadoCPF = formatCpf(e.target.value);
    setCpf(formatadoCPF); //Atualizar o estado do CPF
  }

  // Função para enviar o formulário (criar ou atualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---- Remover os pontos e traços antes de enviar para o backend---------
    const cpfNumeros = cpf.replace(/\D/g, ""); //Remove todos os caracteres não numericos

    const userData = { nome_usuario, senha, cpf: cpfNumeros, data_nascimento };

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
    setCpf('');
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
    setCpf(user.cpf);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Formulário de Criação/Edicao */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          {editingUser ? 'Editar Usuário' : 'Criar Novo Usuário'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome de usuário</label>
            <input
              type="text"
              value={nome_usuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={handleCpfChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={14} // Limita o comprimento para o CPF formatado
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
            <input
              type="date"
              value={data_nascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white text-lg rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {editingUser ? 'Atualizar Usuário' : 'Criar Usuário'}
          </button>
        </form>
      </div>

      {/* Lista de Usuários */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Lista de Usuários</h2>
        {usuarios.length > 0 ? (
          <ul>
            {usuarios.map((user) => (
              <li
                key={user.id}
                className="mb-4 p-4 bg-gray-50 rounded-md flex justify-between items-center shadow-sm"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800">{user.nome_usuario}</p>
                  <p className='text-sm text-gray-500'>
                    <span className='inline'>CPF: </span>
                    <span className='inline font-medium'>{user.cpf}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="inline">Data de nascimento: </span>
                    {/* Formatando a data de nascimento sem as horas */}
                    <span className="inline font-medium">
                      {new Date(user.data_nascimento).toLocaleDateString('pt-BR', {
                        timeZone: 'UTC', // Força o uso do horário UTC para evitar problemas com fusos horários
                      })}
                    </span>
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Deletar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Não há usuários cadastrados.</p>
        )}
      </div>
    </div>
  );

};

export default App;

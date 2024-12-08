import React, { useState, useEffect } from 'react';

const UserForm = ({ onSubmit, user = null }) => {
  const [nome_usuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [data_nascimento, setDataNascimento] = useState('');

  useEffect(() => {
    if (user) {
      setNomeUsuario(user.nome_usuario);
      setSenha(user.senha);
      setDataNascimento(user.data_nascimento.split('T')[0]); // Formatar a data
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nome_usuario, senha, data_nascimento });
    setNomeUsuario('');
    setSenha('');
    setDataNascimento('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">{user ? 'Editar Usuário' : 'Criar Usuário'}</h2>
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
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
        {user ? 'Atualizar' : 'Criar'}
      </button>
    </form>
  );
};

export default UserForm;

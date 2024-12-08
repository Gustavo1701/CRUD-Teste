import React from 'react';

const UserItem = ({ user, onEdit, onDelete }) => {
  return (
    <li className="mb-4 flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm">
      <div>
        <p className="font-bold">{user.nome_usuario}</p>
        <p>{user.data_nascimento}</p>
      </div>
      <div>
        <button
          onClick={() => onEdit(user)}
          className="bg-yellow-500 text-white py-1 px-4 rounded-md mr-2"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="bg-red-500 text-white py-1 px-4 rounded-md"
        >
          Deletar
        </button>
      </div>
    </li>
  );
};

export default UserItem;

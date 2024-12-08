import React, { useEffect, useState } from 'react';
import UserItem from './UserItem';

const UserList = ({ onEdit, onDelete }) => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const res = await fetch('http://localhost:3000/usuarios');
      const data = await res.json();
      setUsuarios(data);
    };
    fetchUsuarios();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Usuários</h2>
      {usuarios.length > 0 ? (
        <ul>
          {usuarios.map((user) => (
            <UserItem key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      ) : (
        <p>Não há usuários cadastrados.</p>
      )}
    </div>
  );
};

export default UserList;

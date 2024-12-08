const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Importa o middleware CORS

// Inicializando o servidor Express
const app = express();
const prisma = new PrismaClient(); // Instanciando o Prisma Client

// Usando o middleware CORS para permitir requisições de origens diferentes
app.use(cors()); // Permite acesso de qualquer origem (pode ser mais restrito em produção)

// Usando o express para lidar com JSON no corpo da requisição
app.use(express.json());

// Endpoint para criar um usuário (POST)
app.post('/usuarios', async (req, res) => {
    const { nome_usuario, senha, data_nascimento } = req.body;
    try {
        const usuario = await prisma.usuario.create({
            data: {
                nome_usuario,
                senha,
                data_nascimento: new Date(data_nascimento), // Converte para o formato de data do banco
            },
        });
        res.status(201).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Endpoint para listar os usuários (GET)
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

// Endpoint para atualizar um usuário (PUT)
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_usuario, senha, data_nascimento } = req.body;
    
    try {
        const usuario = await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: {
                nome_usuario,
                senha,
                data_nascimento: new Date(data_nascimento),
            },
        });
        res.status(200).json(usuario);            
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
    }
});

// Endpoint para deletar o usuário (DELETE)
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.usuario.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

// Inicializando o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

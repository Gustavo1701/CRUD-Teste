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
    const { nome_usuario, senha, cpf, data_nascimento } = req.body;
    try {
        // ---------------Verificar se o cpf ja existe---------------------------
        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                cpf: BigInt(cpf),
            }
        });

        if(usuarioExistente){
            return res.status(400).json({ error: 'CPF já cadastrado' });
        }
        // ------------------Fim da verificação do cpf----------------------
        
        const usuario = await prisma.usuario.create({
            data: {
                nome_usuario,
                senha,
                cpf: BigInt(cpf),
                data_nascimento: new Date(data_nascimento), // Converte para o formato de data do banco
            },
        });

        // ------------Converter BigInt para String antes de enviar a resposta ------------------------
        const usuarioResponse = {
            ...usuario,
            cpf: usuario.cpf.toString(), // Converte o CPF de BigInt para String
        };
        // --------------Fim da converção---------------------
        res.status(201).json(usuarioResponse);

    } catch (error) {
        console.error('Erro ao criar o usuario: ', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Endpoint para listar os usuários (GET)
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();

        // Converter BigInt para String para todos os usuários
        const usuariosResponse = usuarios.map(usuario => ({
            ...usuario,
            cpf: usuario.cpf.toString(), // Converter CPF de BigInt para String
        }));

        res.status(200).json(usuariosResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

// Endpoint para atualizar um usuário (PUT)
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_usuario, senha, cpf, data_nascimento } = req.body;

    try {
        const usuario = await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: {
                nome_usuario,
                senha,
                cpf: BigInt(cpf),
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

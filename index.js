const express = require('express');
const pool = require('./config/db'); // Importar conexión
require('dotenv').config();

const app = express();
app.use(express.json());

// GET: Obtener todos
app.get('/api/recursos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

// GET: Obtener por ID
app.get('/api/recursos/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

// POST: Crear nuevo
app.post('/api/recursos', async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        const [result] = await pool.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
        res.status(201).json({ id: result.insertId, nombre, precio });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar el dato' });
    }
});

// PUT: Actualizar
app.put('/api/recursos/:id', async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        const [result] = await pool.query('UPDATE productos SET nombre = ?, precio = ? WHERE id = ?', [nombre, precio, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json({ id: req.params.id, nombre, precio });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

// DELETE: Eliminar
app.delete('/api/recursos/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'No encontrado' });
        res.json({ mensaje: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});
const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Arreglo en memoria para simular base de datos de productos
let productos = [
    { id: 1, nombre: 'Laptop', precio: 15000 },
    { id: 2, nombre: 'Teclado', precio: 800 }
];

// Ruta base
app.get('/', (req, res) => {
    res.send('El servidor esta en linea');
});

// GET Obtener todos los recursos
app.get('/api/recursos', (req, res) => {
    res.json(productos);
});

// GET Obtener recurso por id
app.get('/api/recursos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ mensaje: 'No encontrado' });
    }
    res.json(producto);
});

// POST Crear nuevo recurso
app.post('/api/recursos', (req, res) => {
    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const nuevoProducto = {
        id: nuevoId,
        nombre: req.body.nombre,
        precio: req.body.precio
    };
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

// PUT Actualizar recurso
app.put('/api/recursos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ mensaje: 'No encontrado' });
    }
    producto.nombre = req.body.nombre || producto.nombre;
    producto.precio = req.body.precio || producto.precio;
    res.json(producto);
});

// DELETE Eliminar recurso
app.delete('/api/recursos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ mensaje: 'No encontrado' });
    }
    productos.splice(index, 1);
    res.json({ mensaje: 'Eliminado correctamente' });
});

// Levantar el servidor
app.listen(3000, () => {
    console.log('Servidor en puerto 3000');
});
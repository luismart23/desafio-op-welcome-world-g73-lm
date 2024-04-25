import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

// Ruta absoluta del directorio actual
const __dirname = path.resolve();

// Middleware para procesar los datos del formulario
app.use(express.urlencoded({ extended: true }));

// Ruta para servir archivos estáticos (HTML, CSS, etc.)
app.use('/', express.static(path.join(__dirname, 'public')));

// Ruta para crear un archivo
app.get('/crear', (req, res) => {
    const { archivo, contenido } = req.query;
    const fecha = getCurrentDateFormatted();

    const filePath = path.join(__dirname, archivo);
    const fileContent = `${fecha} ${contenido}`;

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            res.send(`Error al crear el archivo: ${err.message}`);
        } else {
            res.send(`Archivo ${archivo} creado exitosamente.`);
        }
    });
});

// Ruta para devolver la página HTML principal
app.get('/', (req, res) => {
    return res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

// Ruta para leer un archivo
app.get('/leer', (req, res) => {
    const { archivo } = req.query;
    const filePath = path.join(__dirname, archivo);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.send(`Error al leer el archivo: ${err.message}`);
        } else {
            res.send(`Contenido de ${archivo}: ${data}`);
        }
    });
});

// Ruta para renombrar un archivo
app.get('/renombrar', (req, res) => {
    const { nombre, nuevoNombre } = req.query;

    fs.rename(path.join(__dirname, nombre), path.join(__dirname, nuevoNombre), (err) => {
        if (err) {
            res.send(`Error al renombrar el archivo: ${err.message}`);
        } else {
            res.send(`Archivo ${nombre} renombrado a ${nuevoNombre} exitosamente.`);
        }
    });
});

// Ruta para eliminar un archivo
app.get('/eliminar', (req, res) => {
    const { archivo } = req.query;

    fs.unlink(path.join(__dirname, archivo), (err) => {
        if (err) {
            res.send(`Error al eliminar el archivo: ${err.message}`);
        } else {
            res.send(`Archivo ${archivo} eliminado exitosamente.`);
        }
    });
});

// Función para obtener la fecha actual formateada
const getCurrentDateFormatted = () => {
    const currentDate = new Date();
    const day = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
    const month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
};

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});

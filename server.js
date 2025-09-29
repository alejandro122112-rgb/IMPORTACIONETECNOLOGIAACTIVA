const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Función auxiliar: cargar comentarios del archivo
function loadComments() {
  if (!fs.existsSync(COMMENTS_FILE)) {
    fs.writeFileSync(COMMENTS_FILE, '[]');
  }
  const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
  return JSON.parse(data);
}

// Función auxiliar: guardar comentarios en el archivo
function saveComments(comments) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

// API: obtener comentarios
app.get('/api/comments', (req, res) => {
  const comentarios = loadComments();
  res.json(comentarios);
});

// API: crear comentario
app.post('/api/comments', (req, res) => {
  const { nombre, mensaje } = req.body;
  if (!nombre || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  let comentarios = loadComments();
  const nuevo = {
    id: comentarios.length > 0 ? comentarios[0].id + 1 : 1,
    nombre,
    mensaje,
    fecha: new Date().toISOString()
  };

  comentarios.unshift(nuevo);
  saveComments(comentarios);

  res.status(201).json(nuevo);
});

// Para cualquier otra ruta, servir index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Server corriendo en http://localhost:${PORT}`));

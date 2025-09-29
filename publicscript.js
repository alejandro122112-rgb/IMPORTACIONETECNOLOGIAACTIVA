

async function fetchComments() {
const res = await fetch(`${API_BASE}/comments`);
if (!res.ok) throw new Error('Error al obtener comentarios');
return await res.json();
}


function renderComments(list) {
const ul = document.getElementById('comments-list');
ul.innerHTML = '';
list.forEach(c => {
const li = document.createElement('li');
li.innerHTML = `<strong>${escapeHtml(c.nombre)}</strong> <small>— ${new Date(c.fecha).toLocaleString()}</small><div>${escapeHtml(c.mensaje)}</div>`;
ul.appendChild(li);
});
}


function escapeHtml(s){
return String(s)
.replaceAll('&','&amp;')
.replaceAll('<','&lt;')
.replaceAll('>','&gt;')
.replaceAll('"','&quot;')
.replaceAll("'","&#39;");
}


async function init() {
try {
const comments = await fetchComments();
renderComments(comments);
} catch (err) {
console.error(err);
}
}


// Formularios
const form = document.getElementById('comment-form');
form.addEventListener('submit', async (e) => {
e.preventDefault();
const nombre = document.getElementById('nombre').value.trim();
const mensaje = document.getElementById('mensaje').value.trim();
const status = document.getElementById('form-status');
status.textContent = '';


if (!nombre || !mensaje) { status.textContent = 'Completa los campos'; return; }


try {
const res = await fetch(`${API_BASE}/comments`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ nombre, mensaje })
});
if (!res.ok) {
const err = await res.json();
status.textContent = `Error: ${err.error || res.status}`;
return;
}
const nuevo = await res.json();
// actualizar lista localmente (optimista)
const ul = document.getElementById('comments-list');
const li = document.createElement('li');
li.innerHTML = `<strong>${escapeHtml(nuevo.nombre)}</strong> <small>— ${new Date(nuevo.fecha).toLocaleString()}</small><div>${escapeHtml(nuevo.mensaje)}</div>`;
ul.prepend(li);
form.reset();
status.textContent = 'Comentario enviado ✅';
} catch (err) {
console.error(err);
status.textContent = 'Error al enviar, intenta nuevamente';
}
});


// Inicializar
init();
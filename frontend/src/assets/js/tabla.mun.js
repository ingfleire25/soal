//Los datos fueron autogenerados para fines ilustrativos.
let entriesPerPage = 10; // default
let currentPage = 1;
let data = [
    { nombre: "Camilo", apellido: "Sexto", cedula: "12345", rol: "Admin", indicador: "sextoc" },
    { nombre: "Ricardo", apellido: "Arjona", cedula: "21345", rol: "Usuario", indicador: "arjonar" },
    { nombre: "Juan", apellido: "Pérez", cedula: "34567", rol: "Usuario", indicador: "perezj" },
    { nombre: "María", apellido: "González", cedula: "45678", rol: "Admin", indicador: "gonzalezm" },
    { nombre: "Ana", apellido: "Martínez", cedula: "56789", rol: "Usuario", indicador: "martineza" },
    { nombre: "Luis", apellido: "Hernández", cedula: "67890", rol: "Usuario", indicador: "hernandezl" },
    { nombre: "Sofía", apellido: "López", cedula: "78901", rol: "Admin", indicador: "lopezs" },
    { nombre: "Carlos", apellido: "Ramírez", cedula: "89012", rol: "Usuario", indicador: "ramirezc" },
    { nombre: "Laura", apellido: "Torres", cedula: "90123", rol: "Usuario", indicador: "torresl" },
    { nombre: "Diego", apellido: "Cruz", cedula: "01234", rol: "Admin", indicador: "cruzd" },
    { nombre: "Valeria", apellido: "Sánchez", cedula: "12346", rol: "Usuario", indicador: "sanchezv" },
    { nombre: "Fernando", apellido: "Lopez", cedula: "23456", rol: "Admin", indicador: "lopezf" },
    { nombre: "Paola", apellido: "Calle", cedula: "34567", rol: "Usuario", indicador: "callep" },
    { nombre: "Andrés", apellido: "Jiménez", cedula: "45678", rol: "Usuario", indicador: "jimeneza" },
    { nombre: "Natalia", apellido: "Romero", cedula: "56789", rol: "Admin", indicador: "romeron" },
    { nombre: "Miguel", apellido: "Angel", cedula: "67890", rol: "Usuario", indicador: "angelm" },
    { nombre: "Claudia", apellido: "Castillo", cedula: "78901", rol: "Usuario", indicador: "castilloc" },
    { nombre: "Javier", apellido: "Mendoza", cedula: "89012", rol: "Admin", indicador: "mendozaj" },
    { nombre: "Gabriela", apellido: "Salazar", cedula: "90123", rol: "Usuario", indicador: "salazarg" },
    { nombre: "Esteban", apellido: "Fuentes", cedula: "01234", rol: "Usuario", indicador: "fuentese" },
    { nombre: "Sergio", apellido: "Bermúdez", cedula: "12345", rol: "Usuario", indicador: "bermudezs" },
    { nombre: "Isabella", apellido: "Córdoba", cedula: "23456", rol: "Admin", indicador: "cordobai" },
    { nombre: "Bernardo", apellido: "Guevara", cedula: "34567", rol: "Usuario", indicador: "guevarab" },
    { nombre: "Valentina", apellido: "Silva", cedula: "45678", rol: "Usuario", indicador: "silvav" },
    { nombre: "Diego", apellido: "Núñez", cedula: "56789", rol: "Admin", indicador: "nunezd" },
    { nombre: "Felipe", apellido: "Aguilar", cedula: "67890", rol: "Usuario", indicador: "aguilarf" },
    { nombre: "Martín", apellido: "Cáceres", cedula: "78901", rol: "Usuario", indicador: "caceresm" },
    { nombre: "Ana", apellido: "Brazas", cedula: "89012", rol: "Admin", indicador: "brazasa" },
    { nombre: "Simón", apellido: "Prieto", cedula: "90123", rol: "Usuario", indicador: "prietos" },
    { nombre: "Camila", apellido: "Ortega", cedula: "01234", rol: "Usuario", indicador: "ortegac" },
    { nombre: "Oliver", apellido: "Reséndez", cedula: "12345", rol: "Admin", indicador: "resendezo" },
    { nombre: "Pedro", apellido: "Obando", cedula: "23456", rol: "Usuario", indicador: "obandop" },
    { nombre: "Inés", apellido: "Sarmiento", cedula: "34567", rol: "Usuario", indicador: "sarmientoi" },
    { nombre: "Hugo", apellido: "Galindo", cedula: "45678", rol: "Admin", indicador: "galindoh" },
    { nombre: "Patricia", apellido: "Rojas", cedula: "56789", rol: "Usuario", indicador: "rojasp" },
    { nombre: "Ramiro", apellido: "Ceballos", cedula: "67890", rol: "Usuario", indicador: "ceballosr" },
    { nombre: "Cecilia", apellido: "Daza", cedula: "78901", rol: "Admin", indicador: "dazac" },
    { nombre: "Julián", apellido: "Paz", cedula: "89012", rol: "Usuario", indicador: "pazj" },
    { nombre: "Verónica", apellido: "Suárez", cedula: "90123", rol: "Usuario", indicador: "suarezv" },
    { nombre: "Mónica", apellido: "Zapata", cedula: "01234", rol: "Admin", indicador: "zapatam" },
    { nombre: "Arturo", apellido: "Palacios", cedula: "12345", rol: "Usuario", indicador: "palaciosa" },
    { nombre: "Diana", apellido: "Duarte", cedula: "23456", rol: "Usuario", indicador: "duarted" },
    { nombre: "Marco", apellido: "Navas", cedula: "34567", rol: "Admin", indicador: "navasm" }
];

function updateEntries() {
    entriesPerPage = parseInt(document.getElementById('entries').value);
    currentPage = 1; // Reset to the first page on entries change
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = ""; // Clear current rows
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(data.length, startIndex + entriesPerPage);
    for (let i = startIndex; i < endIndex; i++) {
        const row = document.createElement('tr');
        Object.values(data[i]).forEach(text => {
            const cell = document.createElement('td');
            cell.textContent = text;
cell.classList.add('text-center'); 
            row.appendChild(cell);
        });
        const actionCell = document.createElement('td');
        actionCell.innerHTML = `<button class="btn" style="font-weight:500;color:#444444;border:2px solid #444444;" onclick="editRow(${i})"><i class="bi bi-pencil"></i></button>
                                <button class="btn" style="font-weight:500;color:#CD1C29;border:2px solid #CD1C29;"onclick="deleteRow(${i})"><i class="bi bi-trash"></i></button>`;
        row.appendChild(actionCell);
        tbody.appendChild(row);
    }
    updatePagination();
}

function changePage(direction) {
    const totalPages = Math.ceil(data.length / entriesPerPage);
    currentPage += direction;
    // Ensure currentPage stays within bounds
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    renderTable();
}

function updatePagination() {
    const totalPages = Math.ceil(data.length / entriesPerPage);
    document.getElementById('prev-button').disabled = currentPage === 1;
    document.getElementById('next-button').disabled = currentPage === totalPages;
}

function searchEntries() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredData = data.filter(person => 
        person.nombre.toLowerCase().includes(searchTerm) ||
        person.apellido.toLowerCase().includes(searchTerm) ||
        person.cedula.includes(searchTerm) ||
        person.rol.toLowerCase().includes(searchTerm) ||
        person.indicador.toLowerCase().includes(searchTerm)
    );
    currentPage = 1; // Reset to the first page on search
    renderFilteredTable(filteredData);
}

function renderFilteredTable(filteredData) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = ""; // Clear current rows
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(filteredData.length, startIndex + entriesPerPage);
    for (let i = startIndex; i < endIndex; i++) {
        const row = document.createElement('tr');
        Object.values(filteredData[i]).forEach(text => {
            const cell = document.createElement('td');
            cell.textContent = text;
cell.classList.add('text-center'); 
            row.appendChild(cell);
        });
        const actionCell = document.createElement('td');
actionCell.innerHTML = `<div aria-label="Action buttons">
                            <button class="btn"style="color:#444444;border:2px solid #444444;" onclick="editRow(${i})"><i class="bi bi-pencil"></i></button>
                            <button class="btn"style="color:#CD1C29;border:2px solid #CD1C29;" onclick="deleteRow(${i})"><i class="bi bi-trash"></i></button>
                        </div>`;
row.appendChild(actionCell);
        tbody.appendChild(row);
    }
    updatePagination();
}

function editRow(index) {
    const tbody = document.getElementById('table-body');
    const row = tbody.rows[index - (currentPage - 1) * entriesPerPage]; // Get the appropriate row
    const cells = row.querySelectorAll('td');

    // Change fields to inputs
    cells.forEach((cell, cellIndex) => {
        if (cellIndex < cells.length - 1) { // Exclude the action cell
            const input = document.createElement('input');
            input.value = cell.textContent; // Take the current text
            cell.innerHTML = ''; // Clear cell
            cell.appendChild(input); // Add input
        }
    });

    // Change the action buttons to save and cancel
    // Update your actionCell innerHTML in the editRow and saveRow functions

const actionCell = cells[cells.length - 1];
actionCell.innerHTML = `<div aria-label="Basic example">
                           <button class="btn" style="font-weight:500;color:#444444;border:2px solid #444444;" onclick="saveRow(${index})"><i class="bi bi-save"></i></button> 
                           <button class="btn" style="font-weight:500;color:#CD1C29;border:2px solid #CD1C29;" onclick="cancelEdit(${index})"><i class="bi bi-x-circle"></i></button>
                        </div>`;
}

function saveRow(index) {
    const tbody = document.getElementById('table-body');
    const row = tbody.rows[index - (currentPage - 1) * entriesPerPage]; // Get the appropriate row
    const cells = row.querySelectorAll('td');

    // Save input values back to the data array
    cells.forEach((cell, cellIndex) => {
        if (cellIndex < cells.length - 1) { // Exclude the action cell
            const input = cell.querySelector('input');
            if (input) {
                data[index].nombre = input.value; // Update the correct field
                cell.textContent = input.value; // Update the cell's text
            }
        }
    });

    // Change the action buttons to edit
    const actionCell = cells[cells.length - 1];
    actionCell.innerHTML = `<div aria-label="Action buttons">
                                <button class="btn" style="font-weight:500;color:#444444;border:2px solid #444444;" onclick="editRow(${index})"><i class="bi bi-pencil"></i></button>
                                <button class="btn" style="font-weight:500;color:#CD1C29;border:2px solid #CD1C29;" onclick="deleteRow(${index})"><i class="bi bi-trash"></i></button>
                            </div>`;
}


function cancelEdit(index) {
    renderTable(); // Simply re-render the table to get the original values back
}


function deleteRow(index) {
    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        data.splice(index, 1); // Eliminar la fila del array
        renderTable();
    }
}

// Initial render
renderTable();

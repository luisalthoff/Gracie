// ==========================================
// SQL-STYLE JSON DATABASE ENGINE
// ==========================================
class SQLJSONDatabase {
  constructor(dbName) {
    this.dbName = dbName;
    if (!localStorage.getItem(this.dbName)) {
      this._saveRaw({});
    }
  }

  _saveRaw(data) {
    localStorage.setItem(this.dbName, JSON.stringify(data));
  }

  _readRaw() {
    return JSON.parse(localStorage.getItem(this.dbName) || '{}');
  }

  insertInto(table, record) {
    const db = this._readRaw();
    if (!db[table]) db[table] = [];

    const nextId = db[table].length > 0 ? Math.max(...db[table].map(r => r.id || 0)) + 1 : 1;
    const newRecord = { id: nextId, ...record };
    
    db[table].push(newRecord);
    this._saveRaw(db);
    return newRecord;
  }

  select(table, columns = '*', whereFn = () => true) {
    const db = this._readRaw();
    const records = db[table] || [];
    const filtered = records.filter(whereFn);
    
    if (columns === '*') return filtered;
    
    return filtered.map(record => {
      const projected = {};
      columns.forEach(col => {
        if (record.hasOwnProperty(col)) projected[col] = record[col];
      });
      return projected;
    });
  }

  deleteFrom(table, whereFn) {
    const db = this._readRaw();
    if (!db[table]) return 0;

    const initialLength = db[table].length;
    db[table] = db[table].filter(record => !whereFn(record));
    
    const affectedRows = initialLength - db[table].length;
    if (affectedRows > 0) this._saveRaw(db);
    return affectedRows;
  }

  dropDatabase() {
    this._saveRaw({});
  }
}

// ==========================================
// UI CONTROLLER & EVENT INITIALIZATION
// ==========================================
const db = new SQLJSONDatabase('modal_double_click_db');

const tableBody = document.getElementById('table-body');
const statusBanner = document.getElementById('status-banner');
const userModal = document.getElementById('user-modal');
const addUserForm = document.getElementById('add-user-form');

let currentFilter = () => true;

function refreshView(systemMessage) {
  const records = db.select('users', '*', currentFilter);
  statusBanner.textContent = systemMessage;
  tableBody.innerHTML = ''; 

  if (records.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3" class="empty-state">No users found matching this view.</td></tr>`;
    return;
  }

  records.forEach(user => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', user.id); 
    
    const roleClass = user.role === 'Admin' ? 'badge-admin' : 'badge-user';
    
    row.innerHTML = `
      <td><strong>#${user.id}</strong></td>
      <td>${user.name}</td>
      <td><span class="badge ${roleClass}">${user.role}</span></td>
    `;
    tableBody.appendChild(row);
  });
}

// --- MODAL INSERT NEW ITEM ---
document.getElementById('btn-add').addEventListener('click', () => {userModal.showModal(); });
const closeModal = () => {userModal.close(); addUserForm.reset();};
document.getElementById('btn-close-modal').addEventListener('click', closeModal);

addUserForm.addEventListener('submit', (event) =>
{
  event.preventDefault();   
  const nameInput = document.getElementById('input-name').value;
  const roleInput = document.getElementById('select-role').value;
  db.insertInto('users', { name: nameInput, role: roleInput });
  closeModal();
  refreshView(`adicionado com sucesso ('${nameInput}', '${roleInput}')`);
});

// --- ROW DOUBLE CLICK TO DELETE LISTENER ---
tableBody.addEventListener('dblclick', (event) => {
  const targetRow = event.target.closest('tr');
  if (!targetRow || !targetRow.hasAttribute('data-id')) return;
  
  const targetId = parseInt(targetRow.getAttribute('data-id'), 10);
  const affectedRows = db.deleteFrom('users', row => row.id === targetId);
  
  refreshView(`Successfully executed: DELETE FROM users WHERE id = ${targetId}`);
});

// --- FILTER CONTROL ACTIONS ---
document.getElementById('btn-select-all').addEventListener('click', () => {
  currentFilter = () => true;
  refreshView("Displaying complete directory");
});

document.getElementById('btn-select-admins').addEventListener('click', () => {
  currentFilter = row => row.role === 'Admin';
  refreshView("Filtered view: System administrators only.");
});

document.getElementById('btn-clear').addEventListener('click', () => {
  db.dropDatabase();
  refreshView("Database cleared.");
});

// Initial load view invocation
refreshView("System Ready");

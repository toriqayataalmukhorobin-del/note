const API_URL = 'http://localhost:3000/notes';
let editModal, deleteModal;

// Initialize modals when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    editModal = new bootstrap.Modal(document.getElementById('editModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    loadNotes();
});

// Load all notes
async function loadNotes() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        const notesList = document.getElementById('notesList');
        
        if (result.success && result.data.length > 0) {
            notesList.innerHTML = result.data.map(note => `
                <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${escapeHtml(note.title)}</h6>
                        <small class="text-muted">
                            <i class="bi bi-clock"></i> ${formatDate(note.created_at)}
                        </small>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="openEditModal(${note.id}, '${escapeHtml(note.title)}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="openDeleteModal(${note.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            notesList.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="bi bi-journal-x display-4"></i>
                    <p class="mt-2">Belum ada catatan</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        document.getElementById('notesList').innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> Gagal memuat catatan
            </div>
        `;
    }
}

// Create new note
async function createNote() {
    const titleInput = document.getElementById('noteTitle');
    const title = titleInput.value.trim();
    const errorDiv = document.getElementById('createError');
    
    errorDiv.textContent = '';
    
    if (!title) {
        errorDiv.textContent = 'Judul catatan wajib diisi';
        return;
    }
    
    if (title.length < 3) {
        errorDiv.textContent = 'Judul minimal 3 karakter';
        return;
    }
    
    if (title.length > 100) {
        errorDiv.textContent = 'Judul maksimal 100 karakter';
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            titleInput.value = '';
            loadNotes();
        } else {
            errorDiv.textContent = result.message || 'Gagal menambahkan catatan';
            console.error('Server error:', result);
        }
    } catch (error) {
        console.error('Error creating note:', error);
        errorDiv.textContent = 'Gagal terhubung ke server. Pastikan server berjalan.';
    }
}

// Open edit modal
function openEditModal(id, title) {
    document.getElementById('editNoteId').value = id;
    document.getElementById('editNoteTitle').value = title;
    document.getElementById('editError').textContent = '';
    editModal.show();
}

// Update note
async function updateNote() {
    const id = document.getElementById('editNoteId').value;
    const title = document.getElementById('editNoteTitle').value.trim();
    const errorDiv = document.getElementById('editError');
    
    errorDiv.textContent = '';
    
    if (!title) {
        errorDiv.textContent = 'Judul catatan wajib diisi';
        return;
    }
    
    if (title.length < 3) {
        errorDiv.textContent = 'Judul minimal 3 karakter';
        return;
    }
    
    if (title.length > 100) {
        errorDiv.textContent = 'Judul maksimal 100 karakter';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        
        const result = await response.json();
        
        if (result.success) {
            editModal.hide();
            loadNotes();
        } else {
            errorDiv.textContent = result.message || 'Gagal mengupdate catatan';
        }
    } catch (error) {
        console.error('Error updating note:', error);
        errorDiv.textContent = 'Gagal mengupdate catatan';
    }
}

// Open delete modal
function openDeleteModal(id) {
    document.getElementById('deleteNoteId').value = id;
    deleteModal.show();
}

// Confirm delete
async function confirmDelete() {
    const id = document.getElementById('deleteNoteId').value;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success || result.message) {
            deleteModal.hide();
            loadNotes();
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        deleteModal.hide();
    }
}

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Allow Enter key to submit
document.getElementById('noteTitle').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        createNote();
    }
});

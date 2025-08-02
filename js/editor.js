// Document Editor JavaScript for LegalVaani

// Global variables for editor state
window.originalContent = '';
window.editedContent = '';
window.isEditorActive = false;
window.editorHistory = [];
window.historyIndex = -1;
window.isModified = false;

// Initialize editor when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
});

// Initialize editor functionality
function initializeEditor() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    // Add event listeners for editor
    editor.addEventListener('input', function() {
        if (!window.isEditorActive) return;
        
        window.isModified = true;
        updateEditorState();
        addToHistory(editor.innerHTML);
    });

    editor.addEventListener('keydown', function(e) {
        if (!window.isEditorActive) return;
        
        // Handle keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'b':
                    e.preventDefault();
                    formatText('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    formatText('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    formatText('underline');
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        redoEdit();
                    } else {
                        undoEdit();
                    }
                    break;
            }
        }
    });

    // Add paste event listener to clean up pasted content
    editor.addEventListener('paste', function(e) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });
}

// Toggle editor visibility
function toggleEditor() {
    const editor = document.getElementById('document-editor');
    const preview = document.getElementById('document-preview');
    
    if (editor.classList.contains('hidden')) {
        // Show editor
        editor.classList.remove('hidden');
        preview.style.display = 'none';
        window.isEditorActive = true;
        
        // Load content into editor if not already loaded
        if (!window.originalContent) {
            loadContentIntoEditor();
        }
        
        showNotification('Editor activated. You can now edit your document.', 'info');
    } else {
        // Hide editor
        editor.classList.add('hidden');
        preview.style.display = 'block';
        window.isEditorActive = false;
        
        showNotification('Editor deactivated. Preview mode restored.', 'info');
    }
}

// Load generated content into editor
function loadContentIntoEditor() {
    const editor = document.getElementById('editor');
    const preview = document.getElementById('document-preview');
    
    if (Object.keys(currentFormData).length === 0) {
        editor.innerHTML = '<p>Please fill in the form to generate document content.</p>';
        return;
    }
    
    // Get the generated content
    const content = generateDocumentContent(currentDocumentType, currentFormData);
    
    // Store original content
    window.originalContent = content;
    window.editedContent = content;
    
    // Load into editor
    editor.innerHTML = content;
    
    // Reset history
    window.editorHistory = [content];
    window.historyIndex = 0;
    window.isModified = false;
    
    updateEditorState();
}

// Format text in editor
function formatText(command) {
    if (!window.isEditorActive) return;
    
    const editor = document.getElementById('editor');
    editor.focus();
    
    switch(command) {
        case 'bold':
            document.execCommand('bold', false, null);
            break;
        case 'italic':
            document.execCommand('italic', false, null);
            break;
        case 'underline':
            document.execCommand('underline', false, null);
            break;
    }
    
    // Add to history after formatting
    setTimeout(() => {
        addToHistory(editor.innerHTML);
    }, 100);
}

// Insert heading
function insertHeading() {
    if (!window.isEditorActive) return;
    
    const editor = document.getElementById('editor');
    editor.focus();
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const heading = document.createElement('h2');
        heading.textContent = 'New Heading';
        
        range.deleteContents();
        range.insertNode(heading);
        
        // Add to history
        addToHistory(editor.innerHTML);
    }
}

// Insert list
function insertList() {
    if (!window.isEditorActive) return;
    
    const editor = document.getElementById('editor');
    editor.focus();
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const list = document.createElement('ul');
        const item = document.createElement('li');
        item.textContent = 'List item';
        list.appendChild(item);
        
        range.deleteContents();
        range.insertNode(list);
        
        // Add to history
        addToHistory(editor.innerHTML);
    }
}

// Undo edit
function undoEdit() {
    if (window.historyIndex > 0) {
        window.historyIndex--;
        const editor = document.getElementById('editor');
        editor.innerHTML = window.editorHistory[window.historyIndex];
        updateEditorState();
    }
}

// Redo edit
function redoEdit() {
    if (window.historyIndex < window.editorHistory.length - 1) {
        window.historyIndex++;
        const editor = document.getElementById('editor');
        editor.innerHTML = window.editorHistory[window.historyIndex];
        updateEditorState();
    }
}

// Add content to history
function addToHistory(content) {
    // Remove future history if we're not at the end
    if (window.historyIndex < window.editorHistory.length - 1) {
        window.editorHistory = window.editorHistory.slice(0, window.historyIndex + 1);
    }
    
    // Add new content
    window.editorHistory.push(content);
    window.historyIndex = window.editorHistory.length - 1;
    
    // Limit history size
    if (window.editorHistory.length > 50) {
        window.editorHistory.shift();
        window.historyIndex--;
    }
}

// Save edits
function saveEdits() {
    const editor = document.getElementById('editor');
    window.editedContent = editor.innerHTML;
    window.isModified = false;
    updateEditorState();
    
    showNotification('Changes saved successfully!', 'success');
}

// Reset edits to original
function resetEdits() {
    if (confirm('Are you sure you want to reset all changes? This cannot be undone.')) {
        const editor = document.getElementById('editor');
        editor.innerHTML = window.originalContent;
        window.editedContent = window.originalContent;
        
        // Reset history
        window.editorHistory = [window.originalContent];
        window.historyIndex = 0;
        window.isModified = false;
        
        updateEditorState();
        showNotification('Document reset to original content.', 'info');
    }
}

// Update editor state indicators
function updateEditorState() {
    const editor = document.getElementById('document-editor');
    
    if (window.isModified) {
        editor.classList.add('editor-modified');
        editor.classList.remove('editor-saved');
    } else {
        editor.classList.remove('editor-modified');
        editor.classList.add('editor-saved');
    }
}

// Get current editor content (either edited or original)
function getCurrentContent() {
    if (window.isEditorActive && window.editedContent) {
        return window.editedContent;
    }
    return window.originalContent || generateDocumentContent(currentDocumentType, currentFormData);
}

// Export functions for use in other files
window.toggleEditor = toggleEditor;
window.formatText = formatText;
window.insertHeading = insertHeading;
window.insertList = insertList;
window.undoEdit = undoEdit;
window.redoEdit = redoEdit;
window.saveEdits = saveEdits;
window.resetEdits = resetEdits;
window.getCurrentContent = getCurrentContent; 
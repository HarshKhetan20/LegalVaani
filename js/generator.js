// Generator JavaScript for LegalVaani

let currentDocumentType = '';
let currentFormData = {};

// Initialize the generator page
document.addEventListener('DOMContentLoaded', function() {
    // Get document type from sessionStorage
    const documentType = sessionStorage.getItem('selectedDocumentType');
    const documentTypeData = JSON.parse(sessionStorage.getItem('documentTypeData') || '{}');
    
    if (!documentType || !documentTypeData) {
        // Redirect to homepage if no document type selected
        window.location.href = 'home.html';
        return;
    }
    
    currentDocumentType = documentType;
    
    // Update page title and breadcrumb
    document.getElementById('document-type').textContent = documentTypeData.name;
    document.title = `${documentTypeData.name} - LegalVaani`;
    
    // Generate form
    generateForm(documentTypeData.fields);
    
    // Add form event listeners
    addFormEventListeners();
});

// Generate form based on document type fields
function generateForm(fields) {
    const form = document.getElementById('document-form');
    form.innerHTML = '';
    
    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = field.label;
        if (field.required) {
            label.innerHTML += ' <span style="color: red;">*</span>';
        }
        
        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
        } else if (field.type === 'date') {
            input = document.createElement('input');
            input.type = 'date';
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }
        
        input.name = field.name;
        input.id = field.name;
        input.required = field.required;
        
        formGroup.appendChild(label);
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });
}

// Add event listeners to form inputs
function addFormEventListeners() {
    const form = document.getElementById('document-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            updateFormData();
            updatePreview();
        });
        
        input.addEventListener('change', function() {
            updateFormData();
            updatePreview();
        });
    });
}

// Update form data object
function updateFormData() {
    const form = document.getElementById('document-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    currentFormData = {};
    inputs.forEach(input => {
        currentFormData[input.name] = input.value;
    });
}

// Update document preview
function updatePreview() {
    const preview = document.getElementById('document-preview');
    
    if (Object.keys(currentFormData).length === 0) {
        preview.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-file-alt"></i>
                <p>Fill in the form to see a live preview of your document</p>
            </div>
        `;
        return;
    }
    
    // Generate document content
    const content = generateDocumentContent(currentDocumentType, currentFormData);
    preview.innerHTML = content;
}

// Toggle preview visibility
function togglePreview() {
    const preview = document.getElementById('document-preview');
    const isHidden = preview.style.display === 'none';
    
    if (isHidden) {
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}

// Download functions
function downloadPDF() {
    if (!currentFormData || Object.keys(currentFormData).length === 0) {
        alert('Please fill in the form before downloading.');
        return;
    }
    
    const content = generateDocumentContent(currentDocumentType, currentFormData);
    const title = getDocumentTitle(currentDocumentType);
    
    // Create a temporary div to hold the content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    tempDiv.style.cssText = `
        font-family: 'Times New Roman', serif;
        font-size: 12px;
        line-height: 1.6;
        padding: 20px;
        color: #000;
    `;
    
    // Use jsPDF to generate PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Convert HTML to PDF
    doc.html(tempDiv, {
        callback: function(doc) {
            doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        },
        x: 10,
        y: 10,
        width: 190
    });
}

function downloadDOCX() {
    if (!currentFormData || Object.keys(currentFormData).length === 0) {
        alert('Please fill in the form before downloading.');
        return;
    }
    
    const content = generateDocumentContent(currentDocumentType, currentFormData);
    const title = getDocumentTitle(currentDocumentType);
    
    // Create document content for DOCX
    const docxContent = `
        <html>
            <head>
                <style>
                    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; }
                    h1 { font-size: 16pt; font-weight: bold; text-align: center; }
                    h2 { font-size: 14pt; font-weight: bold; }
                    .signature-section { margin-top: 30px; }
                    .signature-box { display: inline-block; width: 45%; text-align: center; }
                </style>
            </head>
            <body>
                ${content}
            </body>
        </html>
    `;
    
    // Use html-docx-js to generate DOCX
    const converted = htmlDocx.asBlob(docxContent);
    const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
    
    // Download the file
    saveAs(converted, fileName);
}

function downloadTXT() {
    if (!currentFormData || Object.keys(currentFormData).length === 0) {
        alert('Please fill in the form before downloading.');
        return;
    }
    
    const content = generateDocumentContent(currentDocumentType, currentFormData);
    const title = getDocumentTitle(currentDocumentType);
    
    // Convert HTML to plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Create and download text file
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    
    saveAs(blob, fileName);
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#48bb78';
            break;
        case 'error':
            notification.style.backgroundColor = '#f56565';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ed8936';
            break;
        default:
            notification.style.backgroundColor = '#4299e1';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
} 
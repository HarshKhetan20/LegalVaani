// Generator JavaScript for LegalVaani

let currentDocumentType = '';
let currentFormData = {};

// Initialize the generator page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Generator page loaded');
    
    // Check if libraries are loaded
    console.log('jsPDF available:', typeof window.jspdf !== 'undefined');
    console.log('htmlDocx available:', typeof window.htmlDocx !== 'undefined');
    console.log('saveAs available:', typeof window.saveAs !== 'undefined');
    
    // Get document type from sessionStorage
    const documentType = sessionStorage.getItem('selectedDocumentType');
    const documentTypeData = JSON.parse(sessionStorage.getItem('documentTypeData') || '{}');
    
    console.log('Document type:', documentType);
    console.log('Document data:', documentTypeData);
    
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
        
        // Add placeholder if specified
        if (field.placeholder) {
            input.placeholder = field.placeholder;
        }
        
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
    
    console.log('Form data updated:', currentFormData);
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
    
    // Update editor content if editor is active
    if (typeof window.getCurrentContent === 'function') {
        const editor = document.getElementById('editor');
        if (editor && !window.isEditorActive) {
            window.originalContent = content;
            window.editedContent = content;
        }
    }
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
    console.log('Download PDF clicked');
    console.log('Current form data:', currentFormData);
    
    if (!currentFormData || Object.keys(currentFormData).length === 0) {
        alert('Please fill in the form before downloading.');
        return;
    }
    
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        console.error('jsPDF library not loaded');
        alert('PDF library not loaded. Please check your internet connection and try again.');
        return;
    }
    
    try {
        // Use edited content if available, otherwise use generated content
        const content = (typeof window.getCurrentContent === 'function') ? 
            window.getCurrentContent() : 
            generateDocumentContent(currentDocumentType, currentFormData);
        const title = getDocumentTitle(currentDocumentType);
        
        console.log('Generated content:', content);
        console.log('Document title:', title);
        
        // Use jsPDF to generate PDF with text content only (no HTML conversion)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Convert HTML to plain text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        // Split text into lines that fit the page width
        const lines = doc.splitTextToSize(plainText, 180);
        
        // Add title at the top
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 105, 20, { align: 'center' });
        
        // Add a line separator
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(15, 30, 195, 30);
        
        // Add content with proper formatting
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        
        let yPosition = 40;
        const lineHeight = 7;
        const maxY = 280; // Leave space for footer
        
        for (let i = 0; i < lines.length; i++) {
            // Check if we need a new page
            if (yPosition > maxY) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.text(lines[i], 15, yPosition);
            yPosition += lineHeight;
        }
        
        // Add footer with date
        const currentDate = new Date().toLocaleDateString('en-IN');
        doc.setFontSize(10);
        doc.text(`Generated on: ${currentDate}`, 15, 290);
        
        const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        console.log('PDF downloaded successfully:', fileName);
        showNotification('PDF downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF: ' + error.message + '. Please try again or use DOCX/TXT format.');
    }
}

function downloadDOCX() {
    console.log('Download DOCX clicked');
    
    if (!currentFormData || Object.keys(currentFormData).length === 0) {
        alert('Please fill in the form before downloading.');
        return;
    }
    
    if (typeof window.htmlDocx === 'undefined') {
        alert('DOCX library not loaded. Please check your internet connection and try again.');
        return;
    }
    
    try {
        // Use edited content if available, otherwise use generated content
        const content = (typeof window.getCurrentContent === 'function') ? 
            window.getCurrentContent() : 
            generateDocumentContent(currentDocumentType, currentFormData);
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
        console.log('DOCX downloaded successfully');
        showNotification('DOCX downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error generating DOCX:', error);
        alert('Error generating DOCX. Please try again.');
    }
}

function downloadTXT() {
    console.log('Download TXT clicked');
    
    if (!currentFormData || Object.keys(currentFormData).length === 0) {
        alert('Please fill in the form before downloading.');
        return;
    }
    
    try {
        // Use edited content if available, otherwise use generated content
        const content = (typeof window.getCurrentContent === 'function') ? 
            window.getCurrentContent() : 
            generateDocumentContent(currentDocumentType, currentFormData);
        const title = getDocumentTitle(currentDocumentType);
        
        // Convert HTML to plain text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        // Create and download text file
        const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
        const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        
        saveAs(blob, fileName);
        console.log('TXT downloaded successfully');
        showNotification('TXT downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error generating TXT:', error);
        alert('Error generating TXT. Please try again.');
    }
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
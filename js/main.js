// Main JavaScript for LegalVaani Homepage

// Document type definitions
const documentTypes = {
    'cheque-bounce': {
        name: 'Cheque Bounce Notice',
        description: 'Legal notice for dishonored cheques under Section 138 of the Negotiable Instruments Act',
        icon: 'fas fa-money-check-alt',
        fields: [
            { name: 'senderName', label: 'Sender Name', type: 'text', required: true },
            { name: 'senderAddress', label: 'Sender Address', type: 'textarea', required: true },
            { name: 'recipientName', label: 'Recipient Name', type: 'text', required: true },
            { name: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
            { name: 'chequeNumber', label: 'Cheque Number', type: 'text', required: true },
            { name: 'chequeAmount', label: 'Cheque Amount', type: 'text', required: true },
            { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
            { name: 'branchName', label: 'Branch Name', type: 'text', required: true },
            { name: 'chequeDate', label: 'Cheque Date', type: 'date', required: true },
            { name: 'bounceDate', label: 'Bounce Date', type: 'date', required: true },
            { name: 'bounceReason', label: 'Bounce Reason', type: 'text', required: true },
            { name: 'noticePlace', label: 'Place of Notice', type: 'text', required: true, placeholder: 'e.g., Mumbai, Maharashtra' }
        ]
    },
    'rent-default': {
        name: 'Rent Default Notice',
        description: 'Notice for tenants who have defaulted on rent payments',
        icon: 'fas fa-home',
        fields: [
            { name: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
            { name: 'landlordAddress', label: 'Landlord Address', type: 'textarea', required: true },
            { name: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
            { name: 'tenantAddress', label: 'Tenant Address', type: 'textarea', required: true },
            { name: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
            { name: 'monthlyRent', label: 'Monthly Rent Amount', type: 'text', required: true },
            { name: 'defaultAmount', label: 'Default Amount', type: 'text', required: true },
            { name: 'defaultPeriod', label: 'Default Period', type: 'text', required: true },
            { name: 'noticeDate', label: 'Notice Date', type: 'date', required: true },
            { name: 'complianceDate', label: 'Compliance Date', type: 'date', required: true },
            { name: 'noticePlace', label: 'Place of Notice', type: 'text', required: true, placeholder: 'e.g., Mumbai, Maharashtra' }
        ]
    },
    'power-of-attorney': {
        name: 'Power of Attorney',
        description: 'Comprehensive Power of Attorney document',
        icon: 'fas fa-user-tie',
        fields: [
            { name: 'principalName', label: 'Principal Name', type: 'text', required: true },
            { name: 'principalAddress', label: 'Principal Address', type: 'textarea', required: true },
            { name: 'agentName', label: 'Agent/Attorney Name', type: 'text', required: true },
            { name: 'agentAddress', label: 'Agent Address', type: 'textarea', required: true },
            { name: 'purpose', label: 'Purpose of Power of Attorney', type: 'textarea', required: true },
            { name: 'scope', label: 'Scope of Authority', type: 'textarea', required: true },
            { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
            { name: 'expiryDate', label: 'Expiry Date (if any)', type: 'date', required: false },
            { name: 'witness1Name', label: 'Witness 1 Name', type: 'text', required: true },
            { name: 'witness1Address', label: 'Witness 1 Address', type: 'textarea', required: true },
            { name: 'witness2Name', label: 'Witness 2 Name', type: 'text', required: true },
            { name: 'witness2Address', label: 'Witness 2 Address', type: 'textarea', required: true },
            { name: 'noticePlace', label: 'Place of Document', type: 'text', required: true, placeholder: 'e.g., Mumbai, Maharashtra' }
        ]
    },
    'legal-notice': {
        name: 'General Legal Notice',
        description: 'General legal notice for various legal matters',
        icon: 'fas fa-gavel',
        fields: [
            { name: 'senderName', label: 'Sender Name', type: 'text', required: true },
            { name: 'senderAddress', label: 'Sender Address', type: 'textarea', required: true },
            { name: 'recipientName', label: 'Recipient Name', type: 'text', required: true },
            { name: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
            { name: 'subject', label: 'Subject of Notice', type: 'text', required: true },
            { name: 'matter', label: 'Matter in Dispute', type: 'textarea', required: true },
            { name: 'demand', label: 'Demand/Claim', type: 'textarea', required: true },
            { name: 'complianceDate', label: 'Compliance Date', type: 'date', required: true },
            { name: 'noticeDate', label: 'Notice Date', type: 'date', required: true },
            { name: 'noticePlace', label: 'Place of Notice', type: 'text', required: true, placeholder: 'e.g., Mumbai, Maharashtra' }
        ]
    }
};

// Function to select document type and navigate to generator
function selectDocument(documentType) {
    if (documentTypes[documentType]) {
        // Store the selected document type in sessionStorage
        sessionStorage.setItem('selectedDocumentType', documentType);
        sessionStorage.setItem('documentTypeData', JSON.stringify(documentTypes[documentType]));
        
        // Navigate to the generator page
        window.location.href = 'generator.html';
    } else {
        console.error('Invalid document type:', documentType);
    }
}

// Add click event listeners to document cards
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects and click handlers to document cards
    const documentCards = document.querySelectorAll('.document-card');
    
    documentCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the button
            if (e.target.tagName === 'BUTTON') {
                return;
            }
            
            const documentType = card.dataset.type;
            if (documentType) {
                selectDocument(documentType);
            }
        });
    });

    // Add smooth scrolling for better UX
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('btn-secondary')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
});

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
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
    
    // Set background color based on type
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { documentTypes, selectDocument, showNotification };
} 
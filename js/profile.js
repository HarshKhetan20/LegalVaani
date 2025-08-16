document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            document.querySelector('.auth-buttons').style.display = 'none';
            document.querySelector('.user-info').style.display = 'flex';
            
            // Load user data
            const userData = JSON.parse(localStorage.getItem('user')) || {};
            document.getElementById('user-name').textContent = userData.name || user.displayName || 'User Name';
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('full-name').value = userData.name || user.displayName || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = userData.phone || '';
            document.getElementById('location').value = userData.location || '';
            
            // Load user documents
            loadUserDocuments();
        } else {
            // No user is signed in
            window.location.href = 'index.html';
        }
    });

    // Update Profile Handler
    document.querySelector('.update-btn').addEventListener('click', () => {
        const user = firebase.auth().currentUser;
        if (!user) return;

        const updatedUser = {
            name: document.getElementById('full-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value
        };

        // Update email if changed
        if (updatedUser.email !== user.email) {
            user.updateEmail(updatedUser.email)
                .then(() => {
                    console.log('Email updated successfully');
                })
                .catch((error) => {
                    alert('Error updating email: ' + error.message);
                    return;
                });
        }

        // Update other profile data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
    });

    // Change Password Handler
    document.querySelector('.change-password-btn').addEventListener('click', () => {
        const newPassword = prompt('Enter new password:');
        if (!newPassword) return;

        const user = firebase.auth().currentUser;
        user.updatePassword(newPassword)
            .then(() => {
                alert('Password updated successfully!');
            })
            .catch((error) => {
                // If error requires recent login
                if (error.code === 'auth/requires-recent-login') {
                    const email = user.email;
                    const currentPassword = prompt('For security, please enter your current password:');
                    if (!currentPassword) return;

                    // Reauthenticate user
                    const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
                    user.reauthenticateWithCredential(credential)
                        .then(() => {
                            // Retry password update
                            return user.updatePassword(newPassword);
                        })
                        .then(() => {
                            alert('Password updated successfully!');
                        })
                        .catch((error) => {
                            alert('Error updating password: ' + error.message);
                        });
                } else {
                    alert('Error updating password: ' + error.message);
                }
            });
    });

    // Logout Handler
    document.querySelector('.logout-btn').addEventListener('click', () => {
        firebase.auth().signOut()
            .then(() => {
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                alert('Error signing out: ' + error.message);
            });
    });
    // Function to save document when downloaded
    window.saveDocumentToProfile = function(docData) {
        const user = firebase.auth().currentUser;
        if (!user) return;

        const userDocs = JSON.parse(localStorage.getItem(`userDocs_${user.uid}`)) || [];
        const newDoc = {
            id: Date.now().toString(),
            name: docData.name,
            content: docData.content,
            createdAt: new Date().toISOString(),
            type: docData.type
        };

        userDocs.push(newDoc);
        localStorage.setItem(`userDocs_${user.uid}`, JSON.stringify(userDocs));
        loadUserDocuments(); // Refresh the documents list
    };

    // Function to load user documents
    function loadUserDocuments() {
        const documentsList = document.getElementById('documents-list');
        const user = firebase.auth().currentUser;
        if (!user || !documentsList) return;
        
        const userDocs = JSON.parse(localStorage.getItem(`userDocs_${user.uid}`)) || [];
        
        if (userDocs.length === 0) {
            documentsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <p>No documents yet</p>
                </div>
            `;
            return;
        }

        documentsList.innerHTML = userDocs.map(doc => `
            <div class="document-item">
                <div class="document-info" onclick="showDownloadModal('${doc.id}')">
                    <div class="document-icon">
                        <i class="${getDocumentIcon(doc.type)}"></i>
                    </div>
                    <div class="document-details">
                        <h4>${doc.name}</h4>
                        <p>Created on ${new Date(doc.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="document-actions">
                    <i class="fas fa-download" onclick="showDownloadModal('${doc.id}')"></i>
                    <i class="fas fa-trash delete-icon" onclick="showDeleteModal('${doc.id}', event)"></i>
                </div>
            </div>
        `).join('');
    }

    // Helper function to get appropriate icon
    function getDocumentIcon(type) {
        switch(type) {
            case 'cheque-bounce':
                return 'fas fa-money-check-alt';
            case 'rent-default':
                return 'fas fa-home';
            case 'power-of-attorney':
                return 'fas fa-user-tie';
            case 'legal-notice':
                return 'fas fa-gavel';
            default:
                return 'fas fa-file-alt';
        }
    }

    let currentDocumentId = null;

    window.showDownloadModal = function(documentId) {
        currentDocumentId = documentId;
        document.getElementById('download-modal').style.display = 'block';
    }

    window.closeDownloadModal = function() {
        document.getElementById('download-modal').style.display = 'none';
        currentDocumentId = null;
    }
    
    window.showDeleteModal = function(documentId, event) {
        // Prevent the click from triggering the parent's onclick
        if (event) {
            event.stopPropagation();
        }
        
        currentDocumentId = documentId;
        document.getElementById('delete-modal').style.display = 'block';
    }

    window.closeDeleteModal = function() {
        document.getElementById('delete-modal').style.display = 'none';
        currentDocumentId = null;
    }

    window.confirmDeleteDocument = function() {
        if (!currentDocumentId) return;
        
        const user = firebase.auth().currentUser;
        if (!user) return;
        
        const userDocs = JSON.parse(localStorage.getItem(`userDocs_${user.uid}`)) || [];
        const updatedDocs = userDocs.filter(doc => doc.id !== currentDocumentId);
        
        // Save updated documents list to localStorage
        localStorage.setItem(`userDocs_${user.uid}`, JSON.stringify(updatedDocs));
        
        // Close the modal and refresh the documents list
        closeDeleteModal();
        loadUserDocuments();
        
        // Show success notification
        alert('Document deleted successfully');
    }

    window.downloadDocument = function(format) {
        if (!currentDocumentId) return;
        
        // Get document content from storage
        const userDocs = JSON.parse(localStorage.getItem(`userDocs_${firebase.auth().currentUser.uid}`)) || [];
        const doc = userDocs.find(d => d.id === currentDocumentId);
        
        if (!doc) {
            alert('Document not found');
            return;
        }

        // Generate file based on format
        switch(format) {
            case 'pdf':
                // Implement PDF generation
                generatePDF(doc);
                break;
            case 'docx':
                // Implement DOCX generation
                generateDOCX(doc);
                break;
            case 'txt':
                // Implement TXT generation
                generateTXT(doc);
                break;
        }

        closeDownloadModal();
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            if (event.target.id === 'download-modal') {
                closeDownloadModal();
            } else if (event.target.id === 'delete-modal') {
                closeDeleteModal();
            }
        }
    };
    
    // PDF generation function
    function generatePDF(doc) {
        try {
            // Use jsPDF to generate PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Add title
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text(doc.name, 105, 20, { align: 'center' });
            
            // Add content
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            
            // Convert HTML content to plain text if needed
            let content = doc.content;
            if (content.includes('<')) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                content = tempDiv.textContent || tempDiv.innerText || '';
            }
            
            // Split text into lines
            const lines = pdf.splitTextToSize(content, 180);
            let yPosition = 40;
            const lineHeight = 7;
            
            for (let i = 0; i < lines.length; i++) {
                if (yPosition > 280) {
                    pdf.addPage();
                    yPosition = 20;
                }
                pdf.text(lines[i], 15, yPosition);
                yPosition += lineHeight;
            }
            
            // Add footer
            const currentDate = new Date().toLocaleDateString();
            pdf.setFontSize(10);
            pdf.text(`Generated on: ${currentDate}`, 15, 290);
            
            // Save PDF
            const fileName = `${doc.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
            alert('PDF downloaded successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF: ' + error.message);
        }
    }
    
    // DOCX generation function
    function generateDOCX(doc) {
        try {
            // Create document content for DOCX
            const docxContent = `
                <html>
                    <head>
                        <style>
                            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; }
                            h1 { font-size: 16pt; font-weight: bold; text-align: center; }
                            h2 { font-size: 14pt; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <h1>${doc.name}</h1>
                        ${doc.content}
                    </body>
                </html>
            `;
            
            // Use html-docx-js to generate DOCX
            const converted = htmlDocx.asBlob(docxContent);
            const fileName = `${doc.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
            
            // Download the file
            saveAs(converted, fileName);
            alert('DOCX downloaded successfully!');
        } catch (error) {
            console.error('Error generating DOCX:', error);
            alert('Error generating DOCX: ' + error.message);
        }
    }
    
    // TXT generation function
    function generateTXT(doc) {
        try {
            // Convert HTML to plain text if needed
            let content = doc.content;
            if (content.includes('<')) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                content = tempDiv.textContent || tempDiv.innerText || '';
            }
            
            // Create and download text file
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const fileName = `${doc.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
            
            saveAs(blob, fileName);
            alert('TXT downloaded successfully!');
        } catch (error) {
            console.error('Error generating TXT:', error);
            alert('Error generating TXT: ' + error.message);
        }
    }
});

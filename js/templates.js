// Legal Document Templates for LegalVaani

const documentTemplates = {
    'cheque-bounce': {
        title: 'LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881',
        template: `
            <div class="document-content">
                <h1>LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881</h1>
                
                <p><strong>From:</strong><br>
                {{senderName}}<br>
                {{senderAddress}}</p>
                
                <p><strong>To:</strong><br>
                {{recipientName}}<br>
                {{recipientAddress}}</p>
                
                <p><strong>Subject:</strong> Legal Notice under Section 138 of the Negotiable Instruments Act, 1881 for dishonor of cheque bearing No. {{chequeNumber}} dated {{chequeDate}} for Rs. {{chequeAmount}}/-</p>
                
                <p>Dear Sir/Madam,</p>
                
                <p>I, {{senderName}}, through my advocate, hereby serve upon you this legal notice under Section 138 of the Negotiable Instruments Act, 1881, for the dishonor of the cheque issued by you.</p>
                
                <h2>FACTS OF THE CASE:</h2>
                
                <p>1. That you had issued a cheque bearing No. {{chequeNumber}} dated {{chequeDate}} for an amount of Rs. {{chequeAmount}}/- (Rupees {{chequeAmount}} only) drawn on {{bankName}}, {{branchName}} branch.</p>
                
                <p>2. That the said cheque was presented for encashment on {{bounceDate}} at the bank.</p>
                
                <p>3. That the said cheque was dishonored by the bank due to {{bounceReason}}.</p>
                
                <p>4. That the bank returned the dishonored cheque along with a memo stating the reason for dishonor.</p>
                
                <h2>LEGAL POSITION:</h2>
                
                <p>Under Section 138 of the Negotiable Instruments Act, 1881, dishonor of a cheque for insufficiency of funds or any other reason is a criminal offense punishable with imprisonment for a term which may extend to two years, or with fine which may extend to twice the amount of the cheque, or with both.</p>
                
                <h2>DEMAND:</h2>
                
                <p>Therefore, I hereby demand from you to pay the amount of Rs. {{chequeAmount}}/- (Rupees {{chequeAmount}} only) within 15 days from the receipt of this notice, failing which I shall be constrained to initiate criminal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881, before the competent court of law.</p>
                
                <p>Please treat this as a final notice and make the payment within the stipulated time to avoid legal consequences.</p>
                
                <p>Yours faithfully,</p>
                
                <div class="signature-section">
                    <div class="signature-box">
                        <p>_________________</p>
                        <p>{{senderName}}</p>
                        <p>Through Advocate</p>
                    </div>
                    <div class="signature-box">
                        <p>Date: {{currentDate}}</p>
                        <p>Place: {{currentPlace}}</p>
                    </div>
                </div>
            </div>
        `
    },
    
    'rent-default': {
        title: 'LEGAL NOTICE FOR RENT DEFAULT AND TERMINATION OF TENANCY',
        template: `
            <div class="document-content">
                <h1>LEGAL NOTICE FOR RENT DEFAULT AND TERMINATION OF TENANCY</h1>
                
                <p><strong>From:</strong><br>
                {{landlordName}}<br>
                {{landlordAddress}}</p>
                
                <p><strong>To:</strong><br>
                {{tenantName}}<br>
                {{tenantAddress}}</p>
                
                <p><strong>Subject:</strong> Legal Notice for default in payment of rent and termination of tenancy</p>
                
                <p>Dear Sir/Madam,</p>
                
                <p>I, {{landlordName}}, being the lawful owner of the property situated at {{propertyAddress}}, hereby serve upon you this legal notice for default in payment of rent and termination of your tenancy.</p>
                
                <h2>FACTS OF THE CASE:</h2>
                
                <p>1. That you are a tenant in the property situated at {{propertyAddress}} under a tenancy agreement.</p>
                
                <p>2. That as per the terms of the tenancy agreement, you are liable to pay a monthly rent of Rs. {{monthlyRent}}/- (Rupees {{monthlyRent}} only).</p>
                
                <p>3. That you have defaulted in payment of rent amounting to Rs. {{defaultAmount}}/- (Rupees {{defaultAmount}} only) for the period {{defaultPeriod}}.</p>
                
                <p>4. That despite repeated requests and reminders, you have failed to pay the outstanding rent amount.</p>
                
                <h2>LEGAL POSITION:</h2>
                
                <p>Under the provisions of the relevant rent control laws and the terms of the tenancy agreement, non-payment of rent constitutes a breach of the tenancy agreement, which entitles the landlord to terminate the tenancy and take possession of the property.</p>
                
                <h2>DEMAND:</h2>
                
                <p>Therefore, I hereby demand from you:</p>
                
                <p>1. To pay the outstanding rent amount of Rs. {{defaultAmount}}/- (Rupees {{defaultAmount}} only) within {{complianceDate}}.</p>
                
                <p>2. To vacate the premises situated at {{propertyAddress}} and hand over peaceful possession to me on or before {{complianceDate}}.</p>
                
                <p>3. To remove all your belongings and restore the property to its original condition.</p>
                
                <p>Please note that if you fail to comply with this notice within the stipulated time, I shall be constrained to initiate legal proceedings for eviction and recovery of the outstanding rent amount before the competent court of law.</p>
                
                <p>This notice is being sent to you on {{noticeDate}}.</p>
                
                <p>Yours faithfully,</p>
                
                <div class="signature-section">
                    <div class="signature-box">
                        <p>_________________</p>
                        <p>{{landlordName}}</p>
                        <p>Landlord</p>
                    </div>
                    <div class="signature-box">
                        <p>Date: {{noticeDate}}</p>
                        <p>Place: {{currentPlace}}</p>
                    </div>
                </div>
            </div>
        `
    },
    
    'power-of-attorney': {
        title: 'POWER OF ATTORNEY',
        template: `
            <div class="document-content">
                <h1>POWER OF ATTORNEY</h1>
                
                <p>This Power of Attorney is executed on this {{effectiveDate}} day of {{currentMonth}} {{currentYear}} at {{currentPlace}}.</p>
                
                <h2>BETWEEN:</h2>
                
                <p><strong>{{principalName}}</strong>, aged about ___ years, residing at {{principalAddress}}, hereinafter called the "PRINCIPAL" (which expression shall unless repugnant to the context or meaning thereof, be deemed to mean and include his/her heirs, executors, administrators, legal representatives and assigns) of the ONE PART.</p>
                
                <h2>AND:</h2>
                
                <p><strong>{{agentName}}</strong>, aged about ___ years, residing at {{agentAddress}}, hereinafter called the "ATTORNEY" (which expression shall unless repugnant to the context or meaning thereof, be deemed to mean and include his/her heirs, executors, administrators, legal representatives and assigns) of the OTHER PART.</p>
                
                <h2>WHEREAS:</h2>
                
                <p>The Principal desires to appoint the Attorney as his/her lawful attorney to act on his/her behalf for the purposes hereinafter mentioned.</p>
                
                <h2>NOW THIS DEED WITNESSETH AS FOLLOWS:</h2>
                
                <p>1. The Principal hereby appoints the Attorney as his/her lawful attorney to act on his/her behalf for the following purposes:</p>
                
                <p><strong>PURPOSE:</strong> {{purpose}}</p>
                
                <p><strong>SCOPE OF AUTHORITY:</strong> {{scope}}</p>
                
                <p>2. The Attorney shall have full power and authority to do all acts, deeds, matters and things necessary or incidental to the aforesaid purposes.</p>
                
                <p>3. The Principal hereby ratifies and confirms all acts, deeds, matters and things lawfully done by the Attorney in pursuance of this Power of Attorney.</p>
                
                <p>4. This Power of Attorney shall be effective from {{effectiveDate}} and shall remain in force until {{expiryDate}} or until revoked by the Principal, whichever is earlier.</p>
                
                <p>5. The Principal reserves the right to revoke this Power of Attorney at any time by giving written notice to the Attorney.</p>
                
                <p>IN WITNESS WHEREOF, the Principal has hereunto set his/her hand and seal on the day, month and year first above written.</p>
                
                <div class="signature-section">
                    <div class="signature-box">
                        <p>_________________</p>
                        <p>{{principalName}}</p>
                        <p>Principal</p>
                    </div>
                    <div class="signature-box">
                        <p>_________________</p>
                        <p>{{agentName}}</p>
                        <p>Attorney</p>
                    </div>
                </div>
                
                <h2>WITNESSES:</h2>
                
                <div class="signature-section">
                    <div class="signature-box">
                        <p>_________________</p>
                        <p>{{witness1Name}}</p>
                        <p>{{witness1Address}}</p>
                    </div>
                    <div class="signature-box">
                        <p>_________________</p>
                        <p>{{witness2Name}}</p>
                        <p>{{witness2Address}}</p>
                    </div>
                </div>
                
                <p><strong>Date:</strong> {{effectiveDate}}<br>
                <strong>Place:</strong> {{currentPlace}}</p>
            </div>
        `
    },
    
    'legal-notice': {
        title: 'LEGAL NOTICE',
        template: `
            <div class="document-content">
                <h1>LEGAL NOTICE</h1>
                
                <p><strong>From:</strong><br>
                {{senderName}}<br>
                {{senderAddress}}</p>
                
                <p><strong>To:</strong><br>
                {{recipientName}}<br>
                {{recipientAddress}}</p>
                
                <p><strong>Subject:</strong> {{subject}}</p>
                
                <p>Dear Sir/Madam,</p>
                
                <p>I, {{senderName}}, through my advocate, hereby serve upon you this legal notice regarding the matter mentioned in the subject.</p>
                
                <h2>FACTS OF THE CASE:</h2>
                
                <p>{{matter}}</p>
                
                <h2>LEGAL POSITION:</h2>
                
                <p>Under the relevant provisions of law, you are legally bound to address the issues raised in this notice and take appropriate action to resolve the matter.</p>
                
                <h2>DEMAND:</h2>
                
                <p>{{demand}}</p>
                
                <p>Therefore, I hereby demand from you to comply with the above-mentioned demands within {{complianceDate}}, failing which I shall be constrained to initiate appropriate legal proceedings against you before the competent court of law.</p>
                
                <p>Please treat this as a final notice and take necessary action within the stipulated time to avoid legal consequences.</p>
                
                <p>This notice is being sent to you on {{noticeDate}}.</p>
                
                <p>Yours faithfully,</p>
                
                <div class="signature-section">
                    <div class="signature-box">
                        <p>_________________</p>
                        <p>{{senderName}}</p>
                        <p>Through Advocate</p>
                    </div>
                    <div class="signature-box">
                        <p>Date: {{noticeDate}}</p>
                        <p>Place: {{currentPlace}}</p>
                    </div>
                </div>
            </div>
        `
    }
};

// Function to replace placeholders in template with actual values
function replacePlaceholders(template, formData) {
    let result = template;
    
    // Replace all form field placeholders
    Object.keys(formData).forEach(key => {
        const placeholder = `{{${key}}}`;
        const value = formData[key] || '';
        result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    
    // Replace common placeholders
    const currentDate = new Date();
    const currentPlace = formData.noticePlace || 'Mumbai, Maharashtra, India'; // Use custom place or default
    
    result = result.replace(/{{currentDate}}/g, currentDate.toLocaleDateString('en-IN'));
    result = result.replace(/{{currentPlace}}/g, currentPlace);
    result = result.replace(/{{currentMonth}}/g, currentDate.toLocaleDateString('en-IN', { month: 'long' }));
    result = result.replace(/{{currentYear}}/g, currentDate.getFullYear().toString());
    
    return result;
}

// Function to get document template
function getDocumentTemplate(documentType) {
    return documentTemplates[documentType] || null;
}

// Function to generate document content
function generateDocumentContent(documentType, formData) {
    const template = getDocumentTemplate(documentType);
    if (!template) {
        return '<p>Template not found for this document type.</p>';
    }
    
    return replacePlaceholders(template.template, formData);
}

// Function to get document title
function getDocumentTitle(documentType) {
    const template = getDocumentTemplate(documentType);
    return template ? template.title : 'Document';
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        documentTemplates,
        replacePlaceholders,
        getDocumentTemplate,
        generateDocumentContent,
        getDocumentTitle
    };
} 
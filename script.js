
/* 10. CONTACT FORM VALIDATION & ENQUIRY DISPATCH */

const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('userName');
const phoneInput = document.getElementById('userPhone');
const dateInput = document.getElementById('eventDate');
const messageInput = document.getElementById('userMessage');
const formStatusMsg = document.getElementById('formStatusMsg');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelectorAll('.field-error')
      .forEach(el => el.textContent = '');

    // Get all values FIRST
    const clientName = nameInput.value.trim();
    const phoneVal = phoneInput.value.replace(/[^0-9]/g, '');
    const chosenService = serviceSelect.value;
    const eventDate = dateInput.value || 'Not specified / Flexible';
    const userNotes = messageInput.value.trim();

    let isValid = true;

    if (!clientName) {
      document.getElementById('nameError').textContent =
        'Please enter your full name.';
      isValid = false;
    }

    if (phoneVal.length !== 10) {
      document.getElementById('phoneError').textContent =
        'Please enter a valid 10-digit mobile number.';
      isValid = false;
    }

    if (!chosenService) {
      document.getElementById('serviceError').textContent =
        'Please select a service.';
      isValid = false;
    }

    if (!userNotes) {
      document.getElementById('messageError').textContent =
        'Please enter your event details.';
      isValid = false;
    }

    if (!isValid) {
      showToast('Please correct the highlighted fields.', 'error');
      return;
    }

    // Save enquiry
    try {
      if (typeof saveEnquiryToDatabase !== 'function') {
        throw new Error('Database function not loaded');
      }

      await saveEnquiryToDatabase({
        name: clientName,
        phone: phoneVal,
        service: chosenService,
        event_date: eventDate,
        message: userNotes
      });

    } catch (error) {
      console.error('Booking error:', error);
      showToast('Booking could not be saved. Please try again.', 'error');
      return;
    }

    // WhatsApp message
    const waText = encodeURIComponent(
      `New Enquiry - SURYA STUDIO\n` +
      `Client Name: ${clientName}\n` +
      `Mobile: ${phoneVal}\n` +
      `Service: ${chosenService}\n` +
      `Event Date: ${eventDate}\n` +
      `Details: ${userNotes}`
    );

    const waUrl = `https://wa.me/919629009325?text=${waText}`;

    formStatusMsg.className = 'form-status-msg success';
    formStatusMsg.innerHTML = `
      <strong>Thank You, ${clientName}!</strong><br>
      Your enquiry has been received.
      <div style="margin-top:10px;">
        <a href="${waUrl}" target="_blank"
           rel="noopener noreferrer"
           class="btn btn-whatsapp btn-sm">
          Send WhatsApp Enquiry
        </a>
      </div>
    `;

    formStatusMsg.style.display = 'block';

    showToast('Enquiry received successfully!', 'success');

    contactForm.reset();
  });
}

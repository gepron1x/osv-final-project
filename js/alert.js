function showAlert(message, type = 'success') {
    const container = document.getElementById('alerts-container');
    const alert = `
<div class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
    `;
    container.innerHTML = alert;
    setTimeout(() => {
        const alertElement = document.querySelector('.alert');
        if (alertElement) {
            const bsAlert = new bootstrap.Alert(alertElement);
            bsAlert.close();
        }
    }, 5000);

    container.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}
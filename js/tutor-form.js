let currentTutor = null;
let tutorEditOrder = null;
let tutorTotalPrice = 0;

function calculateTutorPrice() {
    if (!currentTutor) return;
    
    const duration = parseInt(
        document.getElementById('tutor_duration').value) || 1;
    courseTotalPrice = currentTutor.price_per_hour * duration;
    
    document.getElementById('tutor_total_price')
        .textContent = courseTotalPrice.toLocaleString('ru-RU');
}

function openTutorRequestModal(tutor, order = null) {
    currentTutor = tutor;
    courseEditOrder = order;
    
    const form = document.getElementById('tutor-request-form');
    form.reset();
    
    document.getElementById('tutor_id').value = tutor.id;
    document.getElementById('tutor_name').value = tutor.name;
    document.getElementById('tutor_duration').value = 1;
    
    if (order) {
        document.getElementById('tutor_date_start')
            .value = order.date_start.split('T')[0];
        document.getElementById('tutor_time_start')
            .value = order.time_start.slice(0, 5);
        document.getElementById('tutor_duration').value = order.duration;
        
        document.getElementById('tutorRequestModalLabel')
            .textContent = 'Edit Tutor Order';
    } else {
        document.getElementById('tutorRequestModalLabel')
            .textContent = 'Tutor Order';
    }
    
    calculateTutorPrice();
    
    new bootstrap.Modal(document.getElementById('tutorRequestModal')).show();
}

// Пересчёт цены при изменении duration
document.getElementById('tutor_duration')
    .addEventListener('input', calculateTutorPrice);

// Отправка формы (с поддержкой PUT для редактирования)
document.getElementById('tutor-request-form')
    .addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            tutor_id: parseInt(formData.get('tutor_id')),
            course_id: null,
            date_start: formData.get('date_start'),
            time_start: formData.get('time_start'),
            duration: parseInt(formData.get('duration')),
            persons: 1,
            price: courseTotalPrice,
            early_registration: false,
            group_enrollment: false,
            intensive_course: false,
            supplementary: false,
            personalized: false,
            excursions: false,
            assessment: false,
            interactive: false
        };
        if (!data.date_start || !data.time_start) {
            showAlert('Выберите дату и время', 'danger');
            return;
        }
        try {
            let url = `${BASE_URL}/orders?api_key=${API_KEY}`;
            let method = 'POST';
            
            if (courseEditOrder) {
                url = `${BASE_URL}/orders/${courseEditOrder.id}?api_key=${API_KEY}`;
                method = 'PUT';
            }
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                bootstrap.Modal.getInstance(
                    document.getElementById('tutorRequestModal')
                ).hide();
                showAlert('Изменения сохранены.');
                if (typeof refreshEnrollments === 'function') {
                    await refreshEnrollments();
                } 
            } else {
                showAlert('Ошибка отправки', 'danger');
            }
        } catch (err) {
            showAlert('Ошибка сети', 'danger');
        }
    });

let currentCourseData = null;

let totalPrice = 0;


function openEnrollmentModal(course) {
    currentCourseData = course;
    
    const form = document.getElementById('enrollment-form');
    form.reset();

    
    document.getElementById('course_id').value = course.id;
    document.getElementById('course_name').value = course.name;
    document.getElementById('teacher_name').value = course.teacher;
    document.getElementById('display_duration').textContent = course.total_length; // weeks

    const dateSelect = document.getElementById('date_start');
    dateSelect.innerHTML = '<option value="" selected disabled>Select a date...</option>';

    const dateStrings = new Set(course.start_dates.map(dateStr => {
        return dateStr.split('T')[0];
    }));
    const sortedDates = [...dateStrings].sort();


    sortedDates.forEach(dateStr => {
        const dateObj = new Date(dateStr);
        const displayDate = dateObj.toLocaleDateString('ru-RU'); 
        
        dateSelect.insertAdjacentHTML('beforeend', 
            `<option value="${dateStr}">${displayDate}</option>`
        );
    });

    const timeSelect = document.getElementById('time_start');
    timeSelect.disabled = true;
    timeSelect.innerHTML = '<option value="" selected disabled>Choose date first</option>';
    calculatePrice();
    
    new bootstrap.Modal(document.getElementById('enrollmentModal')).show();
}

function isEarly(date) {
    const diffTime = date.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 30;
}

document.getElementById('date_start').addEventListener('change', function(e) {
    const selectedDate = e.target.value;
    if (!selectedDate) return;

    const weeks = currentCourseData.total_length;
    const startDate = new Date(selectedDate);

    const endDate = new Date(startDate.getTime() + (weeks * 7 * 24 * 60 * 60 * 1000));
    document.getElementById('display_end_date').textContent = endDate.toLocaleDateString('ru-RU');

    
    const timeSelect = document.getElementById('time_start');
    timeSelect.disabled = false;
    timeSelect.innerHTML = '<option value="" selected disabled>Select time...</option>';
    
    const slots = currentCourseData.start_dates
        .filter(dateStr => dateStr.split("T")[0] === selectedDate)
        .map(dateStr => dateStr.split("T")[1].slice(0, 5)).sort();

    slots.forEach(time => {
        timeSelect.insertAdjacentHTML('beforeend', `<option value="${time}">${time}</option>`);
    });

    calculatePrice();
});


document.getElementById('enrollment-form').addEventListener('change', calculatePrice);
document.getElementById('persons').addEventListener('input', calculatePrice);

function calculatePrice() {
    if (!currentCourseData) return;

    const feePerHour = currentCourseData.course_fee_per_hour;
    const totalHours = currentCourseData.week_length * currentCourseData.total_length;
    let courseCost = feePerHour * totalHours;

    const dateValue = document.getElementById('date_start').value;
    if (dateValue) {
        date = new Date(dateValue);
        const day = date.getDay();
        if (day === 0 || day === 6) {
            courseCost *= 1.5;
        }
        if(isEarly(date)) courseCost *= 0.9;
    }

    const timeValue = document.getElementById('time_start').value;
    if (timeValue) {
        const [hour] = timeValue.split(':').map(Number);
        if (hour >= 9 && hour < 12) {
            courseCost += 400;
        } else if (hour >= 18 && hour <= 20) {
            courseCost += 1000;
        }
    }
    let persons = parseInt(document.getElementById('persons').value) || 1;
    
    const form = document.getElementById('enrollment-form');
    
    if (form.intensive_course.checked) {
        courseCost *= 1.2;
    }
    
    if (form.excursions.checked) {
        courseCost *= 1.25;
    }
    
    let total = courseCost * persons;

    if (form.supplementary.checked) {
        total += (2000 * persons);
    }
    
    if (form.personalized.checked) {
        total += (1500 * currentCourseData.total_length);
    }
    if (persons >= 5) {
        total *= 0.85;
    }

    totalPrice = total;

    document.getElementById('total_price').textContent = Math.round(total).toLocaleString('ru-RU');
}


document.getElementById('enrollment-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    const requestData = {
        course_id: parseInt(formData.get('course_id')),
        tutor_id: null,
        date_start: formData.get('date_start'),
        time_start: formData.get('time_start'),
        duration: currentCourseData.total_length,
        persons: parseInt(formData.get('persons')),
        price: totalPrice,
        early_registration: isEarly(new Date(formData.get('date_start'))),
        group_enrollment: parseInt(formData.get('persons')) >= 5,
        intensive_course: formData.get('intensive_course') === 'on',
        supplementary: formData.get('supplementary') === 'on',
        personalized: formData.get('personalized') === 'on',
        excursions: formData.get('excursions') === 'on',
        assessment: formData.get('assessment') === 'on',
        interactive: formData.get('interactive') === 'on'
    };

    if (!requestData.date_start || !requestData.time_start) {
        alert("Please select date and time.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/orders?api_key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const result = await response.json();
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('enrollmentModal'));
            modalInstance.hide();
            showAlert('Application submitted successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(`Error: ${error.error}`, 'danger');
        }
    } catch (err) {
        console.error(err);
        showAlert('Network error occurred.', 'danger');
    }
});
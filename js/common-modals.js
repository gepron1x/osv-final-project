// Решил сделать так, чтобы не копипастить огромную форму между HTML-файлами.
function minDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

const modalHTML = 
`
 <div class="modal fade" id="enrollmentModal" tabindex="-1" aria-labelledby="enrollmentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="enrollmentModalLabel">
                    <i class="bi bi-pencil-square me-2"></i>Course Enrollment
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-body">
                <form id="enrollment-form" novalidate>
                    <input type="hidden" name="course_id" id="course_id">
                    
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Course Name</label>
                            <input type="text" class="form-control bg-light" id="course_name" readonly>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Instructor</label>
                            <input type="text" class="form-control bg-light" id="teacher_name" readonly>
                        </div>
                    </div>

                    <h6 class="border-bottom pb-2 mb-3">Schedule & Duration</h6>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label for="date_start" class="form-label">Start Date <span class="text-danger">*</span></label>
                            <select class="form-select" name="date_start" id="date_start" required>
                                <option value="" selected disabled>Select a date...</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="time_start" class="form-label">Time Slot <span class="text-danger">*</span></label>
                            <select class="form-select" name="time_start" id="time_start" disabled required>
                                <option value="" selected disabled>Choose date first</option>
                            </select>
                        </div>
                    </div>

                    <div class="alert alert-light border d-flex align-items-center mb-4" role="alert">
                        <i class="bi bi-calendar-check me-2 text-primary fs-4"></i>
                        <div>
                            <strong>Total Duration:</strong> <span id="display_duration">0</span> weeks.<br>
                            <small class="text-muted">Course ends on: <span id="display_end_date" class="fw-bold">-</span></small>
                        </div>
                    </div>

                    <h6 class="border-bottom pb-2 mb-3">Details & Options</h6>
                    <div class="row g-3 mb-3">
                        <div class="col-md-4">
                            <label for="persons" class="form-label">Students (1-20)</label>
                            <input type="number" class="form-control" name="persons" id="persons" value="1" min="1" max="20" required>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label d-block mb-2">Additional Services</label>
                        
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="intensive_course" id="intensive_course">
                            <label class="form-check-label" for="intensive_course">Intensive (+20%)</label>
                        </div>
                        
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="supplementary" id="supplementary">
                            <label class="form-check-label" for="supplementary">Materials (+2000₽/p)</label>
                        </div>
                        
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="personalized" id="personalized">
                            <label class="form-check-label" for="personalized">Individual (+1500₽/wk)</label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="excursions" id="excursions">
                            <label class="form-check-label" for="excursions">Excursions (+25%)</label>
                        </div>
                        
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="assessment" id="assessment">
                            <label class="form-check-label" for="assessment">Assessment</label>
                        </div>
                        
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="interactive" id="interactive">
                            <label class="form-check-label" for="interactive">Interactive Platform</label>
                        </div>
                    </div>

                    <div class="card bg-light border-primary mb-3">
                        <div class="card-body d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 text-primary">Total Cost:</h5>
                            <h3 class="mb-0 fw-bold"><span id="total_price">0</span> ₽</h3>
                        </div>
                    </div>

                </form>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="enrollment-form" class="btn btn-primary px-4">Submit Application</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="tutorRequestModal" tabindex="-1" aria-labelledby="tutorRequestModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="tutorRequestModalLabel">Tutor</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="tutor-request-form">
                    <input type="hidden" id="tutor_id" name="tutor_id">
                    <input type="hidden" id="tutor_persons" name="persons" value="1"> <!-- Всегда 1 -->
                    
                    <div class="mb-3">
                        <label for="tutor_name" class="form-label">Tutor Request</label>
                        <input type="text" class="form-control" id="tutor_name" readonly>
                    </div>
                    
                    <div class="mb-3">
                        <label for="date_start" class="form-label">Start Date</label>
                        <input type="date" class="form-control" id="tutor_date_start" name="date_start" min="${minDate()}" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="time_start" class="form-label">Time</label>
                        <input type="time" class="form-control" 
                        id="tutor_time_start" name="time_start" 
                        min="11:00" 
                        max="21:00"
                        required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="duration" class="form-label">Amount of hours</label>
                        <input type="number" class="form-control" id="tutor_duration" name="duration" min="1" max="40" value="1" required>
                    </div>
                    
                    <div class="alert alert-info">
                        Итоговая цена: <span id="tutor_total_price">0</span> ₽
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button type="submit" form="tutor-request-form" class="btn btn-primary">Отправить</button>
            </div>
        </div>
    </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);
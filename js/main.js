
const API_KEY = "e5992e19-c0fe-4ac0-9e07-8ccaa279890b";
const BASE_URL = "http://exam-api-courses.std-900.ist.mospolytech.ru/api";

let allCourses = [];
let filteredCourses = [];
let currentPage = 1;
const itemsPerPage = 5;

let selectedCourse = null;
let allTutors = [];
let filteredTutors = [];

const coursesList = document.getElementById('courses-list');
const paginationContainer = document.getElementById('courses-pagination');
const searchForm = document.getElementById('course-search-form');


async function onLoad() {

    await fetchCourses();
    await fetchTutors();

    renderCourses();
    renderPagination();

    renderTutors();
}

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
}


async function fetchCourses() {
    try {
        const response = await fetch(`${BASE_URL}/courses?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        allCourses = await response.json();
        filteredCourses = [...allCourses];
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

function renderCourses() {
    coursesList.innerHTML = '';
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pagedItems = filteredCourses.slice(start, end);

    if (pagedItems.length === 0) {
        coursesList.innerHTML = '<div class="col-12 text-center"><p>No courses found.</p></div>';
        return;
    }

    pagedItems.forEach(course => {
        const card = `
            <div class="col course-item" data-courseId=${course.id}>
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${course.name}</h5>
                        <p class="card-text text-muted small">${course.description || 'No description available.'}</p>
                        <div class="mt-auto">
                            <p class="fw-bold mb-2">Level: <span class="badge bg-info text-dark">${course.level || 'All'}</span></p>
                            <button class="btn btn-primary w-100 mt-2 order-course-btn">
                                Select Course
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        coursesList.insertAdjacentHTML('beforeend', card);
    });
}


function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderCourses();
            renderPagination();
        });
        paginationContainer.appendChild(li);
    }
}


function handleSearch() {
    const nameQuery = document.getElementById('course-name').value.toLowerCase();
    const levelQuery = document.getElementById('course-level').value;

    filteredCourses = allCourses.filter(course => {
        const matchesName = course.name.toLowerCase().includes(nameQuery);
        const matchesLevel = levelQuery === "" || course.level === levelQuery;
        return matchesName && matchesLevel;
    });

    currentPage = 1;
    renderCourses();
    renderPagination();
}

function handleCourseOrder(event) {
    if(!event.target.classList.contains("order-course-btn")) return;
    const parent = event.target.closest('.course-item');
    const courseId = parent.dataset.courseid;
    const course = allCourses.find(course => courseId == course.id);
    console.log(courseId);
    openEnrollmentModal(course);
}



async function fetchTutors() {
    try {
        const response = await fetch(`${BASE_URL}/tutors?api_key=${API_KEY}`);
        allTutors = await response.json();
        filteredTutors = [...allTutors];
    } catch (error) {
        showAlert('Error loading tutors', 'danger');
    }
}

function renderTutors() {
    const container = document.getElementById('tutors-list');
    container.innerHTML = '';

    if (filteredTutors.length === 0) {
        container.innerHTML = '<tr><td colspan="6" class="text-center">No tutors found matching your criteria.</td></tr>';
        return;
    }

    filteredTutors.forEach(tutor => {
        const row = `
                <tr>
                    <td><img src="assets/icons/tutor.svg" width="24" height="24" class="me-2"> ${tutor.name}</td>
                    <td>${tutor.language_level}</td>
                    <td>${tutor.languages_spoken.join(', ')}</td>
                    <td>${tutor.work_experience} years</td>
                    <td>${tutor.price_per_hour}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary">Choose</button>
                    </td>
                </tr>
            `;
        container.insertAdjacentHTML('beforeend', row);
    });
}

function handleTutorSearch() {
    const qualFilter = document.getElementById('tutor-qualification').value;
    const expFilter = parseInt(document.getElementById('tutor-experience').value) || 0;

    filteredTutors = allTutors.filter(tutor => {
        console.log(qualFilter);
        console.log(tutor.language_level);
        const matchesQual = !qualFilter || tutor.language_level.toLowerCase() === qualFilter;
        const matchesExp = tutor.work_experience >= expFilter;
        return matchesQual && matchesExp;
    });
    renderTutors();
}

// Event Listeners
document.querySelector('#courses-list').addEventListener('click', handleCourseOrder);
document.querySelector('#course-search-form button').addEventListener('click', handleSearch);
document.querySelector('#tutor-filter-form button').addEventListener('click', handleTutorSearch);
// Initialize
document.addEventListener('DOMContentLoaded', onLoad);
// Configuration
const API_KEY = "e5992e19-c0fe-4ac0-9e07-8ccaa279890b"; // Replace with your actual API Key
const BASE_URL = "http://exam-api-courses.std-900.ist.mospolytech.ru";

// State management
let allCourses = [];
let filteredCourses = [];
let currentPage = 1;
const itemsPerPage = 5;

// Elements
const coursesList = document.getElementById('courses-list');
const paginationContainer = document.getElementById('courses-pagination');
const searchForm = document.getElementById('course-search-form');

/**
 * Fetch courses from the API
 */
async function fetchCourses() {
    try {
        const response = await fetch(`${BASE_URL}/courses?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        allCourses = await response.json();
        filteredCourses = [...allCourses];
        renderCourses();
        renderPagination();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

/**
 * Render course cards based on current page and filters
 */
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
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${course.name}</h5>
                        <p class="card-text text-muted small">${course.description || 'No description available.'}</p>
                        <div class="mt-auto">
                            <p class="fw-bold mb-2">Level: <span class="badge bg-info text-dark">${course.level || 'All'}</span></p>
                            <button class="btn btn-primary w-100 mt-2" onclick="openOrderModal(${course.id}, '${course.name}')">
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

/**
 * Handle Pagination rendering
 */
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

/**
 * Search and Filter Logic
 */
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

/**
 * Show Alert Messages
 */
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

/**
 * Modal Logic
 */
window.openOrderModal = function(courseId, courseName) {
    document.getElementById('selected-item-name').textContent = courseName;
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    modal.show();
    // Here you would also fetch tutors for this specific course
    fetchTutors(courseId);
};

async function fetchTutors(courseId) {
    const tutorsTable = document.getElementById('tutors-list');
    tutorsTable.innerHTML = '<tr><td colspan="5" class="text-center">Loading tutors...</td></tr>';
    
    try {
        // According to API docs, we might need courseId to filter tutors
        const response = await fetch(`${BASE_URL}/tutors?api_key=${API_KEY}`);
        const tutors = await response.json();
        
        tutorsTable.innerHTML = '';
        tutors.forEach(tutor => {
            const row = `
                <tr>
                    <td>${tutor.name}</td>
                    <td>${tutor.work_level}</td>
                    <td>${tutor.experience} years</td>
                    <td>${tutor.price_per_hour}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary">Choose</button>
                    </td>
                </tr>
            `;
            tutorsTable.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        tutorsTable.innerHTML = '<tr><td colspan="5" class="text-danger text-center">Error loading tutors</td></tr>';
    }
}

// Event Listeners
document.querySelector('#course-search-form button').addEventListener('click', handleSearch);

// Initialize
document.addEventListener('DOMContentLoaded', fetchCourses);
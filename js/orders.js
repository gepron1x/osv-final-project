orders = [];
courses = [];

currentOrder = null;

let currentPage = 1;
const itemsPerPage = 5;

const ordersTable = document.getElementById('orders-table-body');
const paginationContainer = document.getElementById('orders-pagination');


async function fetchData() {
    try {
        orders = await fetchOrders();
        courses = await fetchCourses();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

function renderOrders() {
    if (orders.length == 0) {
        ordersTable.innerHTML = 
        `<tr><td colspan="5" class="text-center p-4">None</td></tr>`;
        return;
    }
    ordersTable.innerHTML = ``;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pagedItems = orders.slice(start, end);

    pagedItems.forEach((order, index) => {
        const courseObj = courses.find(c => c.id === order.course_id);
        const nameDisplay = courseObj ? courseObj.name : 'Неизвестный курс';
        
        const dateDisplay = new Date(order.date_start)
            .toLocaleDateString('ru-RU');
        const priceDisplay = new Intl.NumberFormat('ru-RU').format(order.price);

        const rowNumber = start + index + 1;
        const row = `
        <tr data-orderid=${order.id}>
            <td>${rowNumber}</td>
            <td><strong>${nameDisplay}</strong></td>
            <td>${dateDisplay} <span class="text-muted ms-1">(${order.time_start.slice(0, 5)})</span></td>
            <td>${priceDisplay} ₽</td>
            <td>
                <button class="btn btn-sm btn-outline-warning me-1 edit-order-btn" title="Редактировать">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-order-btn" title="Удалить">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
        `;
        ordersTable.insertAdjacentHTML('beforeend', row);
    });
        
}

function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderOrders();
            renderPagination();
        });
        paginationContainer.appendChild(li);
    }
}

async function onLoad() {
    await fetchData();

    renderOrders();
    renderPagination();

}

async function refreshEnrollments() {
    await onLoad();
}

document.addEventListener('DOMContentLoaded', onLoad);

ordersTable.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-order-btn');
    const editBtn = e.target.closest('.edit-order-btn');

    if (deleteBtn) {
        const orderId = deleteBtn.closest('tr').dataset.orderid;
        const order = orders.find(order => order.id == orderId);
        currentOrder = order;
        new bootstrap.Modal('#deleteModal').show();
        return; 
    }

    if (editBtn) {
        const orderId = editBtn.closest('tr').dataset.orderid;
        const order = orders.find(order => order.id == orderId);
        const course = courses.find(course => course.id == order.course_id);
        openEnrollmentModal(course, order);
    }
});

document.getElementById('confirm-delete-btn')
    .addEventListener('click', async (e) => {
        url = `${BASE_URL}/orders/${currentOrder.id}?api_key=${API_KEY}`;
        await fetch(url, { method: 'DELETE' });
        bootstrap.Modal.getInstance('#deleteModal').hide();
        await onLoad();
    });



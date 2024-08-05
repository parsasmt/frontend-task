    document.addEventListener('DOMContentLoaded', () => {
        // Fetch and load data into the table
        fetch('./info.json')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('table-body');
                data.forEach(item => {
                    addItemToTable(item);
                });
            })
            .catch(error => console.error('Error loading data:', error));

        // Add new item to the table
        const addItemForm = document.getElementById('add-item-form');
        addItemForm.addEventListener('submit', event => {
            event.preventDefault();
            const firstName = event.target.first_name.value.trim();
            const lastName = event.target.last_name.value.trim();
            const ssn = event.target.social_security_number.value.trim();

            // Validate input fields
            if (!firstName || !lastName || !ssn) {
                document.getElementById('add-error').textContent = 'All fields are required.';
                return;
            }

            if (ssn.length > 10) {
                document.getElementById('add-error').textContent = 'SSN must be a maximum of 10 digits.';
                return;
            }

            // Clear error message
            document.getElementById('add-error').textContent = '';

            const newItem = {
                first_name: firstName,
                last_name: lastName,
                social_security_number: ssn
            };
            addItemToTable(newItem);
            event.target.reset();
            closeModal('add-modal');
        });

        // Save edited item
        const editItemForm = document.getElementById('edit-item-form');
        editItemForm.addEventListener('submit', event => {
            event.preventDefault();
            const rowId = document.getElementById('edit-modal').dataset.row;
            const row = document.querySelector(`#${rowId}`);
            const cells = row.getElementsByTagName('td');
            const firstName = event.target.first_name.value.trim();
            const lastName = event.target.last_name.value.trim();
            const ssn = event.target.social_security_number.value.trim();

            // Validate input fields
            if (!firstName || !lastName || !ssn) {
                alert('All fields are required.');
                return;
            }

            if (ssn.length > 10) {
                alert('SSN must be a maximum of 10 digits.');
                return;
            }

            cells[0].textContent = firstName;
            cells[1].textContent = lastName;
            cells[2].textContent = ssn;
            closeModal('edit-modal');
        });

        // Add item to the table
        function addItemToTable(item) {
            const row = document.createElement('tr');
            row.id = `row-${new Date().getTime()}`;

            const firstNameCell = document.createElement('td');
            firstNameCell.textContent = item.first_name;
            row.appendChild(firstNameCell);

            const lastNameCell = document.createElement('td');
            lastNameCell.textContent = item.last_name;
            row.appendChild(lastNameCell);

            const ssnCell = document.createElement('td');
            ssnCell.textContent = item.social_security_number;
            row.appendChild(ssnCell);

            const actionsCell = document.createElement('td');
            actionsCell.innerHTML = `
                <i class="fas fa-eye" onclick="viewRow(this)"></i>
                <i class="fas fa-edit" onclick="editRow(this)"></i>
                <i class="fas fa-trash" onclick="deleteRow(this)"></i>
            `;
            row.appendChild(actionsCell);

            document.getElementById('table-body').appendChild(row);
        }

        // View row details
        window.viewRow = function (icon) {
            const row = icon.closest('tr');
            const cells = row.getElementsByTagName('td');
            document.getElementById('view-first-name').textContent = cells[0].textContent;
            document.getElementById('view-last-name').textContent = cells[1].textContent;
            document.getElementById('view-ssn').textContent = cells[2].textContent;
            document.getElementById('view-modal').style.display = 'block';
        }

        // Edit row details
        window.editRow = function (icon) {
            const row = icon.closest('tr');
            const rowId = row.id;
            const cells = row.getElementsByTagName('td');
            document.getElementById('edit-first-name').value = cells[0].textContent;
            document.getElementById('edit-last-name').value = cells[1].textContent;
            document.getElementById('edit-ssn').value = cells[2].textContent;
            document.getElementById('edit-modal').dataset.row = rowId;
            document.getElementById('edit-modal').style.display = 'block';
        }

        // Delete row
        window.deleteRow = function (icon) {
            if (confirm('Are you sure you want to delete this row?')) {
                const row = icon.closest('tr');
                row.remove();
            }
        }

        // Open modal
        window.openModal = function (modalId) {
            document.getElementById(modalId).style.display = 'block';
        }

        // Close modal
        window.closeModal = function (modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Filter table rows based on search inputs
        window.filterTable = function() {
            const firstNameFilter = document.getElementById('search-first-name').value.toLowerCase();
            const lastNameFilter = document.getElementById('search-last-name').value.toLowerCase();
            const ssnFilter = document.getElementById('search-ssn').value.toLowerCase();
            const tableBody = document.getElementById('table-body');
            const rows = tableBody.getElementsByTagName('tr');

            Array.from(rows).forEach(row => {
                const cells = row.getElementsByTagName('td');
                const firstName = cells[0].textContent.toLowerCase();
                const lastName = cells[1].textContent.toLowerCase();
                const ssn = cells[2].textContent.toLowerCase();

                const match = (firstName.includes(firstNameFilter) || firstNameFilter === '') &&
                              (lastName.includes(lastNameFilter) || lastNameFilter === '') &&
                              (ssn.includes(ssnFilter) || ssnFilter === '');
                
                row.style.display = match ? '' : 'none';
            });
        }
    });

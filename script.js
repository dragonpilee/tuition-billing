let entries = [];
let ratePerHour = 150; // Default rate
let rateSelected = false; // Flag to track if rate is selected
let studentLocked = false; // Flag to track if student details are locked
let editIndex = -1; // Index of the entry being edited

document.getElementById('lockDetailsBtn').addEventListener('click', function() {
    const studentName = document.getElementById('studentName').value;
    const rate = document.getElementById('rate').value;

    if (studentName && rate) {
        document.getElementById('studentName').disabled = true;
        document.getElementById('rate').disabled = true;
        document.getElementById('lockDetailsBtn').disabled = true;
        document.getElementById('addEntryBtn').disabled = false;
        ratePerHour = parseFloat(rate);
        rateSelected = true;
        studentLocked = true;
    } else {
        alert("Please enter a valid student name and select a rate per hour.");
    }
});

function addOrUpdateEntry() {
    const date = document.getElementById('date').value;
    const hours = parseFloat(document.getElementById('hours').value);

    if (!rateSelected) {
        alert("Please lock the student details first.");
        return;
    }

    if (date && hours >= 0) {
        if (editIndex === -1) {
            entries.push({ date, hours });
        } else {
            entries[editIndex] = { date, hours };
            editIndex = -1;
            document.getElementById('addEntryBtn').style.display = 'block';
            document.getElementById('updateEntryBtn').style.display = 'none';
        }
        updateTable();
        updateSummary();
        document.getElementById('date').value = '';
        document.getElementById('hours').value = '';
        document.getElementById('addEntryBtn').disabled = true; // Disable button until date and hours are filled
    } else {
        alert("Please enter a valid date and hours.");
    }
}

function updateTable() {
    const tbody = document.querySelector('#entriesTable tbody');
    tbody.innerHTML = '';

    entries.forEach((entry, index) => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.textContent = entry.date;
        row.appendChild(dateCell);

        const hoursCell = document.createElement('td');
        hoursCell.textContent = entry.hours;
        row.appendChild(hoursCell);

        const actionsCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn btn-warning btn-sm mr-2';
        editButton.onclick = () => editEntry(index);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.onclick = () => deleteEntry(index);
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });
}

function editEntry(index) {
    const entry = entries[index];
    document.getElementById('date').value = entry.date;
    document.getElementById('hours').value = entry.hours;
    editIndex = index;
    document.getElementById('addEntryBtn').style.display = 'none';
    document.getElementById('updateEntryBtn').style.display = 'block';
}

function updateEntry() {
    addOrUpdateEntry();
}

function deleteEntry(index) {
    entries.splice(index, 1);
    updateTable();
    updateSummary();
}

function updateSummary() {
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalBill = totalHours * ratePerHour;
    document.getElementById('totalHours').textContent = totalHours.toFixed(2);
    document.getElementById('totalBill').textContent = totalBill.toFixed(2);
}

function generatePDF() {
    const studentName = document.getElementById('studentName').value;
    const monthInput = document.getElementById('month').value;
    const month = new Date(monthInput).toLocaleString('default', { month: 'long', year: 'numeric' });
    const totalHours = document.getElementById('totalHours').textContent;
    const totalBill = document.getElementById('totalBill').textContent;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
    });

    doc.setFontSize(20);
    doc.text('Tuition Fee Details', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Student Name: ${studentName}`, 20, 40);
    doc.text(`Month: ${month}`, 20, 50);
    doc.text(`Rate per Hour: ${ratePerHour}`, 20, 60);

    doc.autoTable({
        head: [['Date', 'Hours']],
        body: entries.map(entry => [entry.date, entry.hours]),
        startY: 70,
    });

    doc.setFontSize(12);
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Hours: ${totalHours}`, 20, finalY);
    doc.text(`Total Bill: ${totalBill}`, 20, finalY + 10);

    doc.setFontSize(10);
    doc.text('Digitally signed by Alan Cyril Sunny', 105, doc.internal.pageSize.height - 10, { align: 'center' });

    doc.save('tuition_bill.pdf');
}

document.getElementById('date').addEventListener('input', toggleAddEntryButton);
document.getElementById('hours').addEventListener('input', toggleAddEntryButton);

function toggleAddEntryButton() {
    const date = document.getElementById('date').value;
    const hours = document.getElementById('hours').value;
    document.getElementById('addEntryBtn').disabled = !(date && hours);
}

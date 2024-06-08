let entries = [];
const ratePerHour = 150;
let studentNameFixed = false;

function addEntry() {
    const studentNameInput = document.getElementById('studentName');
    const studentName = studentNameInput.value;
    const date = document.getElementById('date').value;
    const hours = parseFloat(document.getElementById('hours').value);

    if (studentName && date && hours >= 0) {
        entries.push({ date, hours });
        updateTable();
        updateSummary();
        
        // Reset form but keep student name
        document.getElementById('tuitionForm').reset();
        studentNameInput.value = studentName;

        if (!studentNameFixed) {
            studentNameInput.disabled = true;
            studentNameFixed = true;
        }
    } else {
        alert("Please enter a valid student name, date, and hours.");
    }
}

function updateTable() {
    const tableBody = document.querySelector('#entriesTable tbody');
    tableBody.innerHTML = '';

    entries.forEach(entry => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const hoursCell = document.createElement('td');

        dateCell.textContent = entry.date;
        hoursCell.textContent = entry.hours;

        row.appendChild(dateCell);
        row.appendChild(hoursCell);
        tableBody.appendChild(row);
    });
}

function updateSummary() {
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalBill = totalHours * ratePerHour;

    document.getElementById('totalHours').textContent = totalHours.toFixed(2);
    document.getElementById('totalBill').textContent = totalBill.toFixed(2);
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const studentName = document.getElementById('studentName').value;

    doc.text("Tuition Billing", 10, 10);
    doc.text(`Student Name: ${studentName}`, 10, 20);

    let y = 30;
    doc.text("Entries:", 10, y);
    y += 10;
    entries.forEach(entry => {
        doc.text(`${entry.date}: ${entry.hours} hours`, 10, y);
        y += 10;
    });

    y += 10;
    const totalHours = document.getElementById('totalHours').textContent;
    const totalBill = document.getElementById('totalBill').textContent;
    doc.text(`Total Hours: ${totalHours}`, 10, y);
    y += 10;
    doc.text(`Total Bill: ${totalBill}`, 10, y);

    y += 20;
    doc.text("Signed by Home Tuition Pala", 10, y);

    doc.save('tuition_bill.pdf');
}

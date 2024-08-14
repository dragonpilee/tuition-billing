let entries = [];
let ratePerHour = 150; // Default rate
let rateSelected = false; // Flag to track if rate is selected
let studentLocked = false; // Flag to track if student details are locked

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

function addEntry() {
    const date = document.getElementById('date').value;
    const hours = parseFloat(document.getElementById('hours').value);

    if (!rateSelected) {
        alert("Please lock the student details first.");
        return;
    }

    if (date && hours >= 0) {
        entries.push({ date, hours });
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
    const month = document.getElementById('month').value;
    const totalHours = document.getElementById('totalHours').textContent;
    const totalBill = document.getElementById('totalBill').textContent;

    // Adding Title
    doc.setFontSize(22);
    doc.text("Tuition Billing Statement", 105, 20, { align: 'center' });

    // Adding Student Details
    doc.setFontSize(14);
    doc.text(`Student Name: ${studentName}`, 20, 40);
    doc.text(`Month: ${month}`, 20, 50);
    doc.text(`Rate per Hour: ${ratePerHour}`, 20, 60);

    // Adding Entries Table
    doc.setFontSize(16);
    doc.text("Entries:", 20, 80);
    doc.setFontSize(12);
    doc.autoTable({
        startY: 85,
        head: [['Date', 'Hours']],
        body: entries.map(entry => [entry.date, entry.hours]),
        theme: 'grid',
        headStyles: { fillColor: [100, 100, 255] },
        alternateRowStyles: { fillColor: [240, 240, 255] }
    });

    // Adding Summary
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text(`Total Hours: ${totalHours}`, 20, finalY);
    doc.text(`Total Bill: ${totalBill}`, 20, finalY + 10);

    // Adding Footer
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.text("Signed by Alan Cyril Sunny", 20, pageHeight - 10);

    doc.save('tuition_bill.pdf');
}

// Event listener to enable "Add Entry" button after date and hours are filled
document.getElementById('tuitionForm').addEventListener('input', function() {
    const date = document.getElementById('date').value;
    const hours = document.getElementById('hours').value;

    if (date && hours) {
        document.getElementById('addEntryBtn').disabled = false;
    } else {
        document.getElementById('addEntryBtn').disabled = true;
    }
});

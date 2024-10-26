
# Tuition Billing System

This is a simple web-based application for managing student tuition billing. It allows a tutor to record hours worked for a student, calculate the total bill, and generate a PDF invoice for the tuition fee details. The application also locks student details and restricts the date input to the selected month for ease of use.

## Features

- **Student Details**: Input the student name, previous balance, and hourly rate.
- **Date and Hours Tracking**: Add, update, or delete work entries with the date and number of hours worked.
- **Monthly Restriction**: The date picker is restricted to the selected month to avoid errors.
- **Summary**: View total hours worked, total bill, and the grand total, including any previous balance.
- **PDF Generation**: Create a detailed PDF invoice for the student, including all the billing details and a digital signature.
  
## Technologies Used

- **HTML5**: For structuring the application.
- **CSS3**: For styling the user interface.
- **JavaScript**: For handling the form input logic, calculations, and PDF generation.
- **Bootstrap 4**: For responsive design and pre-built components.
- **jsPDF**: To generate PDF files from the billing data.
- **jsPDF-AutoTable**: To create tables in the generated PDFs.

## Installation

1. **Download or Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd tuition-billing-system
   ```

2. **Open the `index.html` file** in your browser.

   This application is client-side only, so no server is required. Simply open the `index.html` file in a browser to run the app.

## Usage

1. **Enter Student Details**: Fill in the student’s name, previous balance (if any), and select the rate per hour from the dropdown.
   
2. **Lock Details**: After entering the student’s information, click the "Lock Details" button. This will lock the student’s information to prevent accidental changes.
   
3. **Select a Month**: Choose the month for which you want to record hours worked.
   
4. **Add Work Entries**: For each workday, select the date (which will be restricted to the selected month) and enter the number of hours worked.
   
5. **View Summary**: The total hours worked, total bill, and grand total will update automatically as you add entries.

6. **Generate PDF**: Once you've finished adding entries, click "Save as PDF" to generate a detailed bill for the student, including hours worked and total amounts.



## File Structure

- **index.html**: The main HTML file that includes the form and table for entering and displaying the tuition details.
- **styles.css**: The CSS file for styling the application layout and components.
- **script.js**: The JavaScript file that contains all the form handling, calculations, table management, and PDF generation logic.

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it as you see fit.

## Contact

For any queries, feel free to contact:

**Alan Cyril Sunny**  
[GitHub](https://github.com/dragonpilee)

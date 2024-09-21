document.addEventListener('DOMContentLoaded', function () {
  const tableBody = document.querySelector('#gradesTable tbody');
  const unsubmittedCountElement = document.getElementById('unsubmittedCount');
  const addAssignmentBtn = document.getElementById('addColumn');
  let assignmentCount = 3; // Starting with 3 assignments
  let currentGradeFormat = 'percent'; // Keep track of the current format


  
  function getRandomName() {
      const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones"];
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return randomFirstName + ' ' + randomLastName;
  }

  function getRandomID() {
      const randomID = Math.floor(100000000 + Math.random() * 900000000);
      return randomID.toString();
  }

  let savedState = null;

  function saveTableState() {
    // Save the entire innerHTML of the grades table, including the headers
    localStorage.setItem('gradesTable', document.querySelector('#gradesTable').innerHTML);
    localStorage.setItem('assignmentCount', assignmentCount);
}


function restoreTableState() {
  // Check if the saved state is available
  const savedTableState = localStorage.getItem('gradesTable');
  const savedAssignmentCount = parseInt(localStorage.getItem('assignmentCount'), 10);

  if (savedTableState && !isNaN(savedAssignmentCount)) {
      // Replace the entire innerHTML of the grades table with the saved state
      document.querySelector('#gradesTable').innerHTML = savedTable;
      assignmentCount = savedAssignmentCount;
      
      // Since the whole table has been replacedreattach the event listeners to the cells
      attachCellListeners();

      updateUnsubmittedCount();
  } else {
      alert('No saved table state found.');
  }
}

// Add these event listeners inside the DOMContentLoaded callback
document.getElementById('saveTableState').addEventListener('click', saveTableState);
document.getElementById('restoreTableState').addEventListener('click', restoreTableState);

function attachCellListeners() {
  const cells = document.querySelectorAll('#gradesTable td[contenteditable="true"]');
  cells.forEach(cell => {
      cell.onblur = function() {
          validateCell(cell);
          calculateAverageAndUpdateRow(cell.parentElement);
      };
  });
}
// After creating the initial table
for (let i = 0; i < 0; i++) {
  addStudent();
}
attachCellListeners();

// And also after each time you add an assignment
function addAssignment() {

  attachCellListeners();  // Call it here after adding a new assignment
}


  function addStudent() {
      const row = tableBody.insertRow();
      const nameCell = row.insertCell();
      const idCell = row.insertCell();
      nameCell.innerText = getRandomName();
      idCell.innerText = getRandomID();

      for (let i = 0; i < assignmentCount; i++) {
          const cell = row.insertCell();
          cell.setAttribute('contenteditable', 'true');
          
          cell.onblur = function () {
              validateCell(cell);
              calculateAverageAndUpdateRow(row);
          };
      }

      const averageCell = row.insertCell();
      averageCell.classList.add('average');
      calculateAverageAndUpdateRow(row);
  }

  function addAssignment() {
    assignmentCount++;

    const headerRow = document.querySelector('#gradesTable thead tr');
    const allRows = document.querySelectorAll('#gradesTable tbody tr');

    // Create a new header cell for the new assignment
    const newHeader = document.createElement('th');
    newHeader.textContent = `Assignment ${assignmentCount}`;
    headerRow.insertBefore(newHeader, headerRow.lastElementChild); // Insert before the average cell

    // Add a new cell to all existing rows before the average cell
    allRows.forEach(row => {
        const newCell = row.insertCell(row.cells.length - 1);
        newCell.setAttribute('contenteditable', 'true');
      
        newCell.onblur = function () {
            validateCell(newCell);
            calculateAverageAndUpdateRow(row);
        };
    });

      updateUnsubmittedCount();
  }

  function calculateAverageAndUpdateRow(row) {
      const grades = Array.from(row.querySelectorAll('td[contenteditable="true"]'));
      let sum = 0;
      let count = 0;
      grades.forEach((cell) => {
          const value = parseInt(cell.innerText, 10);
          if (!isNaN(value)) {
              sum += value;
              count++;
          }
      });

      const averageCell = row.querySelector('.average');
      if (count > 0) {
          const average = Math.round(sum / count);
          averageCell.innerText = average + '%';
          averageCell.classList.toggle('low-grade', average < 60);
      } else {
          averageCell.innerText = '-';
      }
  }

  function updateUnsubmittedCount() {
      const allEditableCells = tableBody.querySelectorAll('td[contenteditable="true"]');
      let unsubmitted = 0;

      allEditableCells.forEach(cell => {
          if (cell.textContent.trim === '-') {
              unsubmitted++;
          }
      });

      unsubmittedCountElement.textContent = `Unsubmitted Assignments: ${unsubmitted}`;
  }
  function validateCell(cell) {
    const value = cell.innerText.trim();
    
    // Only change the cell's appearance if the value is '-'
    if (value === '-') {
      cell.style.backgroundColor = 'yellow';
    } else {
      cell.style.backgroundColor = '';
    
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
        // Handle the case for invalid numbers if needed
        cell.innerText = '-';
            cell.style.backgroundColor = 'yellow';
        }
    }

    updateUnsubmittedCount();
}
  

  function convertGrade(percentage) {
      if (percentage >= 93) return { letter: 'A', scale: 4.0 };
      if (percentage >= 90) return { letter: 'A-', scale: 3.7 };
      if (percentage >= 87) return { letter: 'B+', scale: 3.3 };
      if (percentage >= 83) return { letter: 'B', scale: 3.0 };
      if (percentage >= 80) return { letter: 'B-', scale: 2.7 };
      if (percentage >= 77) return { letter: 'C+', scale: 2.3 };
      if (percentage >= 73) return { letter: 'C', scale: 2.0 };
      if (percentage >= 70) return { letter: 'C-', scale: 1.7 };
      if (percentage >= 67) return { letter: 'D+', scale: 1.3 };
      if (percentage >= 63) return { letter: 'D', scale: 1.0 };
      if (percentage >= 60) return { letter: 'D-', scale: 0.7 };
      return { letter: 'F', scale: 0.0 };
  }
  function convertToScaleGrade(percent) {
    if (percent >= 93) return 4.0;
    if (percent >= 90) return 3.7;
    if (percent >= 87) return 3.3;
    if (percent >= 83) return 3.0;
    if (percent >= 80) return 2.7;
    if (percent >= 77) return 2.3;
    if (percent >= 73) return 2.0;
    if (percent >= 70) return 1.7;
    if (percent >= 67) return 1.3;
    if (percent >= 63) return 1.0;
    if (percent >= 60) return 0.7;
    return 0.0;
}
function convertToLetterGrade(percent) {
        if (percent >= 93) return 'A';
        if (percent >= 90) return 'A-';
        if (percent >= 87) return 'B+';
        if (percent >= 83) return 'B';
        if (percent >= 80) return 'B-';
        if (percent >= 77) return 'C+';
        if (percent >= 73) return 'C';
        if (percent >= 70) return 'C-';
        if (percent >= 67) return 'D+';
        if (percent >= 63) return 'D';
        if (percent >= 60) return 'D-';
        return 'F';
    }

    function convertFromLetterGrade(letter) {
        // This function should map letter grades back to a percentage.
       
        switch (letter) {
            case 'A': return 93;
            case 'A-': return 90;
            // ... add other cases for B+, B, B-, etc.
            case 'F': return 59;
            default: return null;
        }
    }
function updateGradesToCurrentFormat() {
  document.querySelectorAll('#gradesTable tbody .average').forEach(averageCell => {
      // Get the percentage from either format
      const percent = parseAverage(averageCell);

      // Convert and display based on the current format
      switch (currentGradeFormat) {
          case 'percent':
              averageCell.textContent = `${percent}%`;
              break;
          case 'letter':
              averageCell.textContent = convertToLetterGrade(percent);
              break;
          case 'scale':
              averageCell.textContent = convertToScaleGrade(percent).toFixed(1);
              break;
      }
  });
}

// Add the logic to parse the average from letter grade to percent
function convertFromLetterGrade(letter) {
  // This is a reverse mapping from the `convertToLetterGrade` function
  switch (letter) {
      case 'A': return 95; // Midpoint of 93-100 range
      case 'A-': return 91; // Midpoint of 90-92 range
      // ... Add cases for each letter grade
      case 'D-': return 61; // Midpoint of 60-62 range
      case 'F': return 59; // Anything less than 60
      default: return null; // Return null if conversion is not possible
  }
}

function toggleGradeFormat() {
  currentGradeFormat = currentGradeFormat === 'percent' ? 'letter' : currentGradeFormat === 'letter' ? 'scale' : 'percent';
  const averageHeader = document.querySelector('#gradesTable th:last-child');
  averageHeader.innerText = currentGradeFormat === 'percent' ? 'Average (%)' :
                            currentGradeFormat === 'letter' ? 'Average [Letter]' :
                            'Average [4.0]';
  updateGradesToCurrentFormat();
}

  document.querySelector('#gradesTable th:last-child').addEventListener('click', toggleGradeFormat);

  document.getElementById('addRow').addEventListener('click', function() {
      addStudent();
      updateUnsubmittedCount();
  });

  addAssignmentBtn.addEventListener('click', addAssignment);

  for (let i = 0; i < 10; i++) {
      addStudent();
  }

  updateUnsubmittedCount();
});


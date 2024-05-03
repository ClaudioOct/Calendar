const dateInput = document.querySelector('.search-dates-container');
const calendarWrapper = document.querySelector('.date-picker-wrapper');
const nextMonthBtn = document.querySelector('.next-button');
const prevMonthBtn = document.querySelector('.previous-button');
let firstDate = null;
let secondDate = null;
let currentIndex = 0;
let originalTds = [];
// Function to initialize the originalTds array
function initializeOriginalTds() {
    // Get all calendar-day elements
    const allCalendarDays = Array.from(document.querySelectorAll('.calendar-day'));
    // Store the original state of each calendar-day element
    originalTds = allCalendarDays.map(td => ({
        element: td,
        classes: td.className,
   }));
}
let calendarCreated = false; // Flag to track whether the calendar has been created
function openCloseCalendarWrapper(event) {
    const clickedElement = event.target;
        // Check if the clicked element is dateinput or its children
    const isClickedDateInput = (clickedElement === dateInput || dateInput.contains(clickedElement));
    // Check if the clicked element is not a child of the calendarWrapper
    const isClickedOutsideCalendar = !calendarWrapper.contains(clickedElement);
    // If the clicked element is dateInput or its children
    if (isClickedDateInput) {
        console.log('Toggling calendar wrapper');
        calendarWrapper.classList.toggle('hide');
        // If the calendar was not previously created, create it
        if (!calendarCreated) {
            createCalendar();
            calendarCreated = true; // Set the flag to true after creating the calendar
      // Add event listener for mouseleave when the calendar is created
         const calendarContainer = calendarWrapper.querySelector('.table-calendar');
         if (calendarContainer) {
             calendarContainer.addEventListener('mouseleave', () => handleCalendarMouseLeave(calendarContainer));
         } else {
             console.error("Calendar container not found.");
         }
     }
 } else if (isClickedOutsideCalendar) {
     calendarWrapper.classList.add('hide');
 }

 if (clickedElement.classList.contains('dates-done') || clickedElement.classList.contains('done-btn-txt') || clickedElement.classList.contains('close-span') || clickedElement.classList.contains('close-calendar-icon')) {
    console.log('Done button or span clicked');
    calendarWrapper.classList.add('hide');
}
}
const htmlCalendarHeader = `<div id="sticky-id" class="sticky-div">
    <button aria-label="Next month" type="button" class="close-button">
        <span class="close-span">
            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" class="close-calendar-icon">
                <line x1="1" y1="1" x2="9" y2="9" stroke="black" stroke-width="1" />
                <line x1="9" y1="1" x2="1" y2="9" stroke="black" stroke-width="1" />
            </svg>
        </span>
    </button>
    <h3 aria-live="polite" class="dates-select-mobile">Select your dates</h3> 
    <ul class="day-name-list-mobile">
        <li class="day-name-cotainer-mobile"><span class="day-name-mobile">Mon</span></li>
        <li class="day-name-cotainer-mobile"><span class="day-name-mobile">Tue</span></li>
        <li class="day-name-cotainer-mobile"><span class="day-name-mobile">Wed</span></li>
        <li class="day-name-cotainer-mobile"><span class="day-name-mobile">Thu</span></li>
        <li class="day-name-cotainer-mobile"><span class="day-name-mobile">Fri</span></li>
        <li class="day-name-cotainer-mobile"><span class="day-name-mobile">Sat</span></li>
        <li class="day-name-cotainer-mobile"><span class="day-name-mobile">Sun</span></li>
    </ul>
</div> 

<button aria-label="Previous month"  type="button" class="previous-button hide">
    <span class="move-month previous"><svg class="arrow" viewBox="0 0 24 24">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
    </svg></span>
</button>
<button aria-label="Next month"  type="button" class="next-button">
    <span class="move-month next">
        <svg class="arrow next-arrow" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
        </svg>
    </span>
</button>
<div class="calendar-container"></div>`;

function getMonthName(month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[(month - 1) % 12];
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function createCalendar() {
    return new Promise((resolve, reject) => {
        calendarWrapper.innerHTML = ''; // Clear Calendar Wrapper
        const now = new Date(); // Get the current date and time
        const myTimeZone = -2; // Set your desired time zone offset, e.g., UTC+2
        const localTimezoneOffset = now.getTimezoneOffset(); // Get the local timezone offset in minutes
        console.log(now.getTimezoneOffset());
        const desiredTimezoneOffset = -(localTimezoneOffset / 60) + myTimeZone; // Adjust to the desired timezone offset
        console.log(desiredTimezoneOffset);
        const desiredTimezoneOffsetMilliseconds = desiredTimezoneOffset * 60 * 60 * 1000; // Convert hours to milliseconds
        console.log(desiredTimezoneOffsetMilliseconds);
        console.log(desiredTimezoneOffset);
        const offsetNow = new Date(now.getTime() + desiredTimezoneOffsetMilliseconds); // Apply the desired timezone offset
        console.log('My time is', offsetNow.getHours());
        let today;
        if (offsetNow.getHours() < 18) {
            today = new Date(offsetNow.getFullYear(), offsetNow.getMonth(), offsetNow.getDate());
        } else {
            today = new Date(offsetNow.getFullYear(), offsetNow.getMonth(), offsetNow.getDate() + 1);
        }
        const tomorrow = new Date(today); // Get tomorrow's date
        tomorrow.setDate(tomorrow.getDate() + 1); // Increment to tomorrow

        let currentYear = today.getFullYear(); // Initialize currentYear here
        let currentMonth = today.getMonth(); // Initialize currentMonth here

        calendarWrapper.innerHTML += htmlCalendarHeader;
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        for (let i = 0; i < 12; i++) { // Show 12 months
            currentMonth = currentMonth + 1; // Increment currentMonth by 1
            if (currentMonth > 12) { // If currentMonth exceeds 12,
                currentMonth = 1; // reset to 1 
                currentYear++; // and increment currentYear
            }

            let insidemonthContainer = '<div class="months-container">';
            insidemonthContainer += '<h3 aria-live="polite" class="month-name-year">' + getMonthName(currentMonth) + ' ' + currentYear + '</h3>';
            insidemonthContainer += ' <table class="table-calendar" role="grid">';
            insidemonthContainer += '<caption class="month-name-caption">' + getMonthName(currentMonth) + ' ' + currentYear + ' </caption> ';
            insidemonthContainer += ` 
                <thead aria-hidden="true" class="day-name-list">
                    <tr>
                        <th scope="col" class="day-name-cotainer"><div class="day-name">Mon</div></th>
                        <th scope="col" class="day-name-cotainer"><div class="day-name">Tue</div></th>
                        <th scope="col" class="day-name-cotainer"><div class="day-name">Wed</div></th>
                        <th scope="col" class="day-name-cotainer"><div class="day-name">Thu</div></th>
                        <th scope="col" class="day-name-cotainer"><div class="day-name">Fri</div></th>
                        <th scope="col" class="day-name-cotainer"><div class="day-name">Sat</div></th>
                        <th scope="col" class="day-name-cotainer"><div class="day-name">Sun</div></th>
                    </tr>
                </thead>`;

            let firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay(); // Get the day of the week for the 1st day of the month
            // Adjust firstDayOfMonth to start from 0 (Sunday) to 6 (Saturday)
            firstDayOfMonth = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Convert Sunday (0) to 6

            let day = 1 - firstDayOfMonth; // Adjust the day counter to start from the correct day of the week
            for (let j = 0; j < 6; j++) { // Outer loop iterating over 6 rows (weeks) in the calendar
                insidemonthContainer += '<tr>'; // Add a row
                for (let k = 0; k < 7; k++) { // Inner loop iterating over 7 columns (days) in each row
                    let classes = ''; // Initialize CSS classes for each day
                    if (day > 0 && day <= getDaysInMonth(currentYear, currentMonth)) { // Check if the day is within the current month
                        const datesList = new Date(currentYear, currentMonth - 1, day);
                          if (datesList < today) {
                            classes = ' past-day';
                         } else if (datesList.getTime() === today.getTime()) {
                            classes += ' current-day'; // Apply 'current-day' class for today's date
                        }
                         if (datesList >= firstDate && datesList <= secondDate) {
                            classes += ' days-between';
                        } else if (datesList.getTime() === firstDate?.getTime() || datesList.getTime() === secondDate?.getTime()) {
                            classes += ' selected-day';
                        }
                        if (k === 5 || k === 6) {
                            classes += ' weekend';
                        }

                    insidemonthContainer += '<td role="gridcell" onclick="selectDate(' + currentYear + ', ' + currentMonth + ', ' + day + ')" onmouseover="handleHover(' + currentYear + ', ' + currentMonth + ', ' + day + ')" class="calendar-day' + classes + '"><span tabindex="-1" class="span-day" data-date="' + currentYear + '-' + currentMonth + '-' + day + '" aria-checked="false" role="checkbox" aria-label="' + day + '"><span>' + day + '</span></span></td>';

                    } else {
                    
                  insidemonthContainer += '<td role="gridcell" class="no-day"></td>'; // Add empty cell
                    }
                day++;
                }
                insidemonthContainer += '</tr>'; // Close the row
            }

            insidemonthContainer += '  </table></div>';
            const calendarContainer = calendarWrapper.querySelector('.calendar-container');
            calendarContainer.innerHTML += insidemonthContainer; // Use '+=' to append to the existing content
           
        }
        calendarWrapper.innerHTML += `
        <div class="calendar-footer">
  <div class="sum-up"><span>check-in date - check-out date </span> </div>
  <div class="dates-done-div"> 
    <button aria-label="dates-done-lbl"  type="button" class="dates-done">
    <span class="done-btn-txt">Done!</span>
    </button> 
  </div>
  </div>               
        `;
        setupCalendarNavigation();
        initializeOriginalTds();
        // Resolve the promise once the calendar is created
        resolve();
     
    });
}


function setupCalendarNavigation() {
    const nextButton = document.querySelector('.next-button');
    const previousButton = document.querySelector('.previous-button');
    const monthContainers = document.querySelectorAll('.months-container');
    const totalMonths = monthContainers.length;
    let currentIndex = 0;
    nextButton.addEventListener('click', function() {
        if (currentIndex < totalMonths - 2) {
            currentIndex++;
            console.log('1 index', currentIndex);
            const offset = -currentIndex * 290; // 
            monthContainers.forEach(container => {
                container.style.transform = `translateX(${offset}px)`;
            });
            previousButton.disabled = false; // Enable previous button
            previousButton.classList.remove('hide');
            console.log('2 index', currentIndex);
        }
                console.log(totalMonths);
        console.log(currentIndex);
        if (currentIndex === totalMonths - 2) {
            nextButton.disabled = true; // Disable next button if at last month
            nextButton.classList.add('hide');
            console.log('3 index', currentIndex);
               }
    });

    previousButton.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            const offset = -currentIndex * 290; // Assuming each month container width is 100%
            monthContainers.forEach(container => {
                container.style.transform = `translateX(${offset}px)`;
            });
            nextButton.disabled = false; // Enable next button
            nextButton.classList.remove('hide');
            console.log('4 index', currentIndex);
        }
        if (currentIndex === 0) {
            previousButton.disabled = true; // Disable previous button if at first month
            previousButton.classList.add('hide');
            console.log('5 index', currentIndex);
        }
    });
}

// Function to select a date
function selectDate(year, month, day) {
    // Create a new Date object representing the clicked date
    const clickedDate = new Date(year, month - 1, day);
    // Log the clicked date to the console
  /*   console.log('This is my clicked date:', clickedDate); */

    /*  THIS IS HOW THE DATE SELECTION MUST WORK */
    // Switch statement to handle different scenarios based on current selected dates
    switch (true) {
        // Case 1: No first date selected or clicked date is earlier than current first date
        case !firstDate || clickedDate < firstDate:
            // Update firstDate, reset secondDate, log new firstDate, and update recap
            firstDate = clickedDate;
            secondDate = null;
            console.log('1:', firstDate);
            updateRecap();
            break;
        // Case 2: First date and second date selected and clicked date matches first date
        case firstDate && secondDate && firstDate.getTime() === secondDate.getTime():
            // Update firstDate, reset secondDate, log new firstDate, and update recap
            firstDate = clickedDate;
            secondDate = null;
            console.log('2:', firstDate);
            updateRecap();
            break;
        // Case 3: First date selected but no second date, and clicked date is after first date
        case firstDate && !secondDate && clickedDate > firstDate:
        // Update secondDate, log new secondDate, update recap, and remove hover class
            secondDate = clickedDate;
            console.log('3:', secondDate);
            updateRecap();
            hoveredTdElements.forEach(td => {
            td.classList.remove('calendar-day-hover');
            calendarWrapper.classList.add('hide');
            });
            break;
        // Case 4: Both first and second dates selected
        case firstDate && secondDate:
            // Check if clicked date is outside the range of firstDate and secondDate
            if (clickedDate < firstDate || clickedDate > secondDate) {
                // Reset selection, log new firstDate, and update recap
                console.log('4');
                originalTds.forEach(originalTd => {
                originalTd.element.className = originalTd.classes;
                });
                firstDate = clickedDate;
                secondDate = null;
                console.log('5:', firstDate);
                updateRecap();
            } else {
                // Update firstDate, reset secondDate, log new firstDate, and update recap
                firstDate = clickedDate;
                console.log('6:', firstDate);
                secondDate = null;
                updateRecap();
            }
            break;
        // Case 5: First date selected but no second date, and clicked date is earlier than first date
        case firstDate && (!secondDate || clickedDate < firstDate):
            // Update firstDate, log new firstDate, and update recap
            firstDate = clickedDate;
            console.log('7:', firstDate);
            updateRecap();
            break;
        // Default case: Select first date and reset second date, log new firstDate, and update recap
        default:
            firstDate = clickedDate;
            secondDate = null;
            console.log('8:', firstDate);
            updateRecap();
    }

    // Apply styles to first, second, and dates between on click
    originalTds.forEach(originalTd => {
        const spanDay = originalTd.element.querySelector('.span-day');
        if (spanDay) {
            const dateAttribute = new Date(spanDay.getAttribute('data-date'));
            originalTd.element.classList.remove('selected-day-first', 'selected-day-second', 'selected-day-between', 'calendar-day');
            if (dateAttribute.getTime() === firstDate.getTime()) {
                originalTd.element.classList.add('selected-day-first');
            } else if (secondDate && dateAttribute.getTime() === secondDate.getTime()) {
                originalTd.element.classList.add('selected-day-second');
            } else if (firstDate && secondDate && dateAttribute > firstDate && dateAttribute < secondDate) {
                originalTd.element.classList.add('selected-day-between');
            } else {
                originalTd.element.classList.add('calendar-day');
            }
        }
    });
}

// Function to handle mouse hover over a date
let hoveredTdElements = [];

function handleHover(year, month, day) {
    const hoveredDate = new Date(year, month - 1, day);
    
    // Logging for debugging
    console.log('Hovered date:', hoveredDate);
    
    // Remove calendar-day-hover class from all previously hovered <td> elements
    hoveredTdElements.forEach(td => {
        td.classList.remove('calendar-day-hover');
    });
    
    // Clear the array
    hoveredTdElements = [];

    // If a first date is set and second date is not set
    if (firstDate && !secondDate && hoveredDate.getTime() > firstDate.getTime() + 24 * 60 * 60 * 1000) {
        // Add the <td> elements between the first clicked date and the hovered date if the difference is more than 1 day
        let currentDate = new Date(firstDate);
        while (currentDate < hoveredDate) {
            const dateStr = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
            console.log('Checking for dateStr:', dateStr);
            const span = document.querySelector('.span-day[data-date="' + dateStr + '"]');
            if (span) {
                const td = span.closest('td');
                if (td) {
                    hoveredTdElements.push(td);
                    td.classList.add('calendar-day-hover'); // Apply style to hovered <td> elements
                } else {
                    console.log('Could not find parent td for span with date:', dateStr);
                }
            } else {
                console.log('Could not find span with date:', dateStr);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
}
// Attach event listener for mouseenter event to each <td> element

// Select all <td> elements inside an element with class "table-calendar"
document.querySelectorAll('.table-calendar td').forEach(td => {
     // Add event listener for mouseenter to each <td> element
    td.addEventListener('mouseenter', function() {
          // Find the child element with class "span-day" within the current <td>
        const dateStr = this.querySelector('.span-day').getAttribute('data-date');
         // Split the date string into year, month, and day components
        const [year, month, day] = dateStr.split('-').map(Number);
        // Call the handleHover function with year, month, and day as arguments
        handleHover(year, month, day);
    });
});

function handleCalendarMouseLeave(calendarContainer) {
    // Get the element on which the mouse leaves
    const targetElement = event.relatedTarget;
    // Log the target element
    console.log('Target Element:', targetElement);

    // Check if the mouse leaves the calendar container or its children
    if (targetElement && !calendarContainer.contains(targetElement)) {
        // Remove calendar-day-hover class from all previously hovered <td> elements
        hoveredTdElements.forEach(td => {
            td.classList.remove('calendar-day-hover');
        });
        // Clear the array
        hoveredTdElements = [];
    }
}

function updateRecap() {
    const sumUpDiv = document.querySelector('.sum-up');
    const sumUpSpan = sumUpDiv.querySelector('span');

    // Select the check-in button and its span
const checkInButton = document.getElementById('check-in-button');
const checkInSpan = checkInButton.querySelector('.check-in-span');

// Select the check-out button and its span
const checkOutButton = document.getElementById('check-out-button');
const checkOutSpan = checkOutButton.querySelector('.check-out-span');


    if (!firstDate && !secondDate) {
        sumUpSpan.textContent = `Check-in date - Check-out date`;
        checkInSpan.textContent = `Check-in date`;
        checkOutSpan.textContent = `Check-out date`;

    } else {
        const checkInDate = firstDate ? formatDate(firstDate, 'en-UK') : 'Check-in date';
        const checkOutDate = secondDate ? formatDate(secondDate, 'en-UK') : 'Check-out date';
        const nights = firstDate && secondDate ? Math.round((secondDate - firstDate) / (1000 * 60 * 60 * 24)) : 0;

      
        checkInSpan.textContent = `${checkInDate}`;
        checkOutSpan.textContent = `${checkOutDate}`;

        if (nights > 1) {

            sumUpSpan.textContent = `${checkInDate} - ${checkOutDate}${nights ? ' (' + nights + ' nights)' : ''}`;
        } else {
            sumUpSpan.textContent = `${checkInDate} - ${checkOutDate}${nights ? ' (' + nights + ' night)' : ''}`;

        }
    }
}

function formatDate(dateString, language) {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString(language, options);
}


document.querySelector('.search-button').addEventListener('click', function() {
    const calendarDiv = document.querySelector('.calendar');
    // Create the modal content div
    const modalContent = document.createElement('div');
       // Create the alert message paragraph element
    const alertMessage = document.createElement('p');
    alertMessage.id = 'alert-message';
            if (firstDate && secondDate) {
         // Store firstDate and secondDate into localStorage
         localStorage.setItem('firstDate', firstDate);
         localStorage.setItem('secondDate', secondDate);
// Retrieve first and second dates from local storage, if available
const storedFirstDate = localStorage.getItem('firstDate');
const storedSecondDate = localStorage.getItem('secondDate');
alertMessage.innerHTML = `Congrats! You have submitted <strong>${formatDate(storedFirstDate, 'en-UK')}</strong> and <strong>${formatDate(storedSecondDate, 'en-UK')}</strong>! Both dates will be removed from local storage in 5 secs!`;

// Remove the alert message container after 5 seconds
setTimeout(function() {
    modalContent.style.display = 'none';
}, 5000);
modalContent.classList.remove('modal-content-error');
modalContent.classList.add('modal-content'); // Separate classes as arguments
document.querySelector('.check-in-span').textContent = 'Check-in date';
document.querySelector('.check-out-span').textContent = 'Check-out date';
createCalendar();
firstDate = null;
secondDate = null;

// Reset firstDate and secondDate before checking
// Check if the variables exist in localStorage
if(localStorage.getItem('firstDate') !== null) {
    // Set a timeout to remove 'firstDate' after 5 seconds
    setTimeout(function() {
        localStorage.removeItem('firstDate');
    }, 5000); // 5000 milliseconds = 5 seconds
}

if(localStorage.getItem('secondDate') !== null) {
    // Set a timeout to remove 'secondDate' after 5 seconds
    setTimeout(function() {
        localStorage.removeItem('secondDate');
    }, 5000); // 5000 milliseconds = 5 seconds
}
    } else if (firstDate && !secondDate) {
        alertMessage.textContent = "You need to select also the check-out date.";
        modalContent.classList.remove('modal-content')
        modalContent.classList.add('modal-content-error'); // Separate classes as arguments
            } else if (!firstDate && !secondDate) {
        alertMessage.textContent = "Both check-in and check-out dates need to be selected";
        modalContent.classList.remove('modal-content')
        modalContent.classList.add('modal-content-error'); // Separate classes as arguments
    }

    // Append the alert message to the modal content div
    modalContent.appendChild(alertMessage);

    // Remove any existing modal content
    const existingModalContent = document.querySelector('.modal-content');
    if (existingModalContent) {
        existingModalContent.parentNode.removeChild(existingModalContent);
    }
    // Append the modal content to the calendar div
    calendarDiv.appendChild(modalContent);
    calendarWrapper.classList.add('hide');
      
});
document.querySelector('.search-dates-container').addEventListener('click', function(event) {
    const modalContent = document.querySelector('.modal-content');
    const modalContentError = document.querySelector('.modal-content-error');
    const searchDatesContainer = document.querySelector('.search-dates-container');
   
    // Check if the clicked element is a child of the search-dates-container
    if (searchDatesContainer.contains(event.target)) {
        if (modalContent) {
            modalContent.parentNode.removeChild(modalContent);
        }
        if (modalContentError) {
            modalContentError.parentNode.removeChild(modalContentError);
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    console.log("Document loaded");
    // Attach event listener to toggle calendar wrapper
    document.addEventListener('click', openCloseCalendarWrapper);
});




// CIT2011 IA#2 - Display the ticket with basic DOM methods.
// Saved data to be transferred between HTML pages.
let savedData = sessionStorage.getItem("codingConfAttendee");
let attendee = null;

// Stored data might be missing or invalid, so use try/catch.
try {
  if (savedData !== null) {
    attendee = JSON.parse(savedData);
  }
} catch (error) {
  attendee = null;
}

// Do not allow people to open the ticket page before registering.
// Check the fields again because browser storage can be edited manually.
const githubPattern = /^@[A-Za-z0-9][A-Za-z0-9-]{0,38}$/;
const imagePattern = /^data:image\/(png|jpeg);base64,/;
if (attendee === null || typeof attendee.name !== "string" ||
    attendee.name.trim() === "" || typeof attendee.github !== "string" ||
    githubPattern.test(attendee.github) === false ||
    attendee.github.charAt(attendee.github.length - 1) === "-" ||
    typeof attendee.avatar !== "string" ||
    imagePattern.test(attendee.avatar) === false) {
  window.location.replace("index.html");
} else {
  // To change HTML using the DOM and textContent.
  document.getElementById("heading-name").textContent = attendee.name;
  document.getElementById("ticket-name").textContent = attendee.name;
  document.getElementById("ticket-github").textContent = attendee.github;
  document.getElementById("ticket-github").href =
    "https://github.com/" + attendee.github.substring(1);
  document.getElementById("ticket-avatar").src = attendee.avatar;
  document.getElementById("ticket-avatar").alt = "Avatar of " + attendee.name;
  document.getElementById("ticket-number").textContent = attendee.ticketNumber || "#00000";

  // The click event listener for the optional print button.
  document.getElementById("print-button").addEventListener("click", function () {
    window.print();
  });
}

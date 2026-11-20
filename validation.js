const form = document.getElementById("registration-form");

// This function places a message next to the matching form field.
function showError(field, message) {
  document.getElementById(field + "-error").textContent = message;
  document.getElementById(field).setAttribute("aria-invalid", "true");
}

// Clear messages from the last attempt using an array and a for loop.
function clearErrors() {
  const fields = ["full-name", "email", "github", "avatar"];
  for (let i = 0; i < fields.length; i++) {
    document.getElementById(fields[i] + "-error").textContent = "";
    document.getElementById(fields[i]).removeAttribute("aria-invalid");
  }
  document.getElementById("form-error").textContent = "";
}

// The submit event runs this function.
form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  // Read the form values using the DOM.
  const fullName = document.getElementById("full-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const github = document.getElementById("github").value.trim();
  const avatar = document.getElementById("avatar").files[0];
  let valid = true;
  let firstProblem = "";

  if (fullName === "") {
    showError("full-name", "Please enter your full name.");
    valid = false;
    firstProblem = "full-name";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  if (emailPattern.test(email) === false) {
    showError("email", "Enter a valid email, such as jordan@example.com.");
    valid = false;
    if (firstProblem === "") { firstProblem = "email"; }
  }

  // A GitHub handle must start with @ and contain valid characters.
  const githubPattern = /^@[A-Za-z0-9][A-Za-z0-9-]{0,38}$/;
  if (githubPattern.test(github) === false || github.charAt(github.length - 1) === "-") {
    showError("github", "Start with @ and use letters, numbers or hyphens.");
    valid = false;
    if (firstProblem === "") { firstProblem = "github"; }
  }

  if (!avatar) {
    showError("avatar", "Please upload a profile picture.");
    valid = false;
    if (firstProblem === "") { firstProblem = "avatar"; }
  } else if (avatar.type !== "image/jpeg" && avatar.type !== "image/png") {
    showError("avatar", "Only JPG and PNG images are allowed.");
    valid = false;
    if (firstProblem === "") { firstProblem = "avatar"; }
  } else if (avatar.size >= 500 * 1024) {
    showError("avatar", "Image must be smaller than 500 KB.");
    valid = false;
    if (firstProblem === "") { firstProblem = "avatar"; }
  }

  if (valid === false) {
    document.getElementById(firstProblem).focus();
    return;
  }

  // FileReader reads the avatar, and sessionStorage passes values to ticket.html.
  const reader = new FileReader();
  reader.onload = function () {
    // Object with attendee properties.
    const attendee = {
      name: fullName,
      email: email,
      github: github,
      avatar: reader.result,
      ticketNumber: "#" + (Math.floor(Math.random() * 90000) + 10000)
    };

    try {
      sessionStorage.setItem("codingConfAttendee", JSON.stringify(attendee));
      window.location.href = "ticket.html";
    } catch (error) {
      document.getElementById("form-error").textContent =
        "Could not save the ticket in this browser. Please try a smaller image.";
    }
  };
  reader.onerror = function () {
    document.getElementById("form-error").textContent =
      "The image could not be read. Please choose a different picture.";
  };
  reader.readAsDataURL(avatar);
});

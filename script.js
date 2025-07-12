let shareCount = 0;
const maxShares = 5;

const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const shareBtn = document.getElementById("shareBtn");
const shareCountDisplay = document.getElementById("shareCount");
const shareStatus = document.getElementById("shareStatus");
const messageDiv = document.getElementById("message");

const phoneInput = document.getElementById("phone");

// Prevent non-digit input in phone field
phoneInput.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

// Check if already submitted
window.onload = function () {
  if (localStorage.getItem("submitted") === "true") {
    form.style.display = "none";
    messageDiv.innerHTML = "🎉 You have already submitted. Thanks for joining Tech For Girls!";
  }
};

// WhatsApp Share Button Logic
shareBtn.addEventListener("click", function () {
  if (shareCount < maxShares) {
    shareCount++;
    const message = "Hey Buddy, Join Tech For Girls Community!";
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    shareCountDisplay.textContent = `Click count: ${shareCount}/${maxShares}`;
    if (shareCount === maxShares) {
      shareStatus.textContent = "✅ Sharing complete. Please continue.";
    }
  }
});

// Submit Form
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (shareCount < maxShares) {
    alert("Please share on WhatsApp 5 times before submitting.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const college = document.getElementById("college").value.trim();
  const screenshot = document.getElementById("screenshot").files[0];

  if (!name || !phone || !email || !college || !screenshot) {
    alert("Please fill out all fields and upload a screenshot.");
    return;
  }

  if (phone.length !== 10) {
    alert("Phone number must be exactly 10 digits.");
    return;
  }

  // Upload file to some storage (This is a placeholder. You can use Firebase, Imgur, or skip and send base64.)
  const fileUrl = "https://example.com/fake-uploaded-image.jpg"; // Replace with real uploaded file URL logic

  // Prepare data for Google Sheets
  const data = {
    name,
    phone,
    email,
    college,
    fileUrl,
  };

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbzPcQZHprfX1O31dnhjpUpFFXbKec5f57xinuvMICNJl0Mk7yAfAfytsFCy5RaO03Y_WQ/exec", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result.result === "success") {
      localStorage.setItem("submitted", "true");
      form.reset();
      form.style.display = "none";
      messageDiv.innerHTML = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
    } else {
      alert("Something went wrong. Try again.");
    }
  } catch (err) {
    alert("Error submitting the form. Check console.");
    console.error(err);
  }
});

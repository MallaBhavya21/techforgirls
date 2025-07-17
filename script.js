let shareCount = parseInt(localStorage.getItem("shareCount")) || 0;
const maxShares = 5;

const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const shareBtn = document.getElementById("shareBtn");
const shareCountDisplay = document.getElementById("shareCount");
const shareStatus = document.getElementById("shareStatus");
const messageDiv = document.getElementById("message");
const phoneInput = document.getElementById("phone");

// ✅ Update UI on page load
window.onload = function () {
  // Prevent re-submission
  if (localStorage.getItem("submitted") === "true") {
    form.style.display = "none";
    messageDiv.innerHTML = "🎉 You have already submitted. Thanks for joining Tech For Girls!";
  }

  // Restore share count and UI
  shareCountDisplay.textContent = `Click count: ${shareCount}/${maxShares}`;
  if (shareCount >= maxShares) {
    shareStatus.textContent = "✅ Sharing complete. Please continue.";
    submitBtn.disabled = false;
  }
};

// 🚫 Prevent non-digit input in phone number field
phoneInput.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

// ▶️ WhatsApp Share Button Logic
shareBtn.addEventListener("click", function () {
  if (shareCount < maxShares) {
    shareCount++;
    localStorage.setItem("shareCount", shareCount);

    const message = "Hey Buddy, Join Tech For Girls Community!";
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    shareCountDisplay.textContent = `Click count: ${shareCount}/${maxShares}`;

    if (shareCount === maxShares) {
      shareStatus.textContent = "✅ Sharing complete. Please continue.";
      submitBtn.disabled = false;
    }
  }
});

// 📨 Submit Form Handler
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (shareCount < maxShares) {
    alert("Please share on WhatsApp 5 times before submitting.");
    return;
  }

  // Collect form data
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const college = document.getElementById("college").value.trim();
  const screenshot = document.getElementById("screenshot").files[0];

  // Validate fields
  if (!name || !phone || !email || !college || !screenshot) {
    alert("Please fill out all fields and upload a screenshot.");
    return;
  }

  if (phone.length !== 10) {
    alert("Phone number must be exactly 10 digits.");
    return;
  }

  // You can upload the file to a real image/file hosting service and get the URL
  // For now, we'll use a placeholder
  const fileUrl = "https://example.com/fake-uploaded-image.jpg";

  const data = {
    "Full Name": name,
    "Phone No": phone,
    "Email ID": email,
    "College/Department": college,
    "File upload": fileUrl,
  };

  try {
    const response = await fetch("https://sheetdb.io/api/v1/iggsubso18355", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [data] }),
    });

    const result = await response.json();

    if (result.created) {
      localStorage.setItem("submitted", "true");
      localStorage.removeItem("shareCount");
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

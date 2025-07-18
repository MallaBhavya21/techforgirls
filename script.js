let shareCount = parseInt(localStorage.getItem("shareCount")) || 0;
const maxShares = 5;

const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const shareBtn = document.getElementById("shareBtn");
const shareCountDisplay = document.getElementById("shareCount");
const shareStatus = document.getElementById("shareStatus");
const messageDiv = document.getElementById("message");
const phoneInput = document.getElementById("phone");

// Load saved share count on page load
window.onload = function () {
  shareCountDisplay.textContent = `Click count: ${shareCount}/${maxShares}`;
  if (shareCount >= maxShares) {
    shareStatus.textContent = "✅ Sharing complete. Please continue.";
    submitBtn.disabled = false;
  }
};

// Restrict phone input to digits
phoneInput.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

// Share button logic
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

// Submit form
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
  const fileInput = document.getElementById("screenshot");
  const screenshotFile = fileInput.files[0];

  if (!name || !phone || !email || !college || !screenshotFile) {
    alert("Please fill out all fields and upload a screenshot.");
    return;
  }

  if (phone.length !== 10) {
    alert("Phone number must be exactly 10 digits.");
    return;
  }

  // ✅ Just get the file name (not full file)
  const screenshotFileName = screenshotFile.name;
  console.log("DEBUG file name:", screenshotFileName);

  const data = {
    "Full Name": name,
    "Phone No": phone,
    "Email ID": email,
    "College": college,
    "File name": screenshotFileName,
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
    console.log("DEBUG sheetdb result:", result);

    if (result.created) {
      // ✅ Reset for next submission
      localStorage.removeItem("shareCount");
      shareCount = 0;
      submitBtn.disabled = true;
      form.reset();
      shareCountDisplay.textContent = `Click count: 0/${maxShares}`;
      shareStatus.textContent = "";
      messageDiv.innerHTML = "🎉 Your submission has been recorded. You can register again!";
    } else {
      alert("Something went wrong. Try again.");
    }
  } catch (err) {
    alert("Error submitting the form. Check console.");
    console.error("Submission error:", err);
  }
});

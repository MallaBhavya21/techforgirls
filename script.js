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
  shareCountDisplay.textContent = `Click count: ${shareCount}/${maxShares}`;
  if (shareCount >= maxShares) {
    shareStatus.textContent = "✅ Sharing complete. Please continue.";
    submitBtn.disabled = false;
  }
};

// 🚫 Restrict phone input to digits only
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

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const college = document.getElementById("college").value.trim();
  const fileUrlInput = document.getElementById("screenshot").value.trim();

  if (!name || !phone || !email || !college || !fileUrlInput) {
    alert("Please fill out all fields.");
    return;
  }

  if (phone.length !== 10) {
    alert("Phone number must be exactly 10 digits.");
    return;
  }

  // ✅ Extract only file name from Google Drive link
  let fileName = fileUrlInput.split('/').pop().split('?')[0];
  if (!fileName.includes('.')) {
    fileName = 'drive_file_link';
  }

  const data = {
    "Full Name": name,
    "Phone No": phone,
    "Email ID": email,
    "College/Department": college,
    "File URL": fileName,
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
      shareCount = 0;
      localStorage.removeItem("shareCount");
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
    console.error(err);
  }
});

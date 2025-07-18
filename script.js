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
  const file = fileInput.files[0];

  if (!name || !phone || !email || !college || !file) {
    alert("Please fill out all fields and upload a screenshot.");
    return;
  }

  if (phone.length !== 10) {
    alert("Phone number must be exactly 10 digits.");
    return;
  }

  const fileName = file.name;
  console.log("DEBUG: extracted file name:", fileName);

  const data = {
    "Full Name": name,
    "Phone No": phone,
    "Email ID": email,
    "College/Department": college,
    "File URL": fileName,  // column in your sheet
  };

  try {
    const response = await fetch("https://sheetdb.io/api/v1/iggsubso18355", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [data] }),
    });

    const result = await response.json();
    console.log("DEBUG: sheetdb result:", result);

    if (result.created) {
      // successful submission block
      shareCount = 0;
      localStorage.removeItem("shareCount");
      submitBtn.disabled = true;
      form.reset();
      shareCountDisplay.textContent = `Click count: 0/${maxShares}`;
      shareStatus.textContent = "";

      // ✅ Show Z thank you message
      messageDiv.textContent = "🎉 Your submission has been recorded. You can register again!";
      messageDiv.style.display = "block";

    } else {
      alert("Something went wrong. Try again.");
    }
  } catch (err) {
    console.error("Submission error:", err);
    alert("Error submitting the form. Check console.");
  }
});

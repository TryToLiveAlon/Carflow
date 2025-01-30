document.getElementById("fetchDetails").addEventListener("click", async () => {
  const vehicleNumber = document.getElementById("vehicleNumber").value.trim();
  const resultDiv = document.getElementById("result");

  // Clear previous result
  resultDiv.innerHTML = "";

  if (!vehicleNumber) {
    resultDiv.innerHTML = `<p class="error">Please enter a valid vehicle number.</p>`;
    return;
  }

  try {
    // Call the backend API
    const response = await fetch(`/api/vehicle?NumberPlate=${vehicleNumber}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch details.");
    }

    const data = await response.json();

    // Display data in a readable format
    resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    // Display error message
    resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
  }
});

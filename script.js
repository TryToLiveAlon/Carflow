document.getElementById("fetchDetails").addEventListener("click", async () => {
  const numberPlate = document.getElementById("numberPlate").value.trim();
  const resultDiv = document.getElementById("result");

  // Clear previous result
  resultDiv.innerHTML = "";

  if (!numberPlate) {
    resultDiv.innerHTML = `<p class="error">Please enter a valid vehicle number plate.</p>`;
    return;
  }

  try {
    // Call the backend API with 'numberPlate' as a query parameter
    const response = await fetch(`/api/vehicle?numberPlate=${numberPlate}`);

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

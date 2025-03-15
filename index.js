document.addEventListener("DOMContentLoaded", function () {
    const analyzeBtn = document.getElementById("analyzeBtn");
    const urlInput = document.getElementById("urlInput");
    const resultContainer = document.getElementById("result");
    const loader = document.getElementById("loader");
    const crossIcon = document.querySelector(".input-icon");

    // Initially hide cross icon
    crossIcon.style.display = "none";

    analyzeBtn.addEventListener("click", async function () {
        const url = urlInput.value.trim();
        if (!url) {
            showNotification("⚠️ No URL provided!", "gray", "black");
            return;
        }

        loader.classList.remove("hidden");
        resultContainer.classList.add("hidden");

        try {
            const response = await fetch("https://backendapi-1-zbkc.onrender.com/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();
            
            loader.classList.add("hidden");

            if (response.ok) {
                if (data.result == "True") {
                    // Phishing detected
                    showNotification(
                        "🚨 Phishing URL Detected! This website may steal your information. Avoid visiting this site.",
                        "red",
                        "white"
                    );
                } else if (data.result == "False") {
                    // Legitimate URL
                    showNotification(
                        "✅ Legitimate URL. This website appears safe.",
                        "green",
                        "white"
                    );
                }
            } else {
                showNotification(`Error: ${data.error}`, "orange", "black");
            }
        } catch (error) {
            loader.classList.add("hidden");
            showNotification("Error connecting to server", "orange", "black");
            console.error("Error:", error);
        }
    });

    crossIcon.addEventListener("click", () => {
        urlInput.value = "";
        crossIcon.style.display = "none"; // Hide cross icon when cleared
        resultContainer.classList.add("hidden");
    });

    urlInput.addEventListener("input", () => {
        analyzeBtn.disabled = !urlInput.value.trim();
        crossIcon.style.display = urlInput.value.trim() ? "block" : "none"; // Show when text exists
    });

    document.getElementById("currentYear").textContent = new Date().getFullYear();

    function showNotification(message, bgColor, textColor) {
        resultContainer.textContent = message;
        resultContainer.style.backgroundColor = bgColor;
        resultContainer.style.color = textColor;
        resultContainer.style.padding = "10px";
        resultContainer.style.borderRadius = "5px";
        resultContainer.style.fontWeight = "bold";
        resultContainer.style.textAlign = "center";
        resultContainer.style.display = "block";
        resultContainer.classList.remove("hidden");
        setTimeout(() => {
            resultContainer.style.display = "none";
        }, 5000);
    }
});

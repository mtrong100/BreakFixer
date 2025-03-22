// Theme handling
document.addEventListener("DOMContentLoaded", () => {
  const themeButtons = document.querySelectorAll(".theme-switcher .btn");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Function to set theme
  const setTheme = (theme) => {
    // Store the theme preference
    localStorage.setItem("theme", theme);

    // If theme is system, use system preference
    if (theme === "system") {
      const systemTheme = prefersDarkScheme.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", systemTheme);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }

    // Update active state of buttons
    themeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-theme") === theme);
    });
  };

  // Initialize theme
  const savedTheme = localStorage.getItem("theme") || "system";
  setTheme(savedTheme);

  // Theme button click handlers
  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-theme");
      setTheme(theme);
    });
  });

  // Listen for system theme changes
  prefersDarkScheme.addEventListener("change", (e) => {
    if (localStorage.getItem("theme") === "system") {
      document.documentElement.setAttribute(
        "data-theme",
        e.matches ? "dark" : "light"
      );
    }
  });
});

// Line break removal functionality
document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const removeBreaksBtn = document.getElementById("removeBreaks");
  const copyResultBtn = document.getElementById("copyResult");
  const clearTextBtn = document.getElementById("clearText");

  // Remove line breaks function
  const removeLineBreaks = () => {
    if (!inputText.value) {
      showToast("Please enter some text first!", "warning");
      return;
    }

    const text = inputText.value
      .replace(/([^\n])\n([^\n])/g, "$1 $2") // Replace single line breaks with space
      .replace(/\n\n+/g, "\n") // Replace multiple line breaks with single line break
      .replace(/[ \t]+/g, " ") // Replace multiple spaces/tabs with single space
      .trim(); // Remove leading/trailing spaces

    outputText.value = text;
    showToast("Line breaks processed successfully!", "success");
  };

  // Copy result function
  const copyResult = async () => {
    if (!outputText.value) {
      showToast("No text to copy!", "warning");
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText.value);
      showToast("Text copied to clipboard!", "success");
    } catch (err) {
      showToast("Failed to copy text!", "error");
    }
  };

  // Clear text function
  const clearText = () => {
    inputText.value = "";
    outputText.value = "";
    showToast("Text cleared!", "info");
  };

  // Toast notification function
  const showToast = (message, type = "info") => {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className =
        "toast-container position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastEl = document.createElement("div");
    toastEl.className = `toast align-items-center text-white bg-${
      type === "error" ? "danger" : type
    }`;
    toastEl.setAttribute("role", "alert");
    toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

    // Add toast to container
    toastContainer.appendChild(toastEl);

    // Initialize and show toast
    const toast = new bootstrap.Toast(toastEl, {
      animation: true,
      autohide: true,
      delay: 3000,
    });
    toast.show();

    // Remove toast element after it's hidden
    toastEl.addEventListener("hidden.bs.toast", () => {
      toastEl.remove();
    });
  };

  // Event listeners
  removeBreaksBtn.addEventListener("click", removeLineBreaks);
  copyResultBtn.addEventListener("click", copyResult);
  clearTextBtn.addEventListener("click", clearText);

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "Enter") {
        e.preventDefault();
        removeLineBreaks();
      } else if (e.key === "c" && document.activeElement === outputText) {
        e.preventDefault();
        copyResult();
      }
    }
  });
});

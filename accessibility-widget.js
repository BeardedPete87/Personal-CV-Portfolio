class AccessibilityWidget {
    constructor() {
        this.speechRate = 1;
        this.speechPitch = 1;
        this.speechVolume = 1;
        this.createWidget();
        this.loadPreferences();
    }

    createWidget() {
        const widget = document.createElement("div");
        widget.id = "accessibility-widget";
        widget.classList.add("accessibility-widget");

        // Draggable functionality
        let isDragging = false;
        let offsetX, offsetY;

        widget.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - widget.getBoundingClientRect().left;
            offsetY = e.clientY - widget.getBoundingClientRect().top;
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                widget.style.left = `${e.clientX - offsetX}px`;
                widget.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        const toggleButton = document.createElement("button");
        toggleButton.innerHTML = '<ion-icon name="accessibility-outline"></ion-icon>';
        toggleButton.classList.add("accessibility-toggle");
        toggleButton.setAttribute("aria-label", "Toggle accessibility options");
        toggleButton.onclick = () => {
            const isHidden = widgetContent.style.display === "none";
            widgetContent.style.display = isHidden ? "flex" : "none";
            widget.style.borderRadius = isHidden ? "15px" : "50%";
            widget.style.padding = isHidden ? "15px" : "0px";
        };

        const widgetContent = document.createElement("div");
        widgetContent.classList.add("widget-content");
        widgetContent.style.display = "none";

        widgetContent.innerHTML = `
            <button class="accessibility-btn" onclick="accessibility.increaseTextSize()">A+</button>
            <button class="accessibility-btn" onclick="accessibility.decreaseTextSize()">A-</button>
            <button class="accessibility-btn" onclick="accessibility.toggleContrast()">Contrast</button>
            <button class="accessibility-btn" onclick="accessibility.toggleGrayscale()">Grayscale</button>
            <button class="accessibility-btn" onclick="accessibility.toggleDyslexiaFont()">Dyslexia Font</button>
            <button class="accessibility-btn" onclick="accessibility.readText()">Read Text</button>
            <button class="accessibility-btn" onclick="accessibility.readSelectedText()">Read Selected Text</button>
            <button class="accessibility-btn" onclick="accessibility.highlightLinksHeadings()">Highlight Links & Headings</button>
            <select onchange="accessibility.changeTheme(this.value)">
                <option value="default">Default Theme</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sepia">Sepia</option>
            </select>
            <input type="color" onchange="accessibility.changeBackgroundColor(this.value)" aria-label="Choose background color" />
            <button class="accessibility-btn" onclick="accessibility.resetSettings()">Reset</button>
        `;

        const rateSlider = this.createSlider("Rate", 0.1, 2, 1, (value) => (this.speechRate = value));
        const pitchSlider = this.createSlider("Pitch", 0, 2, 1, (value) => (this.speechPitch = value));
        const volumeSlider = this.createSlider("Volume", 0, 1, 1, (value) => (this.speechVolume = value));

        widgetContent.appendChild(rateSlider);
        widgetContent.appendChild(pitchSlider);
        widgetContent.appendChild(volumeSlider);

        widget.appendChild(toggleButton);
        widget.appendChild(widgetContent);
        document.body.appendChild(widget);

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case '+':
                    this.increaseTextSize();
                    break;
                case '-':
                    this.decreaseTextSize();
                    break;
                case 'c':
                    this.toggleContrast();
                    break;
                case 'g':
                    this.toggleGrayscale();
                    break;
                case 'd':
                    this.toggleDyslexiaFont();
                    break;
                case 'r':
                    this.readText();
                    break;
            }
        });
    }

    createSlider(label, min, max, value, onChange) {
        const container = document.createElement("div");
        container.classList.add("slider-container");

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.addEventListener('input', () => onChange(slider.value));

        const labelElement = document.createElement("span");
        labelElement.textContent = label;

        container.appendChild(labelElement);
        container.appendChild(slider);
        return container;
    }

    increaseTextSize() {
        const currentFontSize = parseFloat(window.getComputedStyle(document.body).fontSize);
        const newSize = currentFontSize * 1.1 + "px"; // Increase by 10%
        document.body.style.fontSize = newSize;
        this.savePreferences();
    }

    decreaseTextSize() {
        const currentFontSize = parseFloat(window.getComputedStyle(document.body).fontSize);
        const newSize = currentFontSize * 0.9 + "px"; // Decrease by 10%
        document.body.style.fontSize = newSize;
        this.savePreferences();
    }

    toggleContrast() {
        document.body.classList.toggle("high-contrast");
        this.savePreferences();
    }

    toggleGrayscale() {
        document.body.classList.toggle("grayscale");
        this.savePreferences();
    }

    toggleDyslexiaFont() {
        document.body.classList.toggle("dyslexia-font");
        this.savePreferences();
    }

    readText() {
        const text = document.body.innerText;
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = this.speechRate;
        speech.pitch = this.speechPitch;
        speech.volume = this.speechVolume;
        window.speechSynthesis.speak(speech);
    }

    readSelectedText() {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            const speech = new SpeechSynthesisUtterance(selectedText);
            speech.lang = "en-US";
            speech.rate = this.speechRate;
            speech.pitch = this.speechPitch;
            speech.volume = this.speechVolume;
            window.speechSynthesis.speak(speech);
        } else {
            alert("Please select some text first.");
        }
    }

    highlightLinksHeadings() {
        const links = document.querySelectorAll("a");
        const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

        links.forEach(link => link.style.backgroundColor = "yellow");
        headings.forEach(heading => heading.style.backgroundColor = "lightblue");
    }

    changeTheme(theme) {
        document.body.className = ""; // Reset all classes
        if (theme === "dark") {
            document.body.classList.add("dark-theme");
        } else if (theme === "light") {
            document.body.classList.add("light-theme");
        } else if (theme === "sepia") {
            document.body.classList.add("sepia-theme");
        }
        this.savePreferences();
    }

    changeBackgroundColor(color) {
        document.body.style.backgroundColor = color;
        this.savePreferences();
    }

    resetSettings() {
        document.body.style.fontSize = "";
        document.body.className = "";
        document.body.style.backgroundColor = "";
        document.body.style.color = "";
        this.savePreferences();
        alert("Settings have been reset to default.");
    }

    savePreferences() {
        const preferences = {
            textSize: document.body.style.fontSize,
            contrast: document.body.classList.contains("high-contrast"),
            grayscale: document.body.classList.contains("grayscale"),
            dyslexiaFont: document.body.classList.contains("dyslexia-font"),
            backgroundColor: document.body.style.backgroundColor,
            theme: document.body.className
        };
        localStorage.setItem("accessibilityPreferences", JSON.stringify(preferences));
    }

    loadPreferences() {
        const preferences = JSON.parse(localStorage.getItem("accessibilityPreferences"));
        if (preferences) {
            document.body.style.fontSize = preferences.textSize;
            if (preferences.contrast) document.body.classList.add("high-contrast");
            if (preferences.grayscale) document.body.classList.add("grayscale");
            if (preferences.dyslexiaFont) document.body.classList.add("dyslexia-font");
            if (preferences.backgroundColor) document.body.style.backgroundColor = preferences.backgroundColor;
            if (preferences.theme) document.body.className = preferences.theme;
        }
    }
}

const accessibility = new AccessibilityWidget();
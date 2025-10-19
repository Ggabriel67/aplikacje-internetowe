document.addEventListener("DOMContentLoaded", () => {
  class Todo {
    constructor() {
      this.tasks = [];
      this.taskList = document.querySelector(".task-list");
      this.inputText = document.querySelector(".task-form input[type='text']");
      this.inputDate = document.querySelector(".task-form input[type='date']");
      this.searchbar = document.querySelector(".searchbar");
      this.saveBtn = document.getElementById("saveTask");
      this.term = "";

      this.saveBtn.addEventListener("click", () => this.addTask());
      this.searchbar.addEventListener("input", (e) => {
        this.term = e.target.value.trim().toLowerCase();
        this.draw();
      });

      this.loadFromStorage();
      this.draw();
    }

    saveToStorage() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    loadFromStorage() {
      const saved = localStorage.getItem("tasks");
      if (saved) {
        try {
          this.tasks = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load tasks:", e);
          this.tasks = [];
        }
      }
    }

    addTask() {
      const text = this.inputText.value.trim();
      const date = this.inputDate.value ? new Date(this.inputDate.value) : null;

      if (text.length < 3 || text.length > 255) {
        alert("Task name must be between 3 and 255 characters.");
        return;
      }

      if (date && date < new Date().setHours(0, 0, 0, 0)) {
        alert("Date must be today or in the future.");
        return;
      }

      this.tasks.push({
        id: Date.now(),
        text,
        date: date ? date.toISOString().split("T")[0] : "",
        done: false,
      });

      this.inputText.value = "";
      this.inputDate.value = "";

      this.saveToStorage();
      this.draw();
    }

    deleteTask(id) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      this.saveToStorage();
      this.draw();
    }

    editTask(id) {
      const task = this.tasks.find((t) => t.id === id);
      if (!task) return;

      const li = this.taskList.querySelector(`[data-id="${id}"]`);
      if (!li) return;

      li.innerHTML = "";

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.value = task.text;
      nameInput.classList.add("edit-text");

      const dateInput = document.createElement("input");
      dateInput.type = "date";
      dateInput.value = task.date || "";
      dateInput.classList.add("edit-date");

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.classList.add("edit-save");

      li.append(nameInput, dateInput, saveBtn);

      const saveChanges = () => {
        const newText = nameInput.value.trim();
        const newDate = dateInput.value ? new Date(dateInput.value) : null;

        if (newText.length < 3 || newText.length > 255) {
          alert("Task name must be between 3 and 255 characters.");
          return;
        }

        if (newDate && newDate < new Date().setHours(0, 0, 0, 0)) {
          alert("Date must be today or in the future.");
          return;
        }

        task.text = newText;
        task.date = dateInput.value || "";

        this.saveToStorage();
        document.removeEventListener("click", clickOutsideHandler);
        this.draw();
      };

      saveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        saveChanges();
      });

      const clickOutsideHandler = (e) => {
        if (!li.contains(e.target)) {
          saveChanges();
        }
      };

      setTimeout(() => document.addEventListener("click", clickOutsideHandler), 0);
    }

    getFilteredTasks() {
      if (!this.term) return this.tasks;
      return this.tasks.filter((t) =>
        t.text.toLowerCase().includes(this.term)
      );
    }

    highlightText(text) {
      if (!this.term) return text;
      const regex = new RegExp(`(${this.escapeRegExp(this.term)})`, "gi");
      return text.replace(regex, `<mark>$1</mark>`);
    }

    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    draw() {
      this.taskList.innerHTML = "";
      const filtered = this.getFilteredTasks();

      filtered.forEach((task) => {
        const li = document.createElement("li");
        li.classList.add("task-item");
        li.dataset.id = task.id;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;

        const name = document.createElement("span");
        name.innerHTML = this.highlightText(task.text);

        const date = document.createElement("span");
        date.textContent = task.date || "";

        const delBtn = document.createElement("button");
        delBtn.textContent = "X";

        delBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.deleteTask(task.id);
        });

        li.addEventListener("click", (e) => {
          if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
            this.editTask(task.id);
          }
        });

        checkbox.addEventListener("change", (e) => {
          task.done = e.target.checked;
          this.saveToStorage();
        });

        li.append(checkbox, name, date, delBtn);
        this.taskList.appendChild(li);
      });
    }
  }

  new Todo();
});

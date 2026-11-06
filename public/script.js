
const form = document.getElementById("bookForm");
const message = document.getElementById("message");

async function loadBooks() {
    try {
        const response = await fetch("/books");
        if (!response.ok) throw new Error("Unable to load books");

        const books = await response.json();
        const list = document.getElementById("bookList");
        list.replaceChildren();

        books.forEach(book => {
            const row = document.createElement("tr");

            [
                book.book_id,
                book.title,
                book.author,
                book.category,
                book.prices,
                book.stock
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            list.appendChild(row);
        });
    } catch (error) {
        message.textContent = error.message;
    }
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const operation = document.getElementById("operation").value;
    const id = document.getElementById("book_id").value;

    if (operation !== "add" && (!id || Number(id) < 1)) {
        message.textContent = "Enter a valid Book ID";
        return;
    }

    const book = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        category: document.getElementById("category").value,
        prices: document.getElementById("prices").value,
        stock: document.getElementById("stock").value
    };

    let url = "/books";
    let method = "POST";

    if (operation === "update") {
        url += "/" + encodeURIComponent(id);
        method = "PUT";
    } else if (operation === "delete") {
        url += "/" + encodeURIComponent(id);
        method = "DELETE";
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            ...(method !== "DELETE"
                ? { body: JSON.stringify(book) }
                : {})
        });

        const text = await response.text();
        let result;

        try {
            result = JSON.parse(text);
        } catch {
            result = { message: text };
        }

        if (!response.ok) {
            throw new Error(result.message || "Operation failed");
        }

        message.textContent = result.message;
        form.reset();
        loadBooks();
    } catch (error) {
        message.textContent = error.message;
    }
});

loadBooks();
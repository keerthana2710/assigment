document.addEventListener('DOMContentLoaded', () => {
  const addNoteForm = document.getElementById('addNoteForm');
  const cardsContainer = document.querySelector('.cardsContainer');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  addNoteForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const title = addNoteForm.elements['title'].value;
    const desc = addNoteForm.elements['desc'].value;

    if (title && desc) {
      // Create a new note element
      const note = document.createElement('div');
      note.classList.add('noteCard'); // Add CSS class 'noteCard'
      note.innerHTML = `
        <h3 class="note-title">${title}</h3>
        <p>${desc}</p>
        <button class="btn btn-danger delete-btn"><i class="mt-1 fa-solid fa-trash"></i></button>
        <button class="btn btn-warning archive-btn"><i class="mt-1 fa-solid fa-box-archive"></i></button>
      `;
      cardsContainer.appendChild(note); // Append the note to cardsContainer

      // Handle delete button click
      const deleteButton = note.querySelector('.delete-btn');
      deleteButton.addEventListener('click', () => {
        const noteContent = {
          title: title,
          desc: desc
        };
        localStorage.setItem('deletedNote', JSON.stringify(noteContent));
        note.remove(); // Remove the note card from the current page
      });

      // Handle archive button click
      const archiveButton = note.querySelector('.archive-btn');
      archiveButton.addEventListener('click', () => {
        const noteContent = {
          title: title,
          desc: desc
        };
        localStorage.setItem('archivedNote', JSON.stringify(noteContent));
        note.remove(); // Remove the note card from the current page
      });

      // Clear form inputs
      addNoteForm.elements['title'].value = '';
      addNoteForm.elements['desc'].value = '';
    } else {
      alert('Please fill out both the title and description');
    }
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.toLowerCase();
    const notes = document.querySelectorAll('.noteCard');
    notes.forEach(note => {
      const title = note.querySelector('.note-title').textContent.toLowerCase();
      if (title.includes(query)) {
        note.style.display = 'block';
      } else {
        note.style.display = 'none';
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('personForm');
    const personIdInput = document.getElementById('personId');
    const nameInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');
    const peopleList = document.getElementById('peopleList');
  
    const apiUrl = 'http://localhost:3000/pessoas';
  
    // Fetch and display people
    function fetchPeople() {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          peopleList.innerHTML = '';
          data.forEach(person => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${person.nome}</td>
              <td>${person.email}</td>
              <td>
                <button class="action-btn edit-btn" onclick="editPerson(${person.id}, '${person.nome}', '${person.email}')">Editar</button>
                <button class="action-btn delete-btn" onclick="deletePerson(${person.id})">Deletar</button>
              </td>
            `;
            peopleList.appendChild(row);
          });
        })
        .catch(error => console.error('Erro ao buscar pessoas:', error));
    }
  
    // Add or update person
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = personIdInput.value;
      const nome = nameInput.value;
      const email = emailInput.value;
  
      const person = { nome, email };
  
      if (id) {
        fetch(`${apiUrl}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(person)
        })
          .then(() => {
            fetchPeople();
            form.reset();
            submitBtn.textContent = 'Adicionar Pessoa';
            personIdInput.value = '';
          })
          .catch(error => console.error('Erro ao atualizar pessoa:', error));
      } else {
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(person)
        })
          .then(() => {
            fetchPeople();
            form.reset();
          })
          .catch(error => console.error('Erro ao adicionar pessoa:', error));
      }
    });
  
    // Edit person
    window.editPerson = (id, nome, email) => {
      personIdInput.value = id;
      nameInput.value = nome;
      emailInput.value = email;
      submitBtn.textContent = 'Atualizar Pessoa';
    };
  
    // Delete person
    window.deletePerson = (id) => {
      fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
      })
        .then(() => fetchPeople())
        .catch(error => console.error('Erro ao deletar pessoa:', error));
    };
  
    // Initial fetch
    fetchPeople();
  });
  
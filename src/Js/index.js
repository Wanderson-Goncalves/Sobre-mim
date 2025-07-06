const reposContainer = document.getElementById('repos');
const languageFilter = document.getElementById('languageFilter');
const loadMoreButton = document.getElementById('loadMoreButton'); // Pega o novo botão
let allRepos = [];
let currentReposCount = 6; // Começamos exibindo 6 repositórios

fetch('https://api.github.com/users/Wanderson-Goncalves/repos')
  .then(response => response.json())
  .then(data => {
    allRepos = data;
    populateLanguages(data);
    displayRepos(allRepos.slice(0, currentReposCount)); // Exibe os primeiros 6 inicialmente
    checkLoadMoreButtonVisibility(); // Verifica se o botão deve ser visível
  })
  .catch(error => {
    console.error('Erro ao buscar repositórios:', error);
  });

function populateLanguages(repos) {
  const languages = new Set();
  repos.forEach(repo => {
    if (repo.language) {
      languages.add(repo.language);
    }
  });

  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    languageFilter.appendChild(option);
  });
}

function displayRepos(reposToDisplay) {
  reposContainer.innerHTML = ''; // Limpa o container antes de adicionar novos cards
  reposToDisplay.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h2>${repo.name}</h2>
      <p>${repo.description || 'Sem descrição disponível.'}</p>
      <p><strong>Linguagem:</strong> ${repo.language || 'Não especificada'}</p>
      <a class="button" href="${repo.html_url}" target="_blank">🔗 Ver no GitHub</a>
    `;

    reposContainer.appendChild(card);
  });
}

// Função para verificar a visibilidade do botão "Carregar Mais"
function checkLoadMoreButtonVisibility() {
    if (currentReposCount >= allRepos.length) {
        loadMoreButton.style.display = 'none'; // Esconde o botão se não houver mais repositórios
    } else {
        loadMoreButton.style.display = 'block'; // Mostra o botão
    }
}

// Evento de clique para o botão "Carregar Mais"
loadMoreButton.addEventListener('click', () => {
  currentReposCount += 6; // Incrementa o contador em 6
  let reposToFilter = allRepos;
  const selected = languageFilter.value;

  if (selected !== 'all') {
    reposToFilter = allRepos.filter(repo => repo.language === selected);
  }

  // Exibe até o novo limite de cards
  displayRepos(reposToFilter.slice(0, currentReposCount));
  checkLoadMoreButtonVisibility(); // Verifica a visibilidade do botão novamente
});

languageFilter.addEventListener('change', () => {
  const selected = languageFilter.value;
  currentReposCount = 6; // Reseta a contagem ao filtrar
  if (selected === 'all') {
    displayRepos(allRepos.slice(0, currentReposCount));
  } else {
    const filtered = allRepos.filter(repo => repo.language === selected);
    displayRepos(filtered.slice(0, currentReposCount));
  }
  checkLoadMoreButtonVisibility(); // Verifica a visibilidade ao filtrar
});

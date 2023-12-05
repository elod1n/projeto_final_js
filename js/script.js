const monsterInput = document.getElementById("monsterInput");
const searchButton = document.getElementById("searchButton");
const monsterResult = document.getElementById("monsterResult");
const monsterTableBody = document.querySelector("#monsterTable tbody");

searchButton.addEventListener("click", () => {
  const monsterName = monsterInput.value.toLowerCase();
  if (monsterName) {
    searchMonster(monsterName);
  } else {
    monsterResult.innerHTML = "<tr><td colspan='6'>Por gentileza, insira o nome de um monstro (Aboleth é um exemplo)</td></tr>";
  }
});

function searchMonster(monsterName) {
  monsterTableBody.innerHTML = "<tr><td colspan='6'>Procurando...</td></tr>";

  axios
    .get(`https://www.dnd5eapi.co/api/monsters`)
    .then((response) => {
      const monsters = response.data.results;
      const matchedMonster = monsters.find(
        (monster) => monster.name.toLowerCase() === monsterName
      );

      if (matchedMonster) {
        axios
          .get(`https://www.dnd5eapi.co${matchedMonster.url}`)
          .then((monsterResponse) => {
            const monsterData = monsterResponse.data;
            const armorClass = monsterData.armor_class.length > 0 ? monsterData.armor_class[0].value : 'Não disponível';
            const imageUrl = monsterData.image ? `https://www.dnd5eapi.co${monsterData.image}` : 'https://elod1n.github.io/projeto_final_js/images/not_found.png';

            monsterTableBody.innerHTML = `
              <tr>
                <td>${monsterData.name}</td>
                <td>${monsterData.type}</td>
                <td>${monsterData.size}</td>
                <td>${armorClass}</td>
                <td>${monsterData.hit_points}</td>
                <td><img src="${imageUrl}" alt="${monsterData.name}" class="monster-image"></td>
              </tr>
            `;
          })
          .catch((error) => {
            monsterTableBody.innerHTML = `<tr><td colspan='6'><img src="https://elod1n.github.io/projeto_final_js/images/not_found.png" alt="Monstro não encontrado" class="monster-image"></td></tr>`;
          });
      } else {
        monsterTableBody.innerHTML = `<tr><td colspan='6'><img src="https://elod1n.github.io/projeto_final_js/images/not_found.png" alt="Monstro não encontrado" class="monster-image"></td></tr>`;
      }
    })
    .catch((error) => {
      monsterTableBody.innerHTML = "<tr><td colspan='6'>Erro ao realizar a busca de monstros.</td></tr>";
    });
}

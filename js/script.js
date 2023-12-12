window.onload = function () {
  const challengeRatingSelect = document.getElementById(
    "challengeRatingSelect"
  );
  const monsterList = document.getElementById("monsterList");
  const monsterDetails = document.getElementById("monsterDetails");
  const monsterDetailsHead = document.getElementById("monsterDetailsHead");
  const monsterResult = document.getElementById("monsterResult");

  const lastMonsterData = localStorage.getItem("lastMonsterData");
  if (lastMonsterData) {
    displayMonsterDetails(JSON.parse(lastMonsterData));
  }

  challengeRatingSelect.addEventListener("change", () => {
    const challengeRating = challengeRatingSelect.value;
    if (challengeRating) {
      searchMonstersByChallengeRating(challengeRating);
      monsterDetails.innerHTML = "";
      monsterDetails.style.display = "none";
      monsterDetailsHead.style.display = "none";
      monsterList.style.display = "table-row-group";
    } else {
      monsterList.innerHTML =
        "<tr><td colspan='6'>Selecione um nível de desafio para começar.</td></tr>";
      monsterDetails.style.display = "none";
      monsterDetailsHead.style.display = "none";
    }
  });

  function searchMonstersByChallengeRating(challengeRating) {
    monsterList.innerHTML = "<tr><td colspan='6'>Procurando...</td></tr>";
    monsterResult.style.display = "block";

    axios
      .get(
        `https://www.dnd5eapi.co/api/monsters?challenge_rating=${challengeRating}`
      )
      .then((response) => {
        const monsters = response.data.results;
        monsterList.innerHTML = "";
        monsters.forEach((monster) => {
          const monsterRow = document.createElement("tr");
          const monsterCell = document.createElement("td");
          monsterCell.colSpan = "6";

          const monsterLink = document.createElement("a");
          monsterLink.href = "#";
          monsterLink.textContent = monster.name;
          monsterLink.addEventListener("click", function () {
            getMonsterDetails(monster.index);
          });

          monsterCell.appendChild(monsterLink);
          monsterRow.appendChild(monsterCell);
          monsterList.appendChild(monsterRow);
        });
      })
      .catch((error) => {
        monsterList.innerHTML =
          "<tr><td colspan='6'>Erro ao realizar a busca de monstros.</td></tr>";
      });
  }

  function getMonsterDetails(monsterIndex) {
    axios
      .get(`https://www.dnd5eapi.co/api/monsters/${monsterIndex}`)
      .then((response) => {
        const monsterData = response.data;
        displayMonsterDetails(monsterData);
        localStorage.setItem("lastMonsterData", JSON.stringify(monsterData));
      })
      .catch((error) => {
        monsterDetails.innerHTML = `<tr><td colspan='6'><img src="https://elod1n.github.io/projeto_final_js/images/not_found.png" alt="Monstro não encontrado" class="monster-image"></td></tr>`;
      });
  }

  function displayMonsterDetails(monsterData) {
    const armorClass =
      monsterData.armor_class.length > 0
        ? monsterData.armor_class[0].value
        : "Não disponível";
    const imageUrl = monsterData.image
      ? `https://www.dnd5eapi.co${monsterData.image}`
      : "https://elod1n.github.io/projeto_final_js/images/not_found.png";

    monsterDetails.innerHTML = `
          <tr>
              <td>${monsterData.name}</td>
              <td>${monsterData.type}</td>
              <td>${monsterData.size}</td>
              <td>${armorClass}</td>
              <td>${monsterData.hit_points}</td>
              <td><img src="${imageUrl}" alt="${monsterData.name}" class="monster-image" style="width: 150px; height: 150px;"></td>
          </tr>
      `;
    monsterDetails.style.display = "table-row-group";
    monsterDetailsHead.style.display = "table-header-group";
    monsterList.style.display = "none";
  }
};

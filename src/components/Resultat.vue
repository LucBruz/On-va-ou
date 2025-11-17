<template>
  <div class="main-conteneur">
    <div class="filter-bar">
      <div class="search-bar">
        <input class="texte" type="text" v-model="recherche" placeholder="Rechercher une ville"
          @input="filtrerParRecherche">
      </div>
      <select v-model="selectedFilter" @change="filtrer(selectedFilter)">
        <option value="ville">Nom</option>
        <option value="temperature">Température</option>
        <option value="proximite">Distance</option>
      </select>
      <button :class="{ active: sortordre === 'asc' }" @click="definirOrdre('asc')">↑</button>
      <button :class="{ active: sortordre === 'desc' }" @click="definirOrdre('desc')">↓</button>
    </div>

    <div class="result-container">
      <unResultat v-for="(ville, index) in sortedPropositions" :key="ville.ville" :ville="ville" />
    </div>
  </div>
</template>
<style scoped>
.main-conteneur {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: var(--fond_conteneurs);
  padding: 0 0 1rem 0;
  border-radius: 10px;
}

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: var(--fond_conteneurs);
  padding: 1rem 0;
}

.filter-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  width: 100%;
  height: 15%;
  background-color: var(--fond_elements_conteneurs);
  padding: 0 1rem;
}

.search-bar {
  height: 60%;
  width: 60%;
  background-color: var(--fond_elements_conteneurs);
  border-radius: 5px;
  overflow: hidden;
  margin: 0;
  border: 1px solid black;
}

.search-bar input[type="text"] {
  border: none;
  width: 100%;
  height: 100%;
  padding-left: 10px;
  background-color: var(--fond_elements_conteneurs);
  font-size: 1.2em;
  color: var(--texte);
}

.search-bar input[type="text"]::placeholder {
  color: var(--texte);
  font-size: 1.2em;
}

.filter-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  width: 100%;
  height: 15%;
  background-color: var(--fond_elements_conteneurs);
  padding: 0 1rem;
}

.filter-bar select {
  padding: 0.5rem;
  font-size: 1.5rem;
  height: 3rem;
  width: 30%;
  background-color: var(--fond_elements_conteneurs);
  border: 1px solid black;
  border-radius: 5px;
}

.filter-bar button {
  padding: 0.5rem;
  cursor: pointer;
  background-color: var(--fond_elements_conteneurs);
  font-size: 1.5rem;
  height: 3rem;
  border: 1px solid black;
  border-radius: 5px;
}

.filter-bar button.active {
  background-color: var(--texte_important);
  color: var(--texte);
}

.filter-bar select option {
  background-color: var(--fond_elements_conteneurs);
}

.texte {
  color: var(--texte);
}

.proposition-box {
  background-color: var(--fond_elements_conteneurs);
  width: 95%;
  min-height: 20vh;
  margin-bottom: 1rem;
  padding: 0.3rem;
  border-radius: 5px;
  transition: transform 0.3s ease;
  overflow: hidden;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  text-align: center;
  margin: 0;
  font-size: 2rem;
  color: var(--texte);
}

.description-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.description {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.img-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.scrollable-temp-container {
  display: flex;
  align-items: center;
}

.temperature-container span {
  font-size: 1.2rem;
  padding: 0 5px;
  color: var(--texte);
}

.temperature-container {
  display: flex;
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
  width: 100%;
  gap: 15px;
}

.bouton-semaine-container {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.bouton-semaine {
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.3rem;
  border: 1px solid black;
}

.bouton-semaine.active {
  background-color: var(--texte_important);
  color: var(--texte);
}

span {
  font-weight: bold;
  color: var(--texte);
}
</style>

<script>
import unResultat from './unResultat.vue';
import { useMyStore } from '../store.js';
import { weatherIcons } from '../weatherIcons.js';

export default {
  name: 'unResultatat',
  components: {
    unResultat
  },
  data() {
    return {
      selectedFilter: 'ville',
      sortordre: 'asc',
      recherche: '',
    };
  },
  setup() {
    const store = useMyStore();
    store.formaterDonneesPourAffichage();
    return {
      store
    }
  },
  computed: {
    sortedPropositions() {
      return this.store.propositions.sort((a, b) => {
        switch (this.selectedFilter) {
          case 'temperature':
            return this.sortordre === 'desc' ? a.temperatureMoyenne - b.temperatureMoyenne : b.temperatureMoyenne - a.temperatureMoyenne;
          case 'ville':
            return this.sortordre === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          case 'proximite':
            return this.sortordre === 'asc' ? a.distance - b.distance : b.distance - a.distance;
          default:
            return 0;
        }
      });
    },
  },
  methods: {
    filtrerParRecherche() {
      if (this.recherche.trim() === '') {
        this.store.formaterDonneesPourAffichage();
        return;
      }

      const rechercheMinuscule = this.recherche.toLowerCase();
      this.store.propositions = this.store.propositions.filter(ville => ville.name.toLowerCase().includes(rechercheMinuscule));
    },
    filtrer(sujet) {
      this.selectedFilter = sujet;
      if (sujet == "proximite") {
        this.obtenirPositionUtilisateur();
      }
      this.definirOrdre(this.sortordre)
    },
    definirOrdre(ordre) {
      this.sortordre = ordre;
    },
    obtenirPositionUtilisateur() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          this.store.propositions.forEach(ville => {
            ville.distance = this.calculerDistance(latitude, longitude, ville.latitude, ville.longitude);
          });
        }, error => {
          console.error("Erreur lors de la récupération de la position", error);
        });
      } else {
        console.error("La géolocalisation n'est pas disponible sur ce navigateur");
      }
    },
    calculerDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d;
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
  },
  mounted() {
    this.store.formaterDonneesPourAffichage();
  },
}
</script>

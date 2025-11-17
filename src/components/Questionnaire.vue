<template>
  <div class="questionnaire">
    <div class="question">
      <label for="startDate">Date de départ:</label>
      <input type="date" id="startDate" v-model="startDate" :min="date_de_depart_min" :max="date_de_depart_max">
    </div>
    <div class="question">
      <label for="endDate">Date de fin:</label>
      <input type="date" id="endDate" v-model="endDate" :min="date_de_fin_min" :max="date_de_fin_max"
        :disabled="!startDate">
    </div>
    <div class="question">
      <label for="tolerance">Tolérance:</label>
      <div class="input-group">
        <button @click="decreaseTolerance" :disabled="isMinTolerance">-</button>
        <input class="bouton_plus_moins" type="number" id="tolerance" v-model="toleranceDays" readonly>
        <button @click="increaseTolerance" :disabled="isMaxTolerance">+</button>
      </div>
    </div>
    <button class="bouton_envoyer" @click="submit" :disabled="isButtonDisabled">Envoyer</button>
  </div>
</template>

<style scoped>
/* Variables et configuration générale */
.bouton_envoyer:disabled {
  cursor: not-allowed;
}

.questionnaire {
  width: 100%;
  height: 100%;
  background-color: var(--fond_conteneurs);
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  /* Ajout d'un gap pour espacer les éléments */
}

.question {
  background-color: var(--fond_elements_conteneurs);
  padding: 10px;
  border-radius: 8px;
  position: relative;
}

.question>label,
.question input,
.question button {
  font-size: 2em;
  height: 5vh;
  background-color: var(--fond_elements_conteneurs);
}

/* Configuration des inputs */
.question>input[type="date"] {
  display: block;
  margin: 10px auto;
  width: 80%;
  text-align: center;
  border: 1px solid black;
}

.input-group {
  display: flex;
  align-items: center;
  transform: scale(0.95);
}

/* Boutons et leurs interactions */
.input-group>button,
.input-group>input {
  width: 5vh;
  height: 5vh;
  font-size: 2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid black;
  box-sizing: border-box;
}

.input-group>button:last-child {
  border-left: 1px solid black;
}

.input-group>button:hover {
  background-color: var(--texte_important);
}

.input-group>button,
.bouton_envoyer,
input[type="date"] {
  cursor: pointer;
}

.input-group>button:first-child {
  border-right: 1px solid black;
}

.input-group>input {
  flex: 1;
  text-align: center;
  border-left: none;
  border-right: none;
}

.input-group>button:disabled {
  cursor: not-allowed;
  background-color: var(--fond_elements_conteneurs);
}

/* Bouton d'envoi */
.bouton_envoyer {
  display: block;
  margin: 0 auto;
  width: 200px;
  height: 60px;
  background-color: var(--fond_elements_conteneurs);
  border: none;
  border-radius: 10px;
  font-size: 2em;
}
</style>

<script>
import { useMyStore } from '../store.js';
export default {
  name: 'Questionnaire',
  data() {
    return {
      startDate: null,
      endDate: null,
      toleranceDays: 0,
      date_de_depart_min: new Date().toISOString().split("T")[0],
      date_de_depart_max: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      date_de_fin_min: '',  // Initialisé vide, sera défini par le watch
      date_de_fin_max: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };
  },
  setup() {
    const store = useMyStore();

    return {
      store
    }
  },
  computed: {
    isButtonDisabled() {
      return !this.startDate || !this.endDate;
    },
    totalDays() {
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diff = end - start;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      }
      return 0;
    },
    isMaxTolerance() {
      return this.toleranceDays >= this.totalDays;
    },
    isMinTolerance() {
      return this.toleranceDays <= 0;
    }
  },
  methods: {
    increaseTolerance() {
      if (this.toleranceDays < this.totalDays) {
        this.toleranceDays++;
      }
    },
    decreaseTolerance() {
      if (this.toleranceDays > 0) {
        this.toleranceDays--;
      }
    },
    submit() {
      // Mettre à jour le store directement avec les nouvelles valeurs
      this.store.startDate = this.startDate;
      this.store.endDate = this.endDate;
      this.store.toleranceDays = this.toleranceDays;

      // Affichage des données dans la console pour vérification
      console.log("startDate:", this.startDate);
      console.log("endDate:", this.endDate);
      console.log("toleranceDays:", this.toleranceDays);

      this.store.meteoRespecteTolerance();
    }

  },
  watch: {
    startDate() {
      // La date de fin minimale est la date de départ + 3 jours
      this.date_de_fin_min = new Date(new Date(this.startDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    },

    endDate() {
      // La date de début maximale est la date de fin - 3 jours
      this.date_de_depart_max = new Date(new Date(this.endDate).getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    },

    totalDays(newTotal) {
      if (this.toleranceDays > newTotal) {
        this.toleranceDays = newTotal;
      }
    }
  }

}
</script>
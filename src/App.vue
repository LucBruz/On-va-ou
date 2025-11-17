<template>
  <div>
    <div class="accueil">
      <Accueil />
    </div>
    <div class="ligne">
      <div class="quarente">
        <Questionnaire />
      </div>
      <div class="soixante">
        <Resultat />
      </div>
    </div>
  </div>
</template>

<style>
.accueil {
  height: 15vh;

}

.ligne {
  width: 75%;
  margin: 0 auto;
  gap: 50px;
  /* Centrez le contenu horizontalement */
  display: flex;
  align-items: flex-start;

}

.soixante {
  width: 60%;
  /* Prend 60% de la largeur de la page */
  height: 80vh;
  /* Prend 60% de la hauteur de la page */
}

.quarente {
  width: 40%;
  /* Prend 40% de la largeur de la page */
  height: 80vh;
  /* Prend 60% de la hauteur de la page */
  margin-right: 20px;
  /* Ajoute une marge entre les deux éléments */
}
</style>

<script>
import Accueil from './components/Accueil.vue';
import Questionnaire from './components/questionnaire.vue';
import Resultat from './components/resultat.vue';

export default {
  components: {
    Accueil,
    Questionnaire,
    Resultat
  },
  data() {
    return {
      submittedData: null
    };
  },
  methods: {
    handleData(data) {
      this.submittedData = data;
    }
  }
}
</script>

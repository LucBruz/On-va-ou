import { defineStore } from 'pinia';
import donnees from './data.json';
// store.js
export const useMyStore = defineStore('myStore', {
  state: () => ({
    submittedData: null,
    villes: [],
    startDate: null, // Ajoutez une valeur par défaut
    endDate: null,   // Ajoutez une valeur par défaut
    toleranceDays: 0, // Ajoutez une valeur par défaut
    propositions: [],
    InitialPropositions: [],
    isSubmit: 0,
    startIndex: -1,  // Added
    endIndex: -1,    // Added
    css: false,



  }),
  actions: {
    modificationcss() {
      let result;
      if (this.isSubmit === 1) {
        if ((this.endIndex - this.startIndex) > 7) {

          result = true;
        } else {
          result = false;
        }
      } else {
        result = false;
      }
      console.log('Valeur de modificationcss:', result);
      return result;
    },

    getDebut(datesSemaine1et2) {
      console.log("je passe dans getDebut");
      for (let i = 0; i < datesSemaine1et2.length; i++) {
        if (datesSemaine1et2[i] === this.startDate) {
          console.log(i);
          return i;
        }
      }
      return -1;
    },

    getFin(datesSemaine1et2, startIndex) {

      for (let i = startIndex + 3; i < datesSemaine1et2.length; i++) {
        if (datesSemaine1et2[i] === this.endDate) {
          console.log(i);
          return i;
        }
      }
      return - 1;
    },


    meteoRespecteTolerance() {
      this.isSubmit = 1;
      console.log("je passe dans meteoRespecteTolerance");
      this.propositions = JSON.parse(JSON.stringify(this.InitialPropositions));
      const toleranceDays = this.toleranceDays;
      const codesIntolerables = [51, 53, 55, 61, 63, 65, 95, 96, 99, 71, 73, 75, 80];

      // Utilisez la première ville pour obtenir les indices de départ et de fin, 
      // en supposant que tous les autres ont les mêmes dates


      const datesSemaine1 = this.propositions[0]['semaine1'].dates;
      const datesSemaine2 = this.propositions[0]['semaine2'].dates;
      const datesSemaine1et2 = datesSemaine1.concat(datesSemaine2);



      console.log("datesSemaine1 : " + datesSemaine1);
      console.log("datesSemaine2 : " + datesSemaine2);

      this.startIndex = this.getDebut(datesSemaine1et2);  // Updated
      this.endIndex = this.getFin(datesSemaine1et2, this.startIndex);  // Updated


      console.log("startIndex : " + this.startIndex);
      console.log("endIndex : " + this.endIndex);

      // Si les dates de début ou de fin ne sont pas trouvées dans les données météo de la ville, sortir de la fonction.
      if (this.startIndex === -1 || this.endIndex === -1) {
        return;
      }

      for (let i = 0; i < this.propositions.length; i++) {
        const ville = this.propositions[i];

        const codesSemaine1 = ville.semaine1.codes;
        const codesSemaine2 = ville.semaine2.codes;
        const codes = codesSemaine1.concat(codesSemaine2);


        let joursIntolerables = 0;

        // Afficher les codes météo pour chaque ville
        // Bouclez seulement sur les jours entre début et fin.
        for (let j = this.startIndex; j <= this.endIndex; j++) {
          if (codesIntolerables.includes(codes[j])) {
            joursIntolerables++;
          }
        }

        if (joursIntolerables > toleranceDays) {
          this.propositions.splice(i, 1);
          i--;  // Ajuster l'index car nous venons de supprimer un élément
        }
      }
      console.log(this.propositions);
      this.modificationcss();
      return this.propositions;
    },





    formaterDonneesPourAffichage() {
      const listeDonneesFormatees = donnees.map(item => {
        const formatSemaine = (semaine) => {
          const semaineData = item.forecast.find(forecast => forecast.semaine === semaine);
          if (!semaineData) {
            return {
              temperatures: [],
              codes: [],
              dates: [], // Ajoutez un tableau pour stocker les dates
            };
          }

          const temperatures = semaineData.daily.map(jour => jour.temperature);
          const codes = semaineData.daily.map(jour => jour.weather_code);
          const dates = semaineData.daily.map(jour => jour.date); // Ajoutez les dates

          return { temperatures, codes, dates };
        };

        const semaine1 = formatSemaine(1);
        const semaine2 = formatSemaine(2);

        return {
          name: item.name,
          latitude: item.lat,
          longitude: item.long,
          temperatureMoyenne: item.temperature_moyenne,
          semaine1,
          semaine2,
          semaineSelectionnee: 1,
        };
      });

      this.propositions = listeDonneesFormatees;
      this.InitialPropositions = JSON.parse(JSON.stringify(listeDonneesFormatees));

    }

  }
});

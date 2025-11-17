<template>
    <div class="proposition-box" :style="{ 'min-height': store.modificationcss() ? '24vh' : '20vh' }">
        <div class="header-container">
            <h3>{{ ville.name }}</h3>
            <div v-if="!this.store.isSubmit" class="bouton-semaine-container">
                <span>Semaine</span>
                <button class="bouton-semaine" :class="{ active: ville.semaineSelectionnee === 1 }"
                    @click="ville.semaineSelectionnee = 1">1</button>
                <button class="bouton-semaine" :class="{ active: ville.semaineSelectionnee === 2 }"
                    @click="ville.semaineSelectionnee = 2">2</button>
            </div>
        </div>
        <div class="description-container">
            <div class="description">
                Température moyenne :
                <span style="margin-left: 20px;">
                    {{ this.store.isSubmit === 0 ? ville.temperatureMoyenne : getTemperatureMoyenne(ville) }}°C
                </span>
            </div>
            <div class="scrollable-temp-container">
                <div class="temperature-container">
                    <span v-for="(temp, index) in filterDataByDate2(ville, 'temp')" :key="index">
                        {{ temp }}°C
                    </span>
                </div>
            </div>
            <div class="description">
                <div style="margin-right: 20px;">Description : </div>
                <div class="img-container">
                    <span v-for="(code, index) in filterDataByDate2(ville, 'code')" :key="index">
                        <i :class="getWeatherIcon(code)"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useMyStore } from '../store.js';
import { weatherIcons } from '../weatherIcons.js';

export default {
    name: 'Result',
    props: {
        ville: {
            type: Object,
            required: true
        }
    },
    setup() {
        const store = useMyStore();
        return {
            store
        }
    },
    methods: {
        getTemperatureMoyenne(ville) {
            if (this.store.startIndex === -1 || this.store.endIndex === -1) {
                console.error("startIndex ou endIndex ne sont pas valides.");
                return ville.temperatureMoyenne;  // Renvoyer la température moyenne par défaut si les indices ne sont pas valides
            }

            // Fusionnez les températures des deux semaines
            const combinedTemperatures = [...ville.semaine1.temperatures, ...ville.semaine2.temperatures];

            // Extraire les températures des jours sélectionnés
            const selectedTemperatures = combinedTemperatures.slice(this.store.startIndex, this.store.endIndex + 1);

            // Calculer la moyenne des températures sélectionnées
            const sum = selectedTemperatures.reduce((acc, val) => acc + val, 0);
            const average = sum / selectedTemperatures.length;

            // Arrondir à un chiffre après la virgule
            const roundedAverage = Math.round(average * 10) / 10;

            return roundedAverage;
        },
        filterDataByDate2(ville, type) {
            let data;

            // Si isSubmit n'est pas 0, fusionnez les données des deux semaines
            if (this.store.isSubmit !== 0) {
                const combinedTemperatures = [...ville.semaine1.temperatures, ...ville.semaine2.temperatures];
                const combinedCodes = [...ville.semaine1.codes, ...ville.semaine2.codes];

                switch (type) {
                    case 'temp':
                        data = combinedTemperatures;
                        break;
                    case 'code':
                        data = combinedCodes;
                        break;
                    default:
                        console.error(`Type ${type} non reconnu.`);
                        return [];
                }

                if (this.store.startIndex !== -1 && this.store.endIndex !== -1) {
                    return data.slice(this.store.startIndex, this.store.endIndex + 1);
                } else {
                    console.error("startIndex ou endIndex ne sont pas valides.");
                    return [];
                }
            }
            // Si isSubmit est 0, utilisez la semaine sélectionnée
            else {
                switch (type) {
                    case 'temp':
                        data = ville['semaine' + ville.semaineSelectionnee].temperatures;
                        break;
                    case 'code':
                        data = ville['semaine' + ville.semaineSelectionnee].codes;
                        break;
                    default:
                        console.error(`Type ${type} non reconnu.`);
                        return [];
                }

                return data;
            }
        },
        getWeatherIcon(code) {
            const icon = weatherIcons[code] || 'question'; // notez que c'est 'question' et non 'fa-question'
            return ['fas', icon];
        }
    }
}
</script>

<style scoped>
.proposition-box {
    background-color: var(--fond_elements_conteneurs);
    width: 90%;
    min-height: 20vh;
    margin-bottom: 1rem;
    padding: 0.3rem;
    border-radius: 5px;
    transition: transform 0.3s ease;
    overflow: hidden;
}

.proposition-box * {
    background-color: var(--fond_elements_conteneurs);
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
    background-color: var(--fond_elements_conteneurs);
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
    gap: 2px;
    justify-content: flex-start;
    /* Align buttons to the left */
    background-color: var(--fond_elements_conteneurs);
    align-items: flex-start;
    /* Align buttons to the top */
}

.bouton-semaine {
    width: 30px;
    height: 30px;
    cursor: pointer;
    background-color: var(--fond_elements_conteneurs);
    font-size: 0.8rem;
    /* Reduce button size */
    border: 1px solid black;
    border-radius: 5px;
    /* Round the buttons */
}

.bouton-semaine.active {
    background-color: var(--texte_important);
    color: var(--texte);
}

.bouton-semaine-container span {
    font-size: 1.3rem;
    margin-right: 10px;
    color: var(--texte);
}

span {
    font-weight: bold;
    color: var(--texte);
}
</style>

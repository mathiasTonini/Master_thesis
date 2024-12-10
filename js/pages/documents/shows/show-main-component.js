const cardTemplate = `
 <div>
    <h1>{{ docname }}</h1>
    <!-- Utilisation de deux v-model avec des noms différents -->
    <p>Message actuel : {{ message }}</p>
    <p>Count actuel : {{ count }}</p>
     <button @click="updateMessage">Changer le message</button>
  </div>
  <v-tabs v-model="activeTab" fixed-tabs>
      <v-tab>Preview</v-tab>
      <v-tab>Data</v-tab>
      <v-tab>Filters</v-tab>
    </v-tabs>

  <div v-show="activeTab === 0">
      <docPreviewComponent v-model:cleanDocName="docname" />
    </div>
    <div v-show="activeTab === 1">
      <dataComponent v-model:cleanDocName="docname" />
    </div>
    <div v-show="activeTab === 2">
      <filtersDataComponent v-model:cleanDocName="docname" />
    </div>



`;
const showDocMainComponent = {
    name: 'showDocMainComponent',
    components: {
      docPreviewComponent,
      dataComponent,
      filtersDataComponent,
    },
    template: cardTemplate,
    data() {
        return {
          message: 'Bonjour depuis le parent', // Message initial
          count: 0, // Compteur initial
          docname: '',
          activeTab: 0, // Pour gérer l'onglet actif
        };
      },
    methods: {
        updateMessage() {
            this.message = 'Le message a changé !';
          },
    },
    created() {
        console.log("in the card compoenent")
    },
    mounted(){
       this.docname = document.getElementById('docname').value
    }
 };
        
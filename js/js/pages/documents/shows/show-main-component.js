const cardTemplate = `
 <div>
    <h1>{{ docname }}</h1>
    <!-- Utilisation de deux v-model avec des noms différents -->
    <div id="general_info">
      <p>Number of dimensions : {{ nbDim }}</p>
      <p>Number of rubrics : {{ nbRub }}</p>
      <p>Number of data chunks : {{ nbData }}</p>
    </div>
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
          nbDim: 0, 
          nbRub: 0, 
          nbData: 0, 
          count: 0, // Compteur initial
          docname: '',
          activeTab: 0, // Pour gérer l'onglet actif
        };
      },
    methods: {
        updateMessage() {
            this.message = 'Le message a changé !';
          },
        async getDocInfo(){
          let infos = await getXmlFromBackend("/api/documents/statistics/"+ this.docname);
          this.nbDim = evaluateXPath(".//nbDim/text()",infos, infos,true,true),
          this.nbRub = evaluateXPath(".//nbRub/text()",infos, infos,true,true),
          this.nbData = evaluateXPath(".//nbData/text()",infos, infos,true,true),
          console.log("infos",infos)
        }
    },
    created() {
        console.log("in the card compoenent")
    },
    mounted(){
       this.docname = document.getElementById('docname').value
       this.getDocInfo()
    }
 };
        
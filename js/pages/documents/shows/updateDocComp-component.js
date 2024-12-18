const updateDocTemplate = `
 <div>
    <h1>{{ docname }}</h1>
    <div id="general_info">
      <p>Number of dimensions : {{ nbDim }}</p>
      <p>Number of rubrics : {{ nbRub }}</p>
      <p>Number of data chunks : {{ nbData }}</p>
    </div>
  </div>
  <v-tabs v-model="activeTab" fixed-tabs>
      <v-tab>Dimensions update</v-tab>
      <v-tab>Rubrics update</v-tab>
    </v-tabs>

  <div v-show="activeTab === 0">
       <dimensionUpdate v-model:fileName="docname" /> 
    </div>
    <div v-show="activeTab === 1">
      <rubricsUpdate v-model:fileName="docname" />
    </div>


`;
const updateDocComponent = {
    name: 'updateDocComponent',
    components: {
        dimensionUpdate,
        rubricsUpdate,
    },
    template: updateDocTemplate,
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

        async getDocInfo(){
          let infos = await getXmlFromBackend("/api/documents/statistics/"+ this.docname);
          this.nbDim = evaluateXPath(".//nbDim/text()",infos, infos,true,true),
          this.nbRub = evaluateXPath(".//nbRub/text()",infos, infos,true,true),
          this.nbData = evaluateXPath(".//nbData/text()",infos, infos,true,true),
          console.log("infos",infos)
        }
    },
    created() {
    },
    mounted(){
       this.docname = document.getElementById('docname').value
       this.getDocInfo()
    }
 };
        
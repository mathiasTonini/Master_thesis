const filtersDataTemplate= `
    <div class="filters_main_div">
      <treeDimensionsComponent :fileName=cleanDocName :selectionnable=2 :initialOpen="true"/>
    </div> 
    <v-divider
      :thickness="8"
      class="border-opacity-75"
      color="info"
    ></v-divider>
    <div
      v-for="(item, index) in chunks"
      :key="index"
      class="data_grid-container"
      :style="{ gridTemplateColumns: 'repeat(' + item.dimensions.length + ', 1fr)' }"
    >
      <chunkComponent  :fileName="cleanDocName" :chunk="item"/>
  </div>

  `;


  const filtersDataComponent = {
    template: filtersDataTemplate,
    name: 'filtersDataComponent',
    props: {
      cleanDocName:{
        type: String,
        required: true
      },
    },
    components: {
      treeDimensionsComponent,
      chunkComponent,
    },
    watch:{

    },
    data() {
        return {
            isOpen: false,
            chunks: [],
            totalLeaves: 0,
            xmlDoc:'',
        }
   },
   provide() {
    // On fournit ula fonction à traiter lorsqu'on appuie sur envoyer
    return {
        sendForm: this.searchWithFilter
    };
  },
   
   computed: {
  },
    methods: {
        toggle() {
            if (this.hasChildren) {
              this.isOpen = !this.isOpen;
            }
          },
        searchWithFilter(items){
          let param = "";
          for (let dimId in items){
            let dimension = dimId;
            let rubRef = '';
            items[dimId].forEach(rubric=>{
              param = param+"DimRef="+dimId+"&RubRef="+rubric.id+"&"
            });
            
          }
          param = param.slice(0,-1);//Remove last "&"
          param = "?fileName="+this.cleanDocName+"&"+param
          let url = "/api/documents/filter-chunks"+param
          this.getData(url)
        },
        async getData(url){
          this.xmlDoc = await getXmlFromBackend(url);
          xmlChunks = evaluateXPath("//Chunk",this.xmlDoc)
          xmlChunks.forEach(chunk => {
            memberships = evaluateXPath(".//Membership",this.xmlDoc, chunk);
            dimensions = [];
            memberships.forEach(membership =>{
              dim = {
                dimRef: evaluateXPath(".//DimId/Id/text()",this.xmlDoc, membership,true,true),
                rubRef: evaluateXPath(".//rubId/Id/text()",this.xmlDoc, membership,true,true),
                dimname: evaluateXPath(".//DimTitle/text()",this.xmlDoc, membership,true,true),
                finalRubricName: evaluateXPath("./RubricName/text()",this.xmlDoc, membership,true,true),
                subRubrics: evaluateXPath("./ParentRubrics/ParentRubric/text()",this.xmlDoc, membership,true),
              };
              dimensions.push(dim);
            });
            data = {
              dimensions: dimensions,
              value: evaluateXPath("./value",this.xmlDoc, chunk,true,true),
            }
            this.chunks.push(data)
          });
        },
      },
    created() {
       
    }
};
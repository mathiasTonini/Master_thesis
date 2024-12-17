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
    <!-- Première ligne : dimnames -->
    <div
      v-for="(dimension, i) in item.dimensions"
      :key="'dimname-' + index + '-' + i"
      class="data_header-cell"
    >
      {{ dimension.dimname }}
    </div>

    <!-- Deuxième ligne : Arbre des subRubrics menant à finalRubricName -->
    <div
      v-for="(dimension, i) in item.dimensions"
      :key="'tree-' + index + '-' + i"
      class="data_content-cell"
    >
      <treeNodeComponent :node="formatTreeItems(dimension)" />
    </div>

    <!-- Dernière ligne : value qui s'étend sur toutes les colonnes -->
    <div
      class="data_value-cell"
      :style="{ gridColumn: 'span ' + item.dimensions.length }"
    >
      {{ item.value }}
    </div>
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
      treeNodeComponent,
      levels: [],
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
          console.log(param)
          let url = "/api/documents/filter-chunks"+param
          this.getData(url)
        },
        async getData(url){
          this.xmlDoc = await getXmlFromBackend(url);
          console.log(this.xmlDoc)
          xmlChunks = evaluateXPath("//Chunk",this.xmlDoc)
          xmlChunks.forEach(chunk => {
            memberships = evaluateXPath(".//Membership",this.xmlDoc, chunk);
            dimensions = [];
            memberships.forEach(membership =>{
              dim = {
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
        formatTreeItems(dimension) {
          const { subRubrics, finalRubricName } = dimension;
      
          let node = {
            label: finalRubricName,
            children: [],
          };
      
          for (let i = subRubrics.length - 1; i >= 0; i--) {
            node = {
              label: subRubrics[i],
              children: [node],
            };
          }
      
          return node;
        },
      },
    created() {
       
    }
};
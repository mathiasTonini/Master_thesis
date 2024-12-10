const dataTemplate = `
<div>
  <addDataComponent :fileName = "cleanDocName" />
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
</div>
`;

const dataComponent = {
    template: dataTemplate,
    name: 'dataComponent',
    props: ['cleanDocName'], 
    components: {
      addDataComponent,
      treeNodeComponent,
    },
    watch: {
        cleanDocName(newVal, oldVal) {
          this.updateData();
        },
      },  
    data() {
        return {
            xmlDoc:'',
            levels: [],
            getDataUrl: '/api/documents/chunks/',
            chunks: [],
            totalLeaves: 0
        }
   },
    methods: {
        async updateData() {
            this.xmlDoc = await getXmlFromBackend(this.getDataUrl+this.cleanDocName);
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
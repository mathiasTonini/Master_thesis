const dataTemplate = `
<div>
  <addDataComponent :fileName = "cleanDocName" />
  <div
    v-for="(item, index) in chunks"
    :key="index"
    class="data_grid-container"
    :style="{ gridTemplateColumns: 'repeat(' + item.dimensions.length + ', 1fr)' }"
  >
    <chunkComponent  :fileName="cleanDocName" :chunk="item"/>
  </div>
</div>

`;

const dataComponent = {
    template: dataTemplate,
    name: 'dataComponent',
    props: ['cleanDocName'], 
    components: {
      addDataComponent,
      chunkComponent,
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
        
      },
    created() {
       
    }
};
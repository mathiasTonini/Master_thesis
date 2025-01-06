const rubricsUpdateTemplate = `
 <div>
    <v-select
    label="Select the dimensions"
    :items="dimensionSelect"
    item-title="Title" 
    item-value="Id"
    v-model="selectedDim"
    @update:modelValue="changeDim"
></v-select>
     <div>
    <h1>Rubric Management</h1>
     <rubricsTree v-model:rubrics="rubrics"  :level="0" @add-sub-rubric="updateRubrics" @deleteRubric="deleteRubric"/>
    </div>
</div>
`;
const rubricsUpdate = {
    name: 'rubricsUpdate',
    components: {
        rubricsTree
    },
    template: rubricsUpdateTemplate,
    props: {
        fileName:{
          type: String,
          required: true
        },
    },
    watch:{
        fileName(newVal, oldVal) {
            this.getDimensions();
          },
    },

    data() {
        return {
          docname: '',
          showButton: 1,
          dimensionSelect :[],
          dimensions: '',
          selectedDim: '',
          rubrics:[],
        };
      },
    methods: {

        async getDimensions(){
            this.dimensions = await getXmlFromBackend("/api/documents/"+this.fileName+"/dimensions")
            dims = evaluateXPath("//Dimension",this.dimensions)
            dims.forEach(dim => {
                this.dimensionSelect.push({
                    Id: evaluateXPath("./Id",this.dimensions, dim,true,true),
                    Title: evaluateXPath("./Title",this.dimensions, dim,true,true)
               })
            });
            console.log("dimensionSelect",this.dimensionSelect)
        },
        changeDim(){
            console.log(this.selectedDim)
            let rubricslist = evaluateXPath("//Dimension[Id = "+this.selectedDim+"]/Rubrics/Rubric",this.dimensions)
            this.rubrics = this.createRubricsObjects(rubricslist)
        },
        createRubricsObjects(rubricslist){
            let rubricsArr = []
            rubricslist.forEach(rub =>{
                let subRub = rub
                let id = evaluateXPath("./Id",this.dimensions,subRub,true,true)
                let title = evaluateXPath("./Title",this.dimensions,subRub,true,true)
                let xrubrics = evaluateXPath("./Rubrics/Rubric",this.dimensions,subRub)
                let rubrics = null;
                if (xrubrics.length > 0){
                    rubrics =  this.createRubricsObjects(xrubrics)
                }
                rubricsArr.push({
                    Id: id,
                    Title: title,
                    Rubrics: rubrics
                })
            })
            return rubricsArr
        },
        updateRubrics(newRubrics,parenId) {
            const urlParams = new URLSearchParams();
            urlParams.append('fileName', this.fileName);
            urlParams.append('data', objectToXml({ Rubric: newRubrics}));
            if (parenId != null){
                urlParams.append('parentId',parenId);
            }
            console.log("Data to send: ",urlParams)
            re = backendPostRequest("/api/addRub",urlParams);
            this.getDimensions();
        },
        deleteRubric(id){
            const urlParams = new URLSearchParams();
            urlParams.append('fileName', this.fileName);
            urlParams.append('rubricId', id)
            re=backendDeleteRequest("/api/deleteRubric/"+this.fileName+"/"+id);
        }
        

    },
    created() {
    },
    mounted(){
    }
 };
        
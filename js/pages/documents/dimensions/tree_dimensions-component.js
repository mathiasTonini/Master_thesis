const treeDimTemplate = `
<v-btn
        color="primary "
        rounded="xl" size="x-large"
        @click="toggleForm"
        class="mb-4 ml-2 mr-2"
    >
     {{ showForm ? 'Hide Form' : formAction }}
</v-btn>
    <div  v-if="showForm" class="add_data_form">
            <v-form>
                <div v-for= "(dimension,index) in dimensions" :key ="dimension.Id" >
                    <treeNodeComponent :node="formatTreeItems(dimension)" :selectionnable=selectionnable :initialOpen="initialOpen"/>
                </div>
            </v-form>
    </div>   
</v-form> 
<v-btn color="green" dark @click=getSelectedRef()>
    <v-icon left>mdi-plus</v-icon>
        Add
</v-btn>
`;

const treeDimensionsComponent ={
    template: treeDimTemplate,
    name: 'treeDimensionsComponent',
    props: {
        fileName:{
          type: String,
          required: true
        },
        formAction:{
            type: String,
            default: 'Show form',
            required: false,
        },
        selectionnable:{
          type: Number, /* 0 => None selectinnable, 1 => only end rubrics, => 2 everything*/
          default: false
        },
        initialOpen:{
            type: Boolean,
            default: false
        }
      },
    components: {
        treeNodeComponent,
    },
    watch: {
        fileName(newVal){
            this.getDimensions();
        },
    },
    data() {
        return {
            dimensions: [],
            xmlDoc:'',
            showForm: false,
            selectedItems: []
        }
    },
    provide() {
        // On fournit une fonction updateSelection pour que les enfants puissent
        // mettre à jour l'état du parent lorsqu'un checkbox change
        return {
          updateSelection: this.onUpdateSelection
        };
      },
    methods: {
        toggleForm() {
            this.showForm = !this.showForm; // Bascule l'affichage du formulaire
        },
        async getDimensions(){
            this.xmlDoc = await getXmlFromBackend('api/documents/dimensions/'+this.fileName);
            dimensions = evaluateXPath("//Dimension",this.xmlDoc)
            dimensions.forEach(dimension => {
                id = evaluateXPath("./Id/text()",this.xmlDoc,dimension,true,true),
                this.dimensions.push({
                    name : evaluateXPath("./Title/text()",this.xmlDoc,dimension,true,true),
                    Id : id,
                    rubrics : this.processRubrics(dimension,id),
                })

            });
            
        },
        processRubrics(node, dimId){
            let rubrics = evaluateXPath("./Rubrics/Rubric",this.xmlDoc,node)
            let tr = []
            if(rubrics.length > 0){
                rubrics.forEach(currentRubric=>{
                    tr.push({
                        Id : evaluateXPath("./Id/text()",this.xmlDoc,currentRubric,true,true),
                        Title : evaluateXPath("./Title/text()",this.xmlDoc,currentRubric,true,true),
                        DimensionId :dimId, 
                        Rubrics: this.processRubrics(currentRubric,dimId),
                })
                })
            
            }
            return tr
        },
        formatTreeItems(dimension) {
            const formatRubrics = (rubrics) => {
            return rubrics.map((rubric) => ({
                label: rubric.Title,
                id: rubric.Id,
                dimId: rubric.DimensionId,
                children: rubric.Rubrics ? formatRubrics(rubric.Rubrics) : [],
            }));
            };
    
            return {
            label: dimension.name,
            id: dimension.Id,
            dimId: dimension.Id,
            children: formatRubrics(dimension.rubrics),
            };
        },
        getSelectedRef(){
            console.log(this.selectedItems)
        },
        onUpdateSelection(node, value) {
            // Logique pour mettre à jour l'état global
            console.log("the node", node)
            console.log("is now:",value)
          },
    },


};
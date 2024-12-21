const addDataTemplate = `
<div class="add_data_main">
     <v-text-field
        v-model="dataValue"
        label="Data value"
        required
    ></v-text-field>
    <treeDimensionsComponent :fileName=fileName :selectionnable=1 :initialOpen="false" />    
</div>
`;
const addDataComponent = {
template: addDataTemplate,
    name: 'addDataComponent',
    props:['fileName'], 
    components: {
        treeDimensionsComponent,
    },
    watch: {
        fileName(newVal, oldVal){
            console.log("fileName changed")
        }
    },
    data() {
        return {
            newData: null,
            xmlDoc:'',
            dataValue: null,
        }
   },
   provide() {
    // On fournit ula fonction à traiter lorsqu'on appuie sur envoyer
    return {
        sendForm: this.addData
    };
  },
    methods: {
          addData(items){
            let content = {
                Value: this.dataValue
            }
            var DimArr = []
            for (let dimId in items){
                rubrics = [];
                Dim ={};
                Dim.DimRef = dimId
                console.log("length: ",items[dimId].length)
                if (items[dimId].length > 1){
                    items[dimId].forEach(rubric=>{
                        let el = "RubRef_$"+rubric.id+"$"
                        Dim[el] =rubric.id
                    })
                }else{
                    Dim["RubRef"] = items[dimId][0].id
                }
                DimArr.push({Dim: Dim})
            }
            chunk = {
                Content: content,
                Membership: DimArr
            }
            console.log("object, ",{ Chunk: chunk })
            console.log('data', objectToXml({ Chunk: chunk }));
            const urlParams = new URLSearchParams();
            urlParams.append('fileName', this.fileName);
            urlParams.append('data', objectToXml({ Chunk: chunk }));
            console.log("Data to send: ",urlParams)
            const redirection = '';
            re = backendPostRequest("/api/add_data",urlParams,redirection);
        },
    },
    created() {
       //this.getDimensions()
    }
};
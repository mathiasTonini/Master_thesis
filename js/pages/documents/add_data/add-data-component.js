const addDataTemplate = `
<div class="add_data_main">
    <treeDimensionsComponent :fileName=fileName :selectionnable=1 :initialOpen="false" />
    
    <v-text-field
        v-model="dataValue"
        label="Data value"
        required
    ></v-text-field>
    <v-btn color="green" dark >
    <v-icon left>mdi-plus</v-icon>
        Add
    </v-btn>
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
    methods: {
          
      },
    
    created() {
       //this.getDimensions()
    }
};
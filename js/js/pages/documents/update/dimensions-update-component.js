const dimensionsUpdateTemplate = `
 <div>
    <div v-show="showButton === 1" >
        <v-btn color="primary" @click="addDimension">
            Add a dimension
        </v-btn>
    </div>
      <v-list>
          <v-list-item>
            <v-text-field
              v-model="dimension.Title"
              label="Dimension name"
            ></v-text-field>

            <v-btn
              color="error"
              icon
              @click="removeDimension()"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

          
          </v-list-item>

          <v-list>
            <newRubricComponent
              :Rubrics="dimension.Rubrics"
              :depth=0
            />
          </v-list>

      </v-list>
      <v-btn
        color="primary"
        @click="addDimToDoc()"
      >
        Add the dimensions
      </v-btn>
</div>
`;
const dimensionUpdate = {
    name: 'dimensionUpdate',
    components: {
        newRubricComponent,
    },
    template: dimensionsUpdateTemplate,
    props: {
        fileName:{
          type: String,
          required: true
        },
    },
    data() {
        return {
          docname: '',
          showButton: 1,
          dimension :{},
        };
      },
    methods: {

        async getDocInfo(){
        },
        addDimension() {
            this.dimension = {
                Id: uuidv4(),
                Title: '',
                Rubrics: [],
            };
            console.log(this.dimension)
            this.showButton = 0;
        },
        addDimToDoc(){
            const urlParams = new URLSearchParams();
            urlParams.append('fileName', this.fileName);
            urlParams.append('data', objectToXml({ Dimension: this.dimension}));
            console.log("Data to send: ",objectToXml({ Dimension: this.dimension }))
            const redirection = "/exist/restxq/demo/documents"
            re = backendPostRequest("/api/add-dimensions",urlParams,redirection);
            console.log(re)
        }

    },
    created() {
    },
    mounted(){

    }
 };
        
const newDocTemplate = `
<v-form ref="form">
      <v-text-field
        v-model="fileName"
        label="Nom du fichier"
        required
        style="position: sticky; top 0;z-index: 1000; overflow: visible;"
      ></v-text-field>

      <v-btn color="primary" @click="addDimension">
        Ajouter une dimension
      </v-btn>

      <v-list>
        <div
          v-for="(dimension, dimIndex) in dimensions"
          :key="dimension.Dimension.id"
          class="mt-4 ml-2 add_dimension"
        >
          <v-list-item>
            <v-text-field
              v-model="dimension.Dimension.Title"
              label="Nom de la dimension"
            ></v-text-field>

            <v-btn
              color="error"
              icon
              @click="removeDimension(dimIndex)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

          
          </v-list-item>

          <v-list>
            <newRubricComponent
              :Rubrics="dimension.Dimension.Rubrics"
              :depth=0
            />
          </v-list>
        </div>
      </v-list>
        <!-- Bouton submit -->
      <v-btn
        color="primary"
        @click="createDoc()"
      >
        Soumettre
      </v-btn>
    </v-form>
`;
const newDocComponent = {
    name: 'newDocComponent',
    components: {
      newRubricComponent,
    },
    template: newDocTemplate,
    data() {
        return {
          fileName: "",
          dimensions : [],
          form: Object
        };
      },
    methods: {
      addDimension() {
        this.dimensions.push({
        Dimension:{
          Id: this.dimensions.length+1,
          Title: '',
          Rubrics: [],
        }  
          
        });
        console.log(this.dimensions)
      },
      
      removeDimension(index) {
        console.log(index)
        this.dimensions.splice(index,1);
      },
      createDoc() {
        // Vérifiez les valeurs du formulaire
        if (this.fileName.trim() === '') {
          console.log('Le formulaire n\'est pas valide');
          return;
        }
        const urlParams = new URLSearchParams();
        urlParams.append('fileName', this.fileName);
        urlParams.append('data', objectToXml({ Dimensions: this.dimensions }));
        console.log("Data to send: ",urlParams)
        const redirection = "/exist/restxq/demo/showdocument/"+this.fileName
        re = backendPostRequest("/api/create-document",urlParams,redirection);
        console.log(re)
      },
      /*async doPost(data){
        const response = await instance.post("/api/create-document",data);
        console.log("Response:", response.data); 
      }*/
      
    },
    created() {
        console.log("in the card compoenent")
    },
 };
        
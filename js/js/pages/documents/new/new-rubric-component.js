const newRubricTemplate = `
 <div v-if="Rubrics.length > 0"
    v-for="(currentRubrique, index) in Rubrics"
    :key="currentRubrique.Rubric.Id"
    :style="{margin: '8px 0 0 '+getRubriqueMl()+'px'}"
    :class="'add_rubric_list'"
   
  >
    <v-list-item>
      <v-text-field
        v-model="currentRubrique.Rubric.Title"
        label="Rubric name"
      ></v-text-field>
     
      <v-btn
        color="error"
        icon
        @click="removeRubrique(index)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-btn
        color="primary"
        @click="addSubRubrique(currentRubrique.Rubric.Rubrics)"
      >
        Add a sub-rubric
      </v-btn>
    </v-list-item>

    <v-list>
      <newRubricComponent
        :Rubrics="currentRubrique.Rubric.Rubrics"
        :depth=depth+1 
      />
    </v-list>
  </div>
    <v-btn v-if="depth==0"
        color="primary"
        @click="addRubrique()"
      >
       Add a rubric
      </v-btn>
  
  `;

  const newRubricComponent = {
    name: 'newRubricComponent',
    components: {
    
    },
    template: newRubricTemplate,
    props: {
      Rubrics: {
        type: Array,
        default: () => []
      },
      depth: {
        type: Number,
        default: 0
      }
    },
    data() {
        return {
        };
      },
    methods: {
      addRubrique() {
        this.Rubrics.push(
          {
            Rubric: {
              Title: 'Default',
              Id: uuidv4(),
              Rubrics: [],
            }
          }
        );
      },

       removeRubrique(index) {
         this.Rubrics.splice(index, 1);
       },
       addSubRubrique(arr){
        arr[arr.length] = {
          Rubric: {
            Title: 'Default',
            Id: Math.random() * 1000,
            Rubrics: [],
          },
        }
       },
       getRubriqueMl(rubrique){
         return ((50*this.depth)+10).toString()
       }
    },
    mounted(){
    },
    created() {
    },
 };
        
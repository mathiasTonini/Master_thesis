const rubricTreeTemplate = `
  <div>
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12" class="rubric-tree-container">
          <v-card outlined class="pa-2">
            <v-card-text>
              <v-list dense>
                <v-list-item
                  v-for="(rubric, index) in rubrics"
                  :key="rubric.Id"
                  :class="\`rubric-level rubric-level-\${level}\`"
                >
                  <v-row align="center">
                    <v-col cols="8">
                      <div class="rubric-title">{{ rubric.Title }}</div>
                    </v-col>
                    <v-col cols="4" class="text-end">
                      <v-btn
                        icon
                        color="primary"
                        @click="toggleAddRubric(index)"
                        title="Add Sub-Rubric"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        color="error"
                        @click="deleteRubric(rubric.Id)"
                        title="Remove Rubric"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <div v-if="showAddRubricIndex === index">
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="newRubricTitle"
                          label="Sub-rubric Title"
                          dense
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn color="primary" @click="addSubRubric(rubric.Id)">
                          Add
                        </v-btn>
                        <v-btn text @click="cancelAddRubric">Cancel</v-btn>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Affichage récursif pour les sous-rubriques -->
                  <rubricsTree
                    v-if="rubric.Rubrics && rubric.Rubrics.length"
                    v-model:rubrics="rubric.Rubrics"
                    :level="level + 1"
                    @add-sub-rubric="propadateAdd"
                    @deleteRubric="deleteRubric"
                  />
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
`;

const rubricsTree = {
    name: 'rubricsTree',
    components:{
        
    },
    template: rubricTreeTemplate,
    props: {
        rubrics: {
          type: Array,
          required: true
        },
        level: {
            type: Number,
            default: 0
        }
        
      },
      data() {
        return {
          showAddRubricIndex: null,
          newRubricTitle: ""
        };
      },
      methods: {
        toggleAddRubric(index) {
          if (this.showAddRubricIndex === index) {
            this.cancelAddRubric();
          } else {
            this.showAddRubricIndex = index;
            this.newRubricTitle = "";
          }
        },
        cancelAddRubric() {
          this.showAddRubricIndex = null;
          this.newRubricTitle = "";
        },
        addSubRubric(parentId) {
          if (!this.newRubricTitle.trim()) return alert("Title cannot be empty!");
          const newRubric = {
            Id: uuidv4(), 
            Title: this.newRubricTitle.trim(),
            Rubrics: []
          };
    
          this.$emit("add-sub-rubric",newRubric, parentId);
    
          // Reset form state
          this.cancelAddRubric();
        },
        // Remove a rubric
        removeRubric(index) {
          this.rubrics.splice(index, 1);
          this.$emit("add-sub-rubric", newRubric, index);
        },
        // Emit event to parent for recursive addition
        addChildRubric(parentId, updatedRubrics) {
          this.$emit("add-sub-rubric", updatedRubrics);
        },
        propadateAdd(newRubric, index){
            this.$emit("add-sub-rubric",newRubric, index);
        },
        deleteRubric(id) {
            this.$emit("deleteRubric", id);
        },

    },
};
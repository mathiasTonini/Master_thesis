const chunkTemplate = `
    <div
      v-for="(dimension, i) in chunk.dimensions"
      :key="'dimname-' + index + '-' + i"
      class="data_header-cell"
    >
      {{ dimension.dimname }}
    </div>

    <!-- Deuxième ligne : Arbre des subRubrics menant à finalRubricName -->
    <div
      v-for="(dimension, i) in chunk.dimensions"
      :key="'tree-' + index + '-' + i"
      class="data_content-cell"
    >
      <treeNodeComponent :node="formatTreeItems(dimension)" />
    </div>

    <!-- Dernière ligne : value qui s'étend sur toutes les colonnes -->
    <div
      class="data_value-cell"
      :style="{ gridColumn: 'span ' + chunk.dimensions.length }"
    >
      {{ chunk.value }}
    </div>
    <div
        class="data_buttons-cell"
        :style="{ gridColumn: 'span ' + chunk.dimensions.length }"
    >
        <button 
             @click="openDeleteModal(index)" 
            class="btn delete-btn"
        >
            Supprimer
        </button>
        <button 
            @click="openUpdateModal(index)" 
            class="btn update-btn"
        >
            Mettre à jour
        </button>
</div>
 <div v-if="showModalDelete" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmation</h3>
        <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        <div class="modal-buttons">
          <button @click="confirmDelete" class="btn delete-btn">Oui, Supprimer</button>
          <button @click="closeDeleteModal" class="btn cancel-btn">Annuler</button>
        </div>
      </div>
    </div>
  </div>
   <div v-if="showUpdateModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Mettre à jour la valeur</h3>
        <input 
          v-model="newValue" 
          type="text" 
          placeholder="Entrez la nouvelle valeur" 
          class="modal-input"
        />
        <div class="modal-buttons">
          <button @click="confirmUpdate" class="btn update-btn">Confirmer</button>
          <button @click="closeUpdateModal" class="btn cancel-btn">Annuler</button>
        </div>
      </div>
    </div>

`;

const chunkComponent ={
    template: chunkTemplate,
    name: 'chunkComponent',
    props: {
        fileName:{
          type: String,
          required: true
        },
        chunk:{
            type: Object,
            required: true
        },
     
    },
    components: {
        treeNodeComponent,
    },
    data() {
        return {
            showModalDelete: false,
            showUpdateModal: false
        }
    },
    methods: {
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
          openDeleteModal(){
            this.showModalDelete = true;
          },
          closeDeleteModal(){
            this.showModalDelete = false;
          },
          openUpdateModal(){
            this.showUpdateModal = true;
          },
          closeUpdateModal(){
            this.showUpdateModal = false;
          },
          confirmDelete(){
            /*for (let dimId in items){
                let dimension = dimId;
                let rubRef = '';
                items[dimId].forEach(rubric=>{
                  param = param+"DimRef="+dimId+"&RubRef="+rubric.id+"&"
                });
                
              }
              param = param.slice(0,-1);//Remove last "&"
              param = "?fileName="+this.fileName+"&"+param
              console.log(param)
            let url = */
            console.log(this.chunk)
          },
          confirmUpdate(){
            //todo
          }
    },
    created() {
       console.log("chunk component",this.chunk)
    }
};
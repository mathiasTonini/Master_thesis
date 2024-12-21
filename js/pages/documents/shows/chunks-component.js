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
            Delete
        </button>
        <button 
            @click="openUpdateModal(index)" 
            class="btn update-btn"
        >
            Update
        </button>
</div>
 <div v-if="showModalDelete" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmation</h3>
        <p>Are you sure to delete this chunk ?</p>
        <div class="modal-buttons">
          <button @click="confirmDelete" class="btn delete-btn"> Delete</button>
          <button @click="closeDeleteModal" class="btn cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
   <div v-if="showUpdateModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Updating data</h3>
        <input 
          v-model="newValue" 
          type="text" 
          placeholder="Enter the new Value" 
          class="modal-input"
        />
        <div class="modal-buttons">
          <button @click="confirmUpdate" class="btn update-btn">Confirm</button>
          <button @click="closeUpdateModal" class="btn cancel-btn">Cancel</button>
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
            showUpdateModal: false,
            newValue: '',
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
            const urlParams = new URLSearchParams();
            urlParams.append('fileName', this.fileName);
            urlParams.append('oldValue',this.chunk.value);
            let memberships =[]
            this.chunk.dimensions.forEach(dim =>{
              let dimMem = dim.dimRef;
              let rubMem = dim.rubRef;
              memberships.push({dimMem,rubMem})
            });
            urlParams.append('$memberships',memberships);
            re = backendPostRequest("/api/deleteChunks",urlParams);
            this.chunk.value = "XXX DELETED";
            this.closeDeleteModal();         
            console.log(this.chunk)
          },
          confirmUpdate(){
            const urlParams = new URLSearchParams();
            urlParams.append('fileName', this.fileName);
            urlParams.append('newValue',this.newValue);
            urlParams.append('oldValue',this.chunk.value);
            let memberships =[]
            this.chunk.dimensions.forEach(dim =>{
              let dimMem = dim.dimRef;
              let rubMem = dim.rubRef;
              memberships.push({dimMem,rubMem})
            });
            urlParams.append('$memberships',memberships);
            re = backendPostRequest("/api/update-value",urlParams);
            this.chunk.value = this.newValue;
            this.closeUpdateModal();
          }

    },
    created() {
       console.log("chunk component",this.chunk)
    }
};
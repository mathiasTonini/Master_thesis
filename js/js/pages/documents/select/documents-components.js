// =================
// Select components
// =================

async function frontendResultDocuments() {
  const local = await backendRequest('/api/documents-list')
  answer = parser.parseFromString(local, 'text/xml')
  documents = answer.evaluate("Documents/document", answer, null, XPathResult.ANY_TYPE, null)
  data = setMembersData(documents)
  return data
}

function setMembersData (nodes) {
  let n = null;
  let t = [];
  while ((n = nodes.iterateNext())) {
    let doc = serializer.serializeToString(n)
    let docNodes = parser.parseFromString(doc, 'text/xml')
    var documents = {
      docname:  
      getTextOf(docNodes.evaluate("document", docNodes, null, XPathResult.ANY_TYPE, null)),
      docId:
      getTextOf(docNodes.evaluate("document", docNodes, null, XPathResult.ANY_TYPE, null))
    }
    t.push (documents)
  };
  return t;
};

async function frontendResultdimVisualization (document) {
  const local = await backendRequest('api/documents/dimensions/'+document)
  answer = parser.parseFromString(local, 'text/xml')
  return answer
};

const selectTemplate = `
<v-select
    label="Select your document"
    :items="documents"
    item-title="docname" 
    item-value="docId"
    v-model="selectedDoc"
    @update:modelValue="changeDoc"
></v-select>
<docPreviewComponent v-model:cleanDocName="cleanDocName"/>`;
const button = `
<v-row class ="mt-5">
  <v-col cols="auto">
    <v-btn
      color="primary"
      size="large"
      @click="showDoc()"
    >
      <v-icon left>mdi-database-search</v-icon>
      Data
    </v-btn>
  </v-col>

  <v-col cols="auto">
    <v-btn
      color="secondary"
      size="large"
      @click="showUpdateDocStructure()"
    >
      <v-icon left>mdi-file-document-edit-outline</v-icon>
      Document structure
    </v-btn>
  </v-col>
  <v-col cols="auto">
  <v-btn
    color="error"
    size="large"
    @click="showDeleteDocumentModal()"
  >
    <v-icon left>mdi-delete-outline</v-icon> 
   Delete Document
  </v-btn>
</v-col>
</v-row>

  <div v-if="showDeleteDocument" class="modal-overlay">
      <div class="modal-content">
        <h3>Delete document</h3>
         <p>Are you sure to delete this document {{selectedDoc}} ?</p>
        <div class="modal-buttons">
          <button @click="confirmDelete" class="btn delete-btn">Confirm</button>
          <button @click="closeDeleteDocumentModal" class="btn cancel-btn">Cancel</button>
        </div>
      </div>
    </div>


`;

const documentTemplate = selectTemplate+ button;

  
const documentsComponent = {
  template: documentTemplate,
  components: {
    docPreviewComponent,
  },
    data() {
      return {
          documents: [
            { docname: 'Document 1', docId: 1 },
            { docname: 'Document 2', docId: 2 },
          ],
          cleanDocName: '',
          selectedDoc: '',
          showDeleteDocument: false,
      }
    },
    methods: {
      async setData() {
        const data = await frontendResultDocuments();
        this.documents = data
      },
    
      extractFileName(path) {
            const parts = path.split('/');
            const fullFileName = parts.pop(); // Cela donne "house-building1.xml"
            const fileNameWithoutExtension = fullFileName.split('.')[0]; // Diviser par '.' et prendre la première partie
            return fileNameWithoutExtension;
       },
       changeDoc() {
         this.cleanDocName = this.extractFileName(this.selectedDoc)
      },
      showDoc(){
        window.location.href = '/exist/restxq/demo/showdocument/'+this.cleanDocName;
      },
      showUpdateDocStructure(){
        window.location.href = '/exist/restxq/demo/updateDocStruct/'+this.cleanDocName;
      },
      closeDeleteDocumentModal(){
        this.showDeleteDocument = false
      },
      showDeleteDocumentModal(){
        this.showDeleteDocument = true
      },
      confirmDelete(){
        console.log("deleteting"+this.cleanDocName)
        let url = "/api/deleteDocument/"+this.cleanDocName;
        re = backendDeleteRequest(url,null);
        window.location.href = '/exist/restxq/demo/documents'
      }
      
    },
    created() {
      this.setData();
    }
};
  
  
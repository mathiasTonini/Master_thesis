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
</v-row>
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
      }
      
    },
    created() {
      this.setData();
    }
};
  
  
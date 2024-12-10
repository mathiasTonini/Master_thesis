            
const documentsFromComponent = {
  'DocumentsSelect': documentsComponent,
}

const vuetify = Vuetify.createVuetify();

const documentsApp = Vue.createApp({

  data() {
    return {
      drawer: false,
      home: 'Home',
      members: 'Members',
      docList: 'Documents',
      group: null,
      open: [''],
      selected : ['Members'],
      selectedDocument:''
    }
  },
              
  computed: {
    oneSelected : function() {
      return this.selected[0];
    },
    componentDoc : function () {
      return documentsFromComponent['DocumentsSelect']
    },
  },
  
  methods: {
    toggleMenu () {
      this.drawer = !this.drawer
    },
  },
  
  created(){

  },
              
})
documentsApp.use(vuetify).mount('#documents-list')
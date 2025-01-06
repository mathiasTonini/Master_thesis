const newDocComponents = {
  'newDocMain': newDocComponent,
}

const vuetify = Vuetify.createVuetify();

const documentsApp = Vue.createApp({

  data() {
    return {
      drawer: false,
      home: 'Home',
      members: 'Members',
      docList: 'Documents',
      newDoc: 'newDoc',
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
    newDocMain : function () {
      return newDocComponents['newDocMain']
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
documentsApp.use(vuetify).mount('#documents-form')
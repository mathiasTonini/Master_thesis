            
const membersComponents = {
  'Members': membersComponent
}

const vuetify = Vuetify.createVuetify();

const membersApp = Vue.createApp({

  data() {
    return {
      drawer: false,
      home: 'Home',
      members: 'Members',
      group: null,
      open: [''],
      selected : ['Members']
    }
  },
              
  computed: {
    oneSelected : function() {
      return this.selected[0];
    },
    componentMembers : function () {
      return membersComponents['Members']
    }
  },
  
  methods: {
    toggleMenu () {
      this.drawer = !this.drawer
    }
  }
              
})
membersApp.use(vuetify).mount('#members')
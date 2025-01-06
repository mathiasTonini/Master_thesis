const homeComponents = {
  'Name': nameComponent,
  'Description' : descriptionComponent,
  'Carousel' : carouselComponent
}

const vuetify = Vuetify.createVuetify();
 
const homeApp = Vue.createApp({
  data() {
    return {
      drawer: false,
      home: 'Home',
      members: 'Members',
      group: null,
      open: [''],
      selected : ['Home']
    }
  },
              
  computed: {
    oneSelected : function() {
      return this.selected[0];
    },
    componentName: function () {
      return homeComponents['Name']
    },
    componentDescription : function () {
      return homeComponents ['Description']
    },
    componentCarousel : function () {
      return homeComponents ['Carousel']
    }
  },
    
  methods: {
    toggleMenu () {
      this.drawer = !this.drawer
    }
  }
              
})
homeApp.use(vuetify).mount('#home')
const filtersDataTemplate= `
    <div class="filters_main_div">
      <treeDimensionsComponent :fileName=cleanDocName :selectionnable=2 :initialOpen="true"/>
    </div> 

  `;


  const filtersDataComponent = {
    template: filtersDataTemplate,
    name: 'filtersDataComponent',
    props: {
      cleanDocName:{
        type: String,
        required: true
      },
    },
    components: {
      treeDimensionsComponent,
    },
    watch:{

    },
    data() {
        return {
            isOpen: false,
        }
   },
   computed: {
  },
    methods: {
        toggle() {
            if (this.hasChildren) {
              this.isOpen = !this.isOpen;
            }
          },

      },
    created() {
       
    }
};
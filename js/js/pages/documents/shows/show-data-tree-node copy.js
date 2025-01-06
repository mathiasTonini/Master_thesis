const treeNodeTemplate= `
<v-list dense class="tree-node">
  <v-list-item
    @click="toggle"
    :class="{ 'tree-node--open': isOpen }"
  >
    <!-- Icone -->
    <v-icon
      v-if="iconName"
      class="tree-node__icon mr-2"
    >
      {{ iconName }}
    </v-icon>

    <!-- Checkbox ou Label -->
    <div class="tree-node__content d-flex align-center">
      <v-checkbox
        v-if="checkbox"
        v-model="isChecked"
        @click="updateCheck()"
        class="mr-2"
        hide-details
      ></v-checkbox>
      <v-list-item-title>{{ node.label }}</v-list-item-title>
    </div>
  </v-list-item>

  <!-- Enfants -->
  <div v-if="isOpen && hasChildren" class="tree-node__children">
    <treeNodeComponent
      v-for="(child, index) in node.children"
      :key="index"
      :node="child"
      :selectionnable="selectionnable"
      :isParentChecked ="isChecked"
      :initialOpen = "initialOpen"
      @update-child-check="updateChildCheck"
    />
  </div>
</v-list>
  `;


  const treeNodeComponent = {
    template: treeNodeTemplate,
    name: 'treeNodeComponent',
    props: {
        node:{
          type: Object,
          required: true
        },
        selectionnable:{  /* 0 => None selectinnable, 1 => only end rubrics, => 2 everything*/
          type: Number,
          default: 0
        },
        isParentChecked:{
          type: Boolean,
          default: false
        },
        initialOpen: { 
          type: Boolean,
          default: false 
        }
      },
      watch: {
        isParentChecked(newVal, oldVal){
          console.log("check children ")
          this.isChecked = newVal;
          this.propagateCheck(this.isChecked)
        },
        initialOpen(newVal) {
          this.isOpen = newVal; // Mettre à jour isOpen quand initialOpen change
        },
        isChecked(newVal) {
          this.updateSelection(this.node, newVal);
        }
    },
    inject: ['updateSelection'], /*From parent => Allows to */
    data() {
        return {
            isOpen: this.initialOpen,
            isChecked: false,
          }
   },
   computed: {
    hasChildren() {
      return this.node.children && this.node.children.length > 0;
    },
    iconName() {
      if (this.hasChildren) {
        return this.isOpen ? 'mdi-folder-open' : 'mdi-folder';
      } else {
        return 'mdi-file';
      }
    },
    checkbox(){
      switch(this.selectionnable){
        case 0:
          return false
        case 1:
          return !this.hasChildren
        case 2:
          return true
        default:
          return false
      }
    },
    isComputedChecked(){
      return this.isChecked
    }
  },
    methods: {
        toggle() {
            if (this.hasChildren) {
              this.isOpen = !this.isOpen;
            }
          },
        updateCheck(){
          console.log("update check")
          this.propagateCheck(this.isChecked);
        },
        propagateCheck(state) {
          if (this.hasChildren) {
            this.node.children.forEach((child) => {
              this.$emit('update-child-check', child, state);
            });
          }
        },
        updateChildCheck(node, state) {
          if (node.label === this.node.label) {
            this.isChecked = state;
          }
        },
      },
    mounted(){
    },
    created() {
      if (this.node.label =="Maçonnerie"){
      }
      
    }
};
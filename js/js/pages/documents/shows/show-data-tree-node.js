const treeNodeTemplate = `
<v-list dense class="tree-node">
  <v-list-item
    @click="toggle"
    :class="{ 'tree-node--open': isOpen }"
  >
    <!-- Icône -->
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
        @click.stop="updateCheck()"
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
      :isParentChecked="isChecked"
      :initialOpen="initialOpen"
      @update-child-check="updateChildCheck"
    />
  </div>
</v-list>
`;

const treeNodeComponent = {
  template: treeNodeTemplate,
  name: 'treeNodeComponent',
  props: {
    node: {
      type: Object,
      required: true
    },
    selectionnable: {
      type: Number,
      default: 0
    },
    isParentChecked: {
      type: Boolean,
      default: false
    },
    initialOpen: {
      type: Boolean,
      default: false
    }
  },
  inject: ['updateSelection'],
  data() {
    return {
      isOpen: this.initialOpen,
      isChecked: false
    };
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
    checkbox() {
      switch (this.selectionnable) {
        case 0:
          return false;
        case 1:
          return !this.hasChildren;
        case 2:
          return true;
        default:
          return false;
      }
    }
  },
  watch: {
    isParentChecked(newVal) {
      this.isChecked = newVal;
      this.propagateCheck(newVal);
    },
    isChecked(newVal) {
      this.updateSelection(this.node, newVal);
      this.propagateCheck(newVal);
    },
    'node.children': {
      handler() {
        if (this.isChecked) {
          this.propagateCheck(true);
        }
      },
      deep: true
    }
  },
  methods: {
    toggle() {
      if (this.hasChildren) {
        this.isOpen = !this.isOpen;
      }
    },
    updateCheck() {
      this.propagateCheck(this.isChecked);
    },
    propagateCheck(state) {
      if (this.hasChildren) {
        this.node.children.forEach((child) => {
          child.isChecked = state; // Mise à jour directe des données de l'enfant
          this.$emit('update-child-check', child, state);
        });
      }
    },
    updateChildCheck(childNode, state) {
      if (this.node === childNode) {
        this.isChecked = state;
      }
    }
  },
  created() {
    this.isChecked = this.isParentChecked;
    this.isOpen = this.initialOpen;
    if (this.isParentChecked) {
      this.propagateCheck(this.isParentChecked);
    }
  }
};

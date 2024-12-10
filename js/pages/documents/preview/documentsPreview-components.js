// =================
// Dimensions preview for docs
// =================


async function frontendResultdimVisualization (document) {
  const local = await backendRequest('api/documents/dimensions/'+document)
  answer = parser.parseFromString(local, 'text/xml')
  return answer
};
const previewTemplate = `
    <div class="grid-container">
      <!-- Parcours des niveaux -->
      <div
        v-for="(items, level) in levels"
        :key="level"
        class="grid-row"
        :style="{ gridTemplateColumns: 'repeat(' + totalColumns + ', 1fr)' }"
      >
        <!-- Parcours des items dans chaque niveau -->
        <div
          v-for="item in items"
          :key="item.Id"
          :class="['grid-cell', { 'first-level-cell': item.isFirstLevel }]"
          :style="{
            gridColumnStart: item.position + 1,
            gridColumnEnd: item.position + 1 + item.colspan,
            backgroundColor: getColor(level, item.dimensionId),

          }"
        >
          <v-card v-if="!item.isEmpty" class="pa-2 ma-0" outlined>
            <v-card-text class="pa-0">{{ item.Title }}</v-card-text>
          </v-card>
          <!-- Cellule vide -->
          <div v-else class="empty-cell"></div>
        </div>
      </div>
    </div>
`;

const docPreviewComponent = {
  template: previewTemplate,
  name: 'docPreviewComponent',
  props: ['cleanDocName'], 
  watch: {
    cleanDocName(newVal, oldVal) {
      this.setPreview();
      console.log(`La prop 'message' a changé de '${oldVal}' à '${newVal}'`);
    },
  },
  data() {
      return {
          xmlDoc:'',
          levels: [],
          totalColumns: 0,
          totalLeaves: 0
      }
 },
    methods: {
      async setPreview() {
          this.levels = [];
          this.totalColumns = 0;
          this.totalLeaves = 0;
          this.xmlDoc = await frontendResultdimVisualization(this.cleanDocName);
          const parserError = this.xmlDoc.getElementsByTagName('parsererror');
          if (parserError.length > 0) {
            console.error('Erreur lors du parsing du XML :', parserError[0].textContent);
            return;
          }
        
          this.levels = [];
        
          const dimensionNodes = this.evaluateXPath('/Dimensions/Dimension', this.xmlDoc);
          if (dimensionNodes.length > 0) {
            dimensionNodes.forEach((dimensionNode) => {
              const idNode = this.evaluateXPath('./Id', dimensionNode)[0];
              const dimensionId = idNode ? idNode.textContent.trim() : 'unknown';
              const result = this.processNodes([dimensionNode], 0, this.totalColumns, dimensionId);
              this.totalColumns += result.totalLeafNodes;
            });
          } else {
            console.error('Aucun noeud Dimensions trouvé dans le XML.');
          }
      },
      evaluateXPath(expression, contextNode) { 
        const xpathResult = this.xmlDoc.evaluate(
          expression,
          contextNode,
          null,
          XPathResult.ORDERED_NODE_ITERATOR_TYPE,
          null
        );
        const nodes = [];
        var node = xpathResult.iterateNext();
        while (node) {
          nodes.push(node);
          node = xpathResult.iterateNext();
        }
        return nodes;
      },
      processNodes(nodes, level, position,dimensionId) {
        if (!nodes || nodes.length === 0) return { totalLeafNodes: 0, maxDepth: level - 1 };
  
        if (!this.levels[level]) {
          this.levels[level] = [];
        }
  
        let totalLeafNodes = 0;
        let maxDepth = level;
  
        nodes.forEach((node) => {
          const idNode = this.evaluateXPath('./Id', node)[0];
          const titleNode = this.evaluateXPath('./Title', node)[0];
          if (idNode && titleNode) {
            const item = {
              Id: idNode.textContent.trim(),
              Title: titleNode.textContent.trim(),
              colspan: 0,
              position: position + totalLeafNodes,
              isFirstLevel: level === 0, 
              dimensionId
            };
  
            const rubricNodes = this.evaluateXPath('./Rubrics/Rubric', node);
            let childResult = { totalLeafNodes: 0, maxDepth: level };
            if (rubricNodes.length > 0) {
              childResult = this.processNodes(rubricNodes, level + 1, item.position,  dimensionId, );
            }
  
            item.colspan = childResult.totalLeafNodes || 1;
            totalLeafNodes += item.colspan;
  
            this.levels[level].push(item);
  
            if (childResult.maxDepth > maxDepth) {
              maxDepth = childResult.maxDepth;
            }
  
            if (rubricNodes.length === 0 && maxDepth > level) {
              for (let l = level + 1; l <= maxDepth; l++) {
                if (!this.levels[l]) {
                  this.levels[l] = [];
                }
                this.levels[l].push({
                  Id: `${item.Id}-empty-${l}`,
                  Title: '',
                  colspan: item.colspan,
                  position: item.position,
                  isEmpty: true,
                  dimensionId: dimensionId, 
                });
              }
            }
          }
        });
  
        return { totalLeafNodes, maxDepth };
      },
      
      getColor(level, dimensionId) {
        const colorPalettes = {
          '1': ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6'], 
          '2': ['#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784'], 
        };
      
        const palette = colorPalettes[dimensionId] || ['#ffffff']; // Palette par défaut si dimension inconnue
      
        return palette[level % palette.length];
      },      
      getImmediateChild(node, tagName) {
        return Array.from(node.childNodes).find(n => n.nodeName === tagName);
      },
      getImmediateChildren(node, tagName) {
        return Array.from(node.childNodes).filter(n => n.nodeName === tagName);
      },
      showDoc(){
        window.location.href = '/exist/restxq/demo/showdocument/'+this.cleanDocName;
      }
      
    },
    created() {
      // this.setPreview();
    }
};
  
  
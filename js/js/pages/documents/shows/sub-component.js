const subTemplate = `
 <div>
    <h2>Composant Enfant</h2>
    <!-- Champs de texte pour chaque variable -->
    <input type="text" :value="message" @input="updateMessage" placeholder="Modifier le message" />
    <input type="number" :value="count" @input="updateCount" placeholder="Modifier le count" />
  </div>
<v-col cols="auto">
  <v-btn icon="mdi-open-in-new" size="large"  @click="showDoc()"></v-btn>
</v-col>
`;

const ChildComponent ={
    name: 'ChildComponent',
    props: ['message', 'count'], // Props pour recevoir les valeurs du parent
    template: subTemplate,
    methods: {
        updateMessage(event) {
          // Émet un événement update:message avec la nouvelle valeur du message
          this.$emit('update:message', event.target.value);
        },
        updateCount(event) {
          // Émet un événement update:count avec la nouvelle valeur du count
          this.$emit('update:count', Number(event.target.value));
        },
        showDoc(){
            console.log(this.message)
        }
      },

};
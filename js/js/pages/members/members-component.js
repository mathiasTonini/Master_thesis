// =================
// Members component
// =================

async function frontendResultMembers() {
  const local = await backendRequest('/api/members')
  answer = parser.parseFromString(local, 'text/xml')
  members = answer.evaluate("AssociationMembers/Member", answer, null, XPathResult.ANY_TYPE, null)
  data = setMembersData(members)
  return data
}

function setMembersData (nodes) {
  let n = null;
  let t = [];
  console.log('doc')
  while ((n = nodes.iterateNext())) {
    let doc = serializer.serializeToString(n)
    let docNodes = parser.parseFromString(doc, 'text/xml')
    var member = {
      firstname:  
      getTextOf(docNodes.evaluate("Member/FirstName", docNodes, null, XPathResult.ANY_TYPE, null)),
      lastname:
      getTextOf(docNodes.evaluate("Member/LastName", docNodes, null, XPathResult.ANY_TYPE, null))
    }
    t.push (member)
  };
  return t;
};
           

const membersTemplate = `
<div>
  <v-data-table density="compact" v-bind:items="members"></v-data-table>
</div>
`;
  
const membersComponent = {
  template: membersTemplate,
    data() {
      return {
          members: [
           {
             firstname: '',
             lastname: ''
           }
          ]
      }
    },
    methods: {
      async setData() {
        const data = await frontendResultMembers();
        this.members = data
      }
    },
    created() {
        this.setData()
    }
  }
// =================
// Name component
// =================

async function frontendResultName() {
  const local = await backendRequest('/api/name')
  answer = parser.parseFromString(local, 'text/xml')
  data = getTextOf(answer.evaluate("Root/Name", answer, null, XPathResult.ANY_TYPE, null))
  return data
}

const nameTemplate = `
<h1>
  Welcome to the association {{name}}
</h1
`;

 const nameComponent = {
    template : nameTemplate,
    data() {
        return {
            name: ''
        }
    },
    methods: {
        async setData() {
            const data = await frontendResultName();
            console.log('data:' + data)
            this.name = data
        }
    },
    created () {
            this.setData ()
        }
  }
  ;
  
// =====================
// Description component
// =====================

async function frontendResultDescription (topic) {
  const local = await backendRequest('/api/description/'+topic)
  answer = parser.parseFromString(local, 'text/xml')
  content = answer.evaluate("Root/*", answer, null, XPathResult.ANY_TYPE, null)
  data = setHTML (content)
  return data
};

const descriptionTemplate = `
<v-sheet class="text-body-2 mx-auto">
    <v-container fluid="">
        <v-row>
            <v-col cols="12" md="6">
                <div v-html="about"></div>
            </v-col>
            <v-col cols="12" md="6">
                <div v-html="activities"></div>
            </v-col>
        </v-row>
    </v-container>
</v-sheet>
`;

 const descriptionComponent = {
    template : descriptionTemplate,
    data() {
        return {
            about: '',
            activities: ''
        }
    },
     methods: {
        async setDataAbout() {
            const data = await frontendResultDescription('about');
            console.log('data:' + data)
            this.about = data
        },
        async setDataActivities() {
            const data = await frontendResultDescription('activities');
            console.log('data:' + data)
            this.activities = data
        }
        
    },
    created () {
            this.setDataAbout (),
            this.setDataActivities ()
        }
    
  }
  ;
  
  
// =====================
// Carousel component
// =====================
  
const carouselTemplate = `
<v-carousel>
  <v-carousel-item src ="http://127.0.0.1:8080/exist/restxq/demo/images/image1.jpg" cover=""/>
  <v-carousel-item src ="http://127.0.0.1:8080/exist/restxq/demo/images/image2.jpg" cover=""/>
  <v-carousel-item src ="http://127.0.0.1:8080/exist/restxq/demo/images/image3.jpg" cover=""/>
</v-carousel>
`;  

const carouselComponent = {
    template : carouselTemplate
  }
;
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
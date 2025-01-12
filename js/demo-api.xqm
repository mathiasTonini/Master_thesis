xquery version "3.1";

module namespace demo-api = "http://demo-api/restxq";

declare namespace rest="http://exquery.org/ns/restxq";
declare namespace http=" http://expath.org/ns/http-client";
declare namespace output="http://www.w3.org/2010/xslt-xquery-serialization";
declare namespace xslfo = "http://exist-db.org/xquery/xslfo";
declare namespace util = "http://exist-db.org/xquery/util";
declare namespace hc = "http://expath.org/ns/http-client";
declare namespace request = "http://exist-db.org/xquery/request";






declare namespace v-on = "http://v-on";
declare namespace v-model = "http://v-model";
declare namespace v-slot = "http://v-slot";
declare namespace v-bind = "http://v-bind";

declare variable $demo-api:base-url := 'http://127.0.0.1:8080/exist/restxq/demo';
declare variable $demo-api:short-url := '/exist/restxq/demo';

(: ========================================================================================================= :)
(:                                      Application pages                                                    :)
(: ========================================================================================================= :)

(: --------------------------------------------------------------------------------------------------------- :)
(:                                      Common parts                                                         :)
(: --------------------------------------------------------------------------------------------------------- :)

declare function local:gen-page-header () as element(){
  <head>
    <title>Demo</title>
    <meta charset="UTF-8"/>
    <link rel="icon" href="data:;base64,iVBORw0KGgo="/>
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet"/>
    <link href=" https://cdn.jsdelivr.net/npm/vuetify@3.5.9/dist/vuetify-labs.min.css " rel="stylesheet"/>
    <script type="application/javascript" src="{$demo-api:base-url}/js/axios.js?path=libraries"></script>
    <script type="application/javascript" src="{$demo-api:base-url}/js/vue.js?path=libraries"></script>
    <script src=" https://cdn.jsdelivr.net/npm/vuetify@3.5.9/dist/vuetify.min.js "></script>
    <script src="https://cdn.jsdelivr.net/npm/uuid@latest/dist/umd/uuidv4.min.js"></script>
    <script type="application/javascript" src="{$demo-api:base-url}/js/core.js?path=pages"></script>
  </head>
};

declare function local:gen-page-menu () as element()* {
(
  <v-app-bar color="indigo">
    <v-app-bar-nav-icon v-on:click="toggleMenu"> </v-app-bar-nav-icon>
    <v-toolbar-title>Dimension Master</v-toolbar-title>
  </v-app-bar>,
  <v-navigation-drawer  v-model = "drawer" temporary="">
    <v-list v-model:opened="open" v-model:selected="selected">
      <v-list-item prepend-icon="mdi-home" title="Home" v-bind:value="home" href="{$demo-api:short-url}/home"></v-list-item>
      <v-list-item prepend-icon="mdi-account" title="Members" v-bind:value="members" href="{$demo-api:short-url}/members"></v-list-item>
      <v-list-item prepend-icon="mdi-account" title="Documents" v-bind:value="docList" href="{$demo-api:short-url}/documents"></v-list-item>
      <v-list-item prepend-icon="mdi-note-plus" title="New document" v-bind:value="newDoc" href="{$demo-api:short-url}/newDoc"></v-list-item>
    </v-list>
  </v-navigation-drawer>
)
};

declare function local:build-chunks($doc as node(), $chunk as node()) as element(Chunk) {
<Chunk>
   <Memberships>
   {
        for $chunkMem in $chunk//Dim
        return
            let $dimension := $doc//Dimension[Id = $chunkMem/DimRef]
              return
                <Membership>
                      <DimId>
                          {$dimension/Id}
                      </DimId>      
                      <DimTitle>
                        {$dimension/Title/text()}
                      </DimTitle>
                      {
                        let $rubric := $dimension//Rubric[Id = $chunkMem/RubRef]
                        return
                          (
                            <rubId>
                                {$rubric//Id}
                            </rubId>,
                            <RubricName>
                              {$rubric/Title/text()}
                            </RubricName>,
                            <ParentRubrics>
                              {
                                for $ancestor in $rubric/ancestor::Rubric
                                return
                                  <ParentRubric>
                                    {$ancestor/Title/text()}
                                  </ParentRubric>
                              }
                            </ParentRubrics>
                          )
                      }
                    </Membership>
              }
              </Memberships>
                <value>
                    {$chunk/Content/Value/text()}
                </value>
    </Chunk>
};




(: --------------------------------------------------------------------------------------------------------- :)
(:                                      Application routes                                                   :)
(: --------------------------------------------------------------------------------------------------------- :)

declare
  %rest:GET
  %rest:path("/demo/home")
  %output:method("html5")
  function demo-api:gen-page-home () as element(){
     <html>
        {local:gen-page-header()}
        <body>
            <div id="home">
                <v-app>
                   {local:gen-page-menu()} 
                    <v-main>
                        <v-container>
                          <component v-bind:is="componentName"></component>
                          <component v-bind:is="componentDescription"></component>
                          <component v-bind:is="componentCarousel"></component>
                        </v-container>
                    </v-main>
                </v-app>
            </div>
            <script>
              {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/home/home-components.js'))}
              {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/home/home-app.js'))}
            </script>
          </body>
          
        </html>
     };
 
 declare
  %rest:GET
  %rest:path("/demo/members")
  %output:method("html5")
 function demo-api:gen-page-members () as element(){
 <html>
    {local:gen-page-header()}
    <body>
        <div id="members">
            <v-app>
                {local:gen-page-menu()}
                <v-main>
                    <v-container>
                        <component v-bind:is="componentMembers"></component>
                    </v-container>
                </v-main>
            </v-app>
        </div>
        <script>
          {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/members/members-component.js'))}
          {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/members/members-app.js'))}
        </script>
      </body>
    </html>
 };
 
  declare
  %rest:GET
  %rest:path("/demo/documents")
  %output:method("html5")
 function demo-api:gen-documents () as element(){
 <html>
    <style>
      {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/document-preview.css'))}
      {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/modal.css'))}
    </style>
    
    {local:gen-page-header()}
    <body>
        <div id="documents-list">
            <v-app>
            
                {local:gen-page-menu()}
                <v-main>
                    <v-container>
                        <component v-bind:is="componentDoc" ></component>
                       
                    </v-container>
                </v-main>
            </v-app>
        </div>
        <script>
          {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/preview/documentsPreview-components.js'))}
          {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/select/documents-components.js'))}
          {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/select/documents-app.js'))}
        </script>
      </body>
     
    </html>
 };
 
declare
  %rest:GET
  %rest:path("/demo/showdocument/{$documentName}")
  %output:method("html5")
 function demo-api:show-document ($documentName as xs:string) as element(){
 <html>
    <style>
       {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/document-preview.css'))}
       {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/data.css'))}
       {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/add_data.css'))}
       {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/tree_node.css'))}
       {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/chunks.css'))}
       {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/modal.css'))}
    </style>
    {local:gen-page-header()}
    <body>
        <div id="document-show">
        <input type="hidden" name="docname" id="docname" value="{$documentName}"/>
            <v-app>   
                {local:gen-page-menu()}
                <v-main>                    
                    <component v-bind:is="showDocMain"></component>
                </v-main>
            </v-app>
        </div>
        <script>
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/shows/show-data-tree-node.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/dimensions/tree_dimensions-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/shows/chunks-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/add_data/add-data-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/filters/filters-data-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/preview/documentsPreview-components.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/shows/show-data-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/shows/show-main-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/shows/showDocuments-app.js'))}       
        </script>
      </body>
     
    </html>
 };
 
 declare
  %rest:GET
  %rest:path("/demo/updateDocStruct/{$documentName}")
  %output:method("html5")
 function demo-api:update-documentStruct ($documentName as xs:string) as element(){
 <html>
    <style>
        {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/new_doc.css'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/update_rubric.css'))}
    </style>
    {local:gen-page-header()}
    <body>
        <div id="document-update">
        <input type="hidden" name="docname" id="docname" value="{$documentName}"/>
            <v-app>   
                {local:gen-page-menu()}
                <v-main>                    
                    <component v-bind:is="updateDocComp"></component>
                </v-main>
            </v-app>
        </div>
        <script>
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/new/new-rubric-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/update/rubrics-tree-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/update/rubrics-update-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/update/dimensions-update-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/shows/updateDocComp-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/shows/updateDocument-app.js'))}       
        </script>
      </body>
     
    </html>
 };
 
 
 
 
declare
  %rest:GET
  %rest:path("/demo/newDoc")
  %output:method("html5")
 function demo-api:new-document () as element(){
 <html>
    <style>
     {util:binary-to-string(util:binary-doc('/db/apps/demo/css/pages/new_doc.css'))}

    </style>
    {local:gen-page-header()}
    <body>
        <div id="documents-form">
            <v-app>   
                {local:gen-page-menu()}
                <v-main>                    
                    <component v-bind:is="newDocMain"></component>
                </v-main>
            </v-app>
        </div>
        <script>
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/new/new-rubric-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/new/new-document-component.js'))}
        {util:binary-to-string(util:binary-doc('/db/apps/demo/js/pages/documents/new/newDocument-app.js'))}       
        </script>
      </body>
     
    </html>
 };

 

(: ========================================================================================================= :)
(:                                      Application API                                                      :)
(: ========================================================================================================= :)


        (: ========================================================================================================= :)
        (:                                      Application API   GET                                                :)
        (: ========================================================================================================= :)



declare
  %rest:GET
  %rest:path("/demo/api/members")
  %output:method("xml")
function demo-api:get-members () {
  local:get-association-members()
};

declare function local:get-association-members () as element() {
   <AssociationMembers>
     {
      for $p in fn:doc ('/db/apps/demo/data/persons.xml')/Persons/Person[Membership]/Id
      let $person := local:get-person ($p)
      return 
        <Member>
          <FirstName>{$person/Name/FirstName/text()}</FirstName>
          <LastName>{$person/Name/LastName/text()}</LastName>
        </Member>
      }
   </AssociationMembers>
};


declare
  %rest:GET
  %rest:path("/demo/api/documents-list")
  %output:method("xml")
function demo-api:documents-list () {
  local:get-documents-list()
};

declare function local:get-documents-list () as element() {
  <Documents>{
      for $doc in collection("/db/apps/demo/data")
        return <document>{base-uri($doc)}</document>
   }</Documents>
};




declare function local:get-person ($Id as xs:positiveInteger) as element () {
    fn:doc ('/db/apps/demo/data/persons.xml')/Persons/Person [Id = $Id]
};

declare
  %rest:GET
  %rest:path("/demo/api/name")
  %output:method("xml")
  function demo-api:get-association-name () as element(){
  let $name := fn:doc('/db/apps/demo/data/info.xml')/Info/Name
  return
    <Root>
      {$name}
    </Root>
      
};

declare
  %rest:GET
  %rest:path("/demo/api/description/{$topic}")
  %output:method("xml")
  function demo-api:get-association-description ($topic) as element(){
  let $path := concat( upper-case(substring($topic,1,1)), substring($topic,2,string-length($topic)) )
  let $content := fn:doc('/db/apps/demo/data/info.xml')/Info/Description/*[name() = $path]
  return
    <Root>
      {transform:transform($content, fn:doc('/db/apps/demo/transfos/pages/home/gen-description.xsl'), ())}
    </Root>
};

declare
  %rest:GET
  %rest:path("/demo/api/documents/dimensions/{$files}")
  %output:method("xml")
  function demo-api:get-dimensions ($files) as element(){
  let $doc := fn:doc(concat(concat("/db/apps/demo/data/",$files),".xml"))
  return
    <Dimensions>
     {$doc//Dimensions/*}
    </Dimensions>
};

declare
  %rest:GET
  %rest:path("/demo/api/documents/chunks/{$files}")
  %output:method("xml")
  function demo-api:get-chunks ($files) as element(Root) {
    let $doc := fn:doc(concat("/db/apps/demo/data/", $files, ".xml"))
    return
      <Root>
        {
          for $chunk in $doc//Information/Chunk
          return
            local:build-chunks($doc, $chunk)
        }
      </Root>
};

declare
  %rest:GET
  %rest:path("/demo/api/documents/filter-chunks")
  %rest:query-param("fileName","{$file}")
  %rest:query-param("DimRef","{$DimRefs}")
  %rest:query-param("RubRef","{$RubRefs}")
  %output:method("xml")
function demo-api:get-filters-chunks(
  $file,
  $DimRefs as xs:string*,
  $RubRefs as xs:string*
) as element()* {

  let $ka := max((count($DimRefs), count($RubRefs)))
  let $pairs := 
    for $i in 1 to $ka
    return map {
      "DimRef": $DimRefs[$i],
      "RubRefs": if (exists($RubRefs[$i])) then $RubRefs[$i] else ()
    }
    (:  On regroupe les éléments ensemble :)
    let $distinct-dimrefs := distinct-values(for $p in $pairs return $p("DimRef"))
    let $rubrefs-by-dimref := 
    for $d in $distinct-dimrefs
        let $all-rubrefs := for $p in $pairs 
                      where $p("DimRef") = $d
                      return $p("RubRefs")
      return map {
        "DimRef": $d,
        "RubRefs": $all-rubrefs
      }
     (: On recherche les Chunks :)  
    let $doc := fn:doc(concat("/db/apps/demo/data/", $file, ".xml"))
    let $filtered-chunks :=
      for $chunk in $doc//Chunk
        where every $dim-group in $rubrefs-by-dimref satisfies (
        let $this-dim := $dim-group("DimRef"),
            $allowed-rubrefs := $dim-group("RubRefs")
        return
        some $dim in $chunk/Membership/Dim satisfies
            ($dim/DimRef = $this-dim and $dim/RubRef = $allowed-rubrefs)
      )
      return $chunk
      return
    <root>
      {for $cleanChunk in $filtered-chunks
        return 
             local:build-chunks($doc, $cleanChunk)
      }
    </root>  
};

declare
  %rest:GET
  %rest:path("/demo/api/documents/statistics/{$fileName}")
  %output:method("xml")
function demo-api:documents-list ($fileName) as element(Root) {
    let $doc := fn:doc(concat("/db/apps/demo/data/", $fileName, ".xml"))
    return 
        <Root>
            <nbDim>{count($doc//Dimension)}</nbDim>
            <nbRub>{count($doc//Rubric)}</nbRub>
            <nbData>{count($doc//Chunk)}</nbData>
        </Root>    
};
declare
  %rest:GET
  %rest:path("/demo/api/documents/{$fileName}/dimensions")
  %output:method("xml")
function demo-api:documents-dimensions ($fileName) as element(Root) {
    let $doc := fn:doc(concat("/db/apps/demo/data/", $fileName, ".xml"))
    return 
        <Root>
            {$doc//Dimension}
        </Root>    
};


        (: ========================================================================================================= :)
        (:                                      Application API   POST                                               :)
        (: ========================================================================================================= :)

declare %rest:POST
        %rest:path("/demo/api/create-document")
         %rest:form-param("fileName","{$file-name}")
         %rest:form-param("data","{$data}")
function demo-api:create-document($file-name,$data) as element() {
    
    let $xml-content := fn:parse-xml(concat("<root><Table>",$data,"<Information></Information></Table></root>"))
    let $content-to-store := $xml-content/root/*
    let $collection := "/db/apps/demo/data"
    let $resource := concat($file-name, ".xml")
    
    let $ignore := xmldb:store($collection, $resource, $content-to-store)
        return
      element response {
        element status {"success"},
        element uri {concat($demo-api:short-url,"showdocument/documentName=", fn:encode-for-uri($file-name))}
      }
};

declare %rest:POST
        %rest:path("/demo/api/add_data")
        %rest:form-param("fileName","{$file-name}")
        %rest:form-param("data","{$data}")
function demo-api:add-data($file-name,$data) as element() {
    let $xml-content := fn:parse-xml(concat("<root>",$data,"</root>"))
    let $content-to-store := $xml-content/root/*
    let $doc := doc(concat("/db/apps/demo/data/", $file-name, ".xml"))
    let $_ := (update insert $content-to-store into $doc//Information)
    return (
        element response {
            element status {"success"},
            element uri {concat($demo-api:short-url,"showdocument/documentName=", fn:encode-for-uri($file-name))}
        }
    )
   
};

declare %rest:POST
        %rest:path("/demo/api/add-dimensions")
        %rest:form-param("fileName","{$file-name}")
        %rest:form-param("data","{$data}")
function demo-api:add-dim($file-name,$data) as element() {
    let $xml-content := fn:parse-xml(concat("<root>",$data,"</root>"))
    let $content-to-store := $xml-content/root/*
    let $doc := doc(concat("/db/apps/demo/data/", $file-name, ".xml"))
    let $_ := (update insert $content-to-store into $doc//Dimensions)
    return (
        element response {
            element status {"success"},
            element uri {concat($demo-api:short-url,"/document", fn:encode-for-uri($file-name))}
        }
    )
   
};


declare %rest:POST
        %rest:path("/demo/api/addRub")
        %rest:form-param("fileName","{$file-name}")
        %rest:form-param("data","{$data}")
        %rest:form-param("parentId","{$parentId}")
function demo-api:addRub($file-name,$data,$parentId) as element() {
    let $xml-content := fn:parse-xml(concat("<root>",$data,"</root>"))
    let $content-to-store := $xml-content/root/*
    let $doc := doc(concat("/db/apps/demo/data/", $file-name, ".xml"))
    let $_ := (update insert $content-to-store into $doc//Rubric[Id=$parentId]/Rubrics)
    return (
        element response {
            element status {"success"}
           
        }
    )
   
};

declare %rest:POST
        %rest:path("/demo/api/update-value")
        %rest:form-param("fileName","{$fileName}")
        %rest:form-param("oldValue","{$oldValue}")
        %rest:form-param("newValue","{$newValue}")
        %rest:form-param("membership","{$memberships}")
function demo-api:updateChunks(
  $fileName,
  $oldValue,
  $newValue,
  $memberships
) as map(*) {

  let $doc := doc(concat("/db/apps/demo/data/", $fileName, ".xml"))
  (:   :let $chunks := $doc//Chunk :)
    let $matchingChunk :=
        for $chunk in $doc//Chunk
          where $chunk/Content/Value = $oldValue
            and (
              every $membership in $memberships satisfies (
                let $parsed := parse-json($membership)
                let $dimMem := $parsed?dimMem
                let $rubMem := $parsed?rubMem
                return exists($chunk//Dim[DimRef = $dimMem and RubRef = $rubMem])
              )
            )
          return $chunk

  return
    if (empty($matchingChunk)) then
      map {
        "status": "error",
        "message": "No matching chunk found."
      }
    else (
    update replace  $matchingChunk/Content/Value with <Value>{$newValue}</Value>,
      map {
        "status": "success",
        "message": "Chunk updated successfully."
      }
    )
};

declare
  %rest:POST
  %rest:path("/demo/api/deleteChunks")
  %rest:form-param("fileName","{$fileName}")
  %rest:form-param("oldValue","{$oldValue}")
  %rest:form-param("membership","{$memberships}")
function demo-api:deleteChunks(
  $fileName,
  $oldValue,
  $memberships
) as element() {
  let $doc := doc(concat("/db/apps/demo/data/", $fileName, ".xml"))
  
  (:   :let $chunks := $doc//Chunk :)
   let $matchingChunk :=
        for $chunk in $doc//Chunk
          where $chunk/Content/Value = $oldValue
            and (
              every $membership in $memberships satisfies (
                let $parsed := parse-json($membership)
                let $dimMem := $parsed?dimMem
                let $rubMem := $parsed?rubMem
                return exists($chunk//Dim[DimRef = $dimMem and RubRef = $rubMem])
              )
            )
          return $chunk

  return
    update delete $matchingChunk,
       element response {
            element status {"Success"}
        }
};





        (: ========================================================================================================= :)
        (:                                      Application API DELETE                                               :)
        (: ========================================================================================================= :)

declare
  %rest:DELETE
  %rest:path("/demo/api/deleteRubric/{$fileName}/{$rubId}")
function demo-api:deleteRubric($fileName,$rubId) as map(*) {
  let $doc := doc(concat("/db/apps/demo/data/", $fileName, ".xml"))
  let $rub := $doc//Rubric[Id=$rubId]
  let $rub-exists-before := exists($rub)    
  let $deleted := (
    if ($rub-exists-before) then (
        update delete $rub,
        not(exists($doc//rubric[Id=$rubId]))  (: Vérifier si le noeud a été supprimé :)
    ) else (
        false()
    )
   )

    return
      if ($deleted) then
        map { "status": 200, "message": "Resource deleted successfully" }
      else
        map { "status": 404, "message": "Resource not found" }
};

declare
  %rest:DELETE
  %rest:path("/demo/api/deleteDocument/{$fileName}")
function demo-api:deleteDoc($fileName) as map(*) {
 
  let $_ := xmldb:remove("/db/apps/demo/data/",concat($fileName,".xml"))
  return
    map { "status": 200, "message": "Resource deleted successfully" }

};







(: ========================================================================================================= :)
(:                                      Resources                                                            :)
(: ========================================================================================================= :)



declare
  %rest:GET
  %rest:path("/demo/js/{$doc-name}")
  %rest:query-param("path", "{$path}")
  %output:method("text")
  %output:media-type("text/javascript")
function demo-api:serve-js($path,$doc-name) {
  util:binary-to-string(util:binary-doc(concat('/db/apps/demo/js/',$path,'/',$doc-name)))
};


declare
  %rest:GET
  %rest:path("/demo/images/{$doc-name}")
  %rest:query-param("path", "{$path}")
  %output:method("binary")
  %output:media-type("image/jpeg")
function demo-api:serve-image($path,$doc-name) {
  util:binary-doc(concat('/db/apps/demo/data/images/',$path,'/',$doc-name))
};
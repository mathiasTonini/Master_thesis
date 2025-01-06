xquery version "1.0";
(: ------------------------------------------------------------------

   Generate all schema to be associated to the resources of the
   application and store them in the database
 
   ------------------------------------------------------------------ :)

(:
@@CV-FIXME: remove files in validation collection before generating updated schemas
let $suppression := xmldb:remove('/db/www/abs/validation/rules','test-sch.sch')
:)

import module namespace xmldb="http://exist-db.org/xquery/xmldb";
import module namespace transform="http://exist-db.org/xquery/transform";

import module namespace globals = "http://oppidoc.com/oppidum/globals" at "../../modules/globals.xqm";


declare option exist:serialize "method=xml media-type=text/xml";

declare function local:gen-definitions-for-writing ($grammar as element()) {
<grammar xmlns="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes">
  {for $d in $grammar//define return $d}
</grammar>
};

declare function local:store-grammars ($grammars as element()) {
<Root xmlns="http://relaxng.org/ns/structure/1.0">
{for $g in $grammars/grammar return
    let $filename := concat(string ($g/@name),'.rng')
    let $schema := 
      <grammar datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes">
        <include href="definitions.rng"/>
        {$g/start}
      </grammar>
    return
      xmldb:store($globals:schema-collection, $filename, $schema)
    }
</Root>
};

let $global-schema := fn:doc($globals:global-schema-resource)
let $all-schema := transform:transform ($global-schema,fn:doc($globals:generate-all-schema-transfo),())

let $stored-definitions := xmldb:store($globals:schema-collection, "definitions.rng", local:gen-definitions-for-writing($all-schema//Definitions))
let $stored-grammars:= local:store-grammars($all-schema//Grammars)

return
<Root/>



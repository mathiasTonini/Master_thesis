xquery version "3.1";

import module namespace schxslt = "https://doi.org/10.5281/zenodo.1495494";
declare namespace svrl = "http://purl.oclc.org/dsdl/svrl";
declare option exist:serialize "method=xml media-type=text/xml";

let $data := 
 <Root>{
   (
   fn:doc('/db/apps/demo/data/info.xml'),
   fn:doc('/db/apps/demo/data/persons.xml')
   )
   }
 </Root>
 

let $transfo := schxslt:compile(fn:doc('/db/apps/demo/validation/rules/association.sch'), (), '2.0') 
let $report := transform:transform($data, $transfo, ())
return
  (
  $report/svrl:failed-assert
  )
 

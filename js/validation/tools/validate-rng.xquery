xquery version "3.1";

declare function local:validate-collection-elements ($collection-path as xs:string, 
                                           $schema-collection-path as xs:string , $schema-document-name as xs:string) {
let $schema := fn:doc(concat($schema-collection-path,'/',$schema-document-name))
return
  for $r in fn:collection($collection-path)/*
  let $report := validation:jing-report($r, $schema)
  return
     if ($report/status='invalid') then
     (
     <Collection>{util:collection-name($r)}</Collection>,
     <Document>{util:document-name($r)}</Document>,
     $report/message
     ) 
     else
       ()
};

declare function local:validate-resource ($collection-path as xs:string, $resource-name as xs:string,
                                          $schema-collection-path as xs:string, $schema-document-name as xs:string) {
let $resource := fn:doc(concat($collection-path,'/',$resource-name))                                        
let $schema := fn:doc(concat($schema-collection-path,'/',$schema-document-name))
return
  let $report := validation:jing-report($resource, $schema)
  return
     if ($report/status='invalid') then
     (
     <Collection>{util:collection-name($resource)}</Collection>,
     <Document>{util:document-name($resource)}</Document>,
     $report/message
     ) 
     else
       ()
};

(
local:validate-resource('/db/apps/demo/data', 'persons.xml','/db/apps/demo/validation/schemas','persons.rng'),
local:validate-resource('/db/apps/demo/data', 'info.xml','/db/apps/demo/validation/schemas','info.rng')
)
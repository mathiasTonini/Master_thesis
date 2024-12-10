xquery version "3.1";

(: --------------------------------------------------------------
   
   Global variables for the application

   -------------------------------------------------------------- :)

module namespace globals = "http://oppidoc.com/oppidum/globals";

declare variable $globals:schema-collection :='/db/apps/demo/validation/schemas';
declare variable $globals:global-schema-resource :='/db/apps/demo/validation/schemas/global-schema.rng';

declare variable $globals:rules-collection :='/db/apps/demo/validation/rules';
declare variable $globals:rules-resource :='/db/apps/demo/validation/rules/association.sch';

declare variable $globals:generate-all-schema-transfo :='/db/apps/demo/validation/tools/generate-all-schema.xsl';





<sch:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:sch="http://purl.oclc.org/dsdl/schematron" queryBinding="xslt2">
    
    <sch:ns uri="http://www.w3.org/2001/XMLSchema" prefix="xs"/>
    
    <sch:title>***** PATTERNS USED FOR CONSISTENCY CHECKING</sch:title>
    
    <sch:pattern id="check-id-uniqueness">
        <sch:p>We do an assumption in terms of design pattern: each element with an Id is repeated under one parent element</sch:p>
        <sch:p>Uniqueness is ckecked in the scope of the parent</sch:p>
        <sch:rule context="Root//*[Id]">
            <sch:let name="theNodeName" value="name()"/>
            <sch:assert test="not(index-of(parent::*/*[name() = $theNodeName]/Id, ./Id) [2])">
                problem with Id <sch:value-of select="./Id"/> for <sch:value-of select="$theNodeName"/>
            </sch:assert>
        </sch:rule>
    </sch:pattern>
    
</sch:schema>
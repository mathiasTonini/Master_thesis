<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ide="http://oppidum.com/ide" version="2.0">
    <xsl:output method="xml"/>
    <xsl:template match="/">
        <Root>
            <Grammars>
                <xsl:apply-templates select="//*[local-name() = 'element'] [@ide:store ='resource']"/>
            </Grammars>
            <Definitions>
                <grammar xmlns="http://relaxng.org/ns/structure/1.0" datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes">
                    <xsl:apply-templates select="//*[local-name() = 'define']"/>
                </grammar>
            </Definitions>
        </Root>
    </xsl:template>
    
    <!--  -->
    <xsl:template match="*[local-name() ='element'] [@ide:store = 'resource']">
        <grammar xmlns="http://relaxng.org/ns/structure/1.0" name="{@ide:resource-name}" datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes">
            <start>
                <element name="{@name}">
                    <xsl:apply-templates select="child::*[not(attribute::ide:store)]"/>
                </element>
            </start>
        </grammar>
    </xsl:template>
    <!--  -->
    <xsl:template match="*[local-name() ='oneOrMore'][parent::*[attribute::ide:store]] [child::*[attribute::ide:store]]"/>
    <xsl:template match="*[local-name() ='zeroOrMore'][parent::*[attribute::ide:store]] [child::*[attribute::ide:store]]"/>
    
    <!--  -->
    <xsl:template match="*[local-name() = 'define']">
        <xsl:copy-of select="."/>
    </xsl:template>
    <!--  -->
    <xsl:template match="*">
        <xsl:element name="{local-name()}" namespace="http://relaxng.org/ns/structure/1.0">
            <xsl:copy-of select="@*"/>
            <xsl:apply-templates select="*"/>
        </xsl:element>
    </xsl:template>
</xsl:stylesheet>
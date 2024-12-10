<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="xs" version="2.0">
    
    <xsl:template match="About | Activities">
        <h2><xsl:value-of select="Title"/></h2>
        <xsl:apply-templates select="Parag"/>
    </xsl:template>
    
    <xsl:template match="Parag">
        <p><xsl:value-of select="."/></p>
    </xsl:template>
    
</xsl:stylesheet>
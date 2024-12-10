<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    
    <!-- Point d'entrée de la transformation -->
    <xsl:template match="/">
        <html>
            <body>
                <table border="1">
                    <!-- Démarre le traitement au niveau des Dimensions -->
                    <xsl:call-template name="process-level">
                        <xsl:with-param name="nodes" select="/Dimensions/Dimension"/>
                    </xsl:call-template>
                </table>
            </body>
        </html>
    </xsl:template>
    
    <!-- Template récursif pour traiter chaque niveau -->
    <xsl:template name="process-level">
        <xsl:param name="nodes"/>
        <!-- Vérifie s'il y a des nœuds à traiter -->
        <xsl:if test="count($nodes) &gt; 0">
            <tr>
                <!-- Parcourt chaque nœud et affiche son Title avec colspan -->
                <xsl:for-each select="$nodes">
                    <!-- Calcul du colspan pour le nœud actuel -->
                    <xsl:variable name="colspan">
                        <xsl:choose>
                            <!-- Si le nœud a des Rubrics, somme les feuilles sous lui -->
                            <xsl:when test="Rubrics">
                                <xsl:value-of select="count(.//Rubric[not(Rubrics)])"/>
                            </xsl:when>
                            <!-- Si pas de Rubrics, colspan est 1 -->
                            <xsl:otherwise>
                                <xsl:value-of select="1"/>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>
                    <td colspan="{$colspan}">
                        <xsl:value-of select="Title"/>
                    </td>
                </xsl:for-each>
            </tr>
            <!-- Collecte les Rubric enfants pour le prochain niveau -->
            <xsl:variable name="next-level-nodes" select="$nodes/Rubrics/Rubric"/>
            <!-- Appel récursif pour traiter le niveau suivant -->
            <xsl:call-template name="process-level">
                <xsl:with-param name="nodes" select="$next-level-nodes"/>
            </xsl:call-template>
        </xsl:if>
    </xsl:template>
    
</xsl:stylesheet>
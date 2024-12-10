<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <!-- Output en HTML -->
  <xsl:output method="html" indent="yes"/>

  <!-- Template racine -->
  <xsl:template match="/">
    <html>
      <head>
        <title>Dimensions</title>
        <!-- Inclure les styles CSS -->
        <style>
        .grid-container-general {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px; /* Espace entre les éléments */
          }
          .grid-container {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 10px;
          }
          .grid-item {
            background-color: #f2f2f2;
            padding: 10px;
            border: 1px solid #ccc;
          }
          .dimension-item{
            background-color: lightblue !important;
            grid-row: 1 / 4;
          }
        </style>
      </head>
      <body>
        <!-- Appel du template pour afficher les dimensions -->
        <div class="grid-container-general">
          <xsl:apply-templates select="/Dimensions/Dimension" mode="dimension"/>
        </div>
      </body>
    </html>
  </xsl:template>

  <!-- Template pour les dimensions -->
  <xsl:template match="Dimension" mode="dimension">
    <!-- Calcul du colspan en fonction du nombre de feuilles -->
    <xsl:variable name="colspan">
      <xsl:choose>
        <xsl:when test="Rubrics/Rubric">
          <xsl:value-of select="count(.//Rubric[not(Rubrics)])"/>
        </xsl:when>
        <xsl:otherwise>1</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <!-- Ajuster le colspan pour la grille (max 12 colonnes) -->
    <xsl:variable name="colsAdjusted">
      <xsl:choose>
        <xsl:when test="$colspan &gt; 12">12</xsl:when>
        <xsl:otherwise><xsl:value-of select="$colspan"/></xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <!-- Affichage de la dimension -->
    <div class="grid-item dimension-item" style=" grid-row: 1 / {$colsAdjusted}">
      <h2><xsl:value-of select="Title"/></h2>
      <div class="grid-container">
      <!-- Appel du template pour afficher les rubriques -->
        <xsl:apply-templates select="Rubrics/Rubric" mode="rubric"/>
      </div>
    </div>
  </xsl:template>

  <!-- Template pour les rubriques -->
  <xsl:template match="Rubric" mode="rubric">
    <!-- Calcul du colspan pour la rubrique -->
    <xsl:variable name="colspan">
      <xsl:choose>
        <xsl:when test="Rubrics/Rubric">
          <xsl:value-of select="count(.//Rubric[not(Rubrics)])"/>
        </xsl:when>
        <xsl:otherwise>1</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <!-- Ajuster le colspan pour la grille -->
    <xsl:variable name="colsAdjusted">
      <xsl:choose>
        <xsl:when test="$colspan &gt; 12">12</xsl:when>
        <xsl:otherwise><xsl:value-of select="$colspan"/></xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <!-- Affichage de la rubrique -->
    <div class="grid-item" style="grid-row: 1 / {$colsAdjusted}">
      <h3><xsl:value-of select="Title"/></h3>
      <!-- Appel récursif si la rubrique a des enfants -->
       <xsl:if test="$colspan &gt; 1">
            <div class="grid-container rubcris-container">
                <xsl:apply-templates select="Rubrics/Rubric" mode="rubric"/>
            </div>
        </xsl:if>  
    </div>
  </xsl:template>

</xsl:stylesheet>
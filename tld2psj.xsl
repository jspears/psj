<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:tag="http://java.sun.com/xml/ns/j2ee"

        >
    <xsl:strip-space elements="*"/>
    <xsl:variable name="lt">
        <xsl:text>&lt;%</xsl:text>
    </xsl:variable>
    <xsl:variable name="gt">
        <xsl:text>%&gt;</xsl:text>
    </xsl:variable>
    <xsl:variable name="qt">"</xsl:variable>
    <xsl:variable name="nl" select="'&#10;'" />
    <xsl:variable name="ws" select="' '"/>

    <xsl:output method="text" indent="no"/>
    <xsl:template match="/">
        <xsl:if test="count(//tag:function) &gt; 0">
            <xsl:document href="./functions.js" method="text" indent="no">

            if (typeof define !== 'function') {
                var define = require('amdefine')(module)
            }
            define(function(){
              var obj = {};
            //content goes here <xsl:value-of select="/tag:uri"/> version <xsl:value-of select="/tag:tlib-version"/>
            <xsl:apply-templates select="//tag:function" mode="func"/>
                return obj;
            });
            </xsl:document>
        </xsl:if>
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="tag:tag">
        <xsl:document href="tld/{tag:name}.tag" method="text" indent="no">
            <xsl:apply-templates/>
            <xsl:value-of select="$lt"/>
            console.log('please implement: "<xsl:value-of select="concat(//tag:uri, ':', tag:name)"/>"');
            <xsl:value-of select="$gt"/>
        </xsl:document>
    </xsl:template>
    <xsl:template match="tag:function" mode="func">
            //<xsl:value-of select="tag:function-class"/>
            //<xsl:value-of select="tag:function-signature"/>
            /*
               EXAMPLE: <xsl:value-of select="tag:example"/>
            */
            obj['<xsl:value-of select="tag:name"/>'] = function(){
                //content goes here
                console.log('<xsl:value-of select="//tag:name"/>:<xsl:value-of select="tag:name"/> is not implemented ');
            }
    </xsl:template>
    <xsl:template match="tag:name"/>
    <xsl:template match="tag:description">
        <xsl:value-of select="concat('', $lt, '--', ., '--', $gt,$nl)"/>
    </xsl:template>
    <xsl:template match="tag:attribute/tag:*">
        <xsl:value-of select="concat(name(),'=',$qt,translate(.,$nl,$ws), $qt, ' ')"/>
    </xsl:template>

    <xsl:template match="tag:attribute">
        <xsl:value-of select="concat('', $lt, '@attribute ')"/>
        <xsl:apply-templates>
            <xsl:sort select="name()" order="descending" />
        </xsl:apply-templates>
        <xsl:value-of select="concat('',$gt,$nl)"/>
    </xsl:template>

    <xsl:template match="tag:body-content | tag:tag-class | tag:tei-class | tag:function-signature | tag:function-class | tag:display-name | tag:uri | tag:validator | text()"/>
    <xsl:template match="*">
        <xsl:message terminate="no">
            WARNING: Unmatched element:
            <xsl:value-of select="name()  "/>
        </xsl:message>

        <xsl:apply-templates/>
    </xsl:template>
    <!-- More stuff to come -->
</xsl:stylesheet>

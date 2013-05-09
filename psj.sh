#!/bin/bash
#Converts TLD's to tag files.
TEMPLATE=$PWD/tld2psj.xsl
TLD_DIR=$1
if [ ! -d $TLD_DIR ]; then
  echo "No META-INF in $TLD_DIR"
  exit 1;s
fi
mkdir tags;
cd tags
for f in $TLD_DIR/META-INF/*.tld; do
  tld=$(basename $f)
  name=${tld%%.tld}
  echo "processing $name $f"
  [ ! -d $name ] && mkdir $name;
  cd $name
  xsltproc $TEMPLATE $f
  cd .. 
done

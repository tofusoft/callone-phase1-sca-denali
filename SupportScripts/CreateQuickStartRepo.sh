#!/bin/bash
PS_SVN_ROOT="https://ps-svn01.corp.netledger.com/svn/SVN-PS"
DENALI_SVN="https://ps-svn01.corp.netledger.com/svn/SVN-PS/Efficiencies/Tags/CommerceApplications/DenaliRelease2"
QUICKSTART_SVN="https://ps-svn01.corp.netledger.com/svn/SVN-PS/Efficiencies/Tags/Quickstarts/Quickstart-1.1.0"
EXPECTED_ARGS=2 #clientname and suitecommerce site name
E_BADARGS=65
CUSTOMER=$1
CUSTOMER_TMP=${CUSTOMER}_tmp
SITE=$2
CUSTOMER_SVN=$PS_SVN_ROOT"/"$CUSTOMER
#
if [[ "$CUSTOMER" =~ [^a-zA-Z0-9_] ]]; then
  echo "Customer name only AZ-az-09_"
fi
if [[ "$SITE" =~ [^a-zA-Z0-9] ]]; then
  echo "SITE only AZ-az-09_"
fi
echo "$CUSTOMER $SITE"
#
if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Usage: $0 clientName SuiteCommerceSiteName"
  exit $E_BADARGS
fi

echo "Checking for existance of $CUSTOMER on SVN"
echo "SVN SERVER ROOT: $PS_SVN_ROOT"
svn info $CUSTOMER_SVN
SVN_EXISTS=$?

if [ $SVN_EXISTS -eq 0 ] 
then
      echo "CUSTOMER ALREADY EXISTS ON THE REPOSITORY"
      echo "$CUSTOMER_SVN"
      echo "ABORTING REPO CREATION"
      exit 1
fi
#
#Check for the folder in your projects folder
if [ -d "$CUSTOMER" ]; then
  echo "YOU SHOULDN'T HAVE THAT CUSTOMER ALREADY CREATED ON YOUR LOCAL PROJECTS FOLDER"
  exit 1
fi

#Check for the folder in your projects folder
if [ -d "$CUSTOMER_tmp_upl" ]; then
  echo "YOU SHOULDN'T HAVE THAT CUSTOMER ALREADY CREATED ON YOUR LOCAL PROJECTS FOLDER"
  exit 1
fi
#
mkdir $CUSTOMER_TMP
mkdir $CUSTOMER_TMP/Main
mkdir $CUSTOMER_TMP/Main/Documentation
mkdir $CUSTOMER_TMP/Main/SuiteScript
mkdir $CUSTOMER_TMP/Main/SuiteCommerce
mkdir $CUSTOMER_TMP/Main/SuiteCommerce/$SITE
mkdir $CUSTOMER_TMP/Main/Test
mkdir $CUSTOMER_TMP/Tags
svn import $CUSTOMER_TMP $CUSTOMER_SVN -m "Creating customer $CUSTOMER repository"
rm -rf $CUSTOMER_TMP


svn co $CUSTOMER_SVN/Main $CUSTOMER

svn export $DENALI_SVN $CUSTOMER/SuiteCommerce/$SITE --force
svn add $CUSTOMER/SuiteCommerce/$SITE/* --force
svn up
svn commit $CUSTOMER/SuiteCommerce/$SITE -m "Denali"
svn export $QUICKSTART_SVN $CUSTOMER/SuiteCommerce/$SITE --force
svn add $CUSTOMER/SuiteCommerce/$SITE/* --force
svn up
svn commit $CUSTOMER/SuiteCommerce/$SITE -m "Quickstart"

cd $CUSTOMER/SuiteCommerce/$SITE
svn propset svn:ignore -RF .svnignore .
svn up
svn commit -m "SVN Ignore Applied"
npm install
echo "ALL COMPLETED!"
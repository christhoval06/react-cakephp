#
# @author: Roberto Conte Rosito
# @description: Questo script ti consente di realizzare una copia ZIP dell'intero pacchetto
# compatibile con piattaforma Amazon Beanstalk.
# 
rm build.zip
mkdir build
cp -a app build/app
cp -a lib build/lib
cp -a .ebextensions build/.ebextensions
cp index.php build/index.php
cp .htaccess build/.htaccess
#echo "Compressing scripts..."
#babel build/app/webroot/js/backend/widgets.js > build/app/webroot/js/backend/widgets.min.js --minified
#rm build/app/webroot/js/backend/widgets.js
#mv build/app/webroot/js/backend/widgets.min.js build/app/webroot/js/backend/widgets.js
#echo "Compressing process completed."
cd build
zip -r ../build.zip ./ -x *.git*
cd ..
rm -r build
echo "Build completed."

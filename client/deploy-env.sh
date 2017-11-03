echo "+-------------------------------------------+"
echo "| BUILDING PRODUCTION CONFIG.               |"
echo "+-------------------------------------------+"
mv src/config/index.js src/config/index-dev.js
mv src/config/index-env.js src/config/index.js
npm run build
sh copy.sh
mv src/config/index.js src/config/index-env.js
mv src/config/index-dev.js src/config/index.js
echo "+-------------------------------------------+"
echo "| Operation completed.                      |"
echo "+-------------------------------------------+"

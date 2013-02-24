#!/bin/bash
mkdir -p build/nctutab/
rm build/nctutab/*

#chrome webstore
zip -r nctutab.zip nctutab/

# JS obfuscation
php5 example-file.php nctutab/cos.js build/nctutab/cos.js 
php5 example-file.php nctutab/portal.js build/nctutab/portal.js 
php5 example-file.php nctutab/regist.js build/nctutab/regist.js 
php5 example-file.php nctutab/bg.js build/nctutab/bg.js  
php5 example-file.php nctutab/ga.js build/nctutab/ga.js 
php5 example-file.php nctutab/nctutab.js build/nctutab/nctutab.js 
php5 example-file.php nctutab/nctutab_cos.js build/nctutab/nctutab_cos.js 
#php5 example-file.php nctutab/cos_refresh.js build/nctutab/cos_refresh.js 
cp nctutab/cos_refresh.js build/nctutab/cos_refresh.js
#php5 example-file.php nctutab/socket.io.js build/nctutab/socket.io.js
php5 example-file.php nctutab/popup.js build/nctutab/popup.js
php5 example-file.php nctutab/nctu.js build/nctutab/nctu.js
php5 example-file.php nctutab/piwik.js build/nctutab/piwik.js

cp nctutab/*.json build/nctutab/
cp nctutab/*.html build/nctutab/
cp nctutab/*.png build/nctutab/

# Compress CSS
php5 css-compress.php nctutab/adSchedule.css build/nctutab/adSchedule.css
php5 css-compress.php nctutab/nctutab.css build/nctutab/nctutab.css
php5 css-compress.php nctutab/reset.css build/nctutab/reset.css

google-chrome --pack-extension=nctutab/ --pack-extension-key=noCatchpa.pem  --no-message-box 


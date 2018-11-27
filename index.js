//Import file URLs
const urlList = require("./urls.json")["urls"];

//Requires
const puppeteer = require('puppeteer');
const sid = require("shortid");
const fs = require("fs-extra");
const idownload = require("image-downloader");

//Parse 
     var dummy = [urlList[0] , urlList[1] , urlList[2]];
     var inited = false;
     //urlList.forEach((url) => {
        (async () => {
         for( var i = 0 ; i < urlList.length ; i++ ){
             var url = urlList[i];
        //---------- BEGIN
            var browser =  await puppeteer.launch();
            var page = await browser.newPage();   
            await page.goto(url);
            var id = sid.generate();
            var category = url.substr(url.lastIndexOf('/')+1 , url.length );
            //create dirs
            fs.ensureDirSync(`./stickers/${category}`);
            var thumb = await page.$$eval('.thumbnail>img' , element => element.map( (ele, index) => { return { imageUrl : `https://devstickers.com/${ele.getAttribute('src')}` , label : ele.getAttribute('alt') } } ))
            var dataSet = thumb.map( (v) => {
                v.id = id;
                v.category = category;
                v.pathLocal = `stickers/${category}/${v.imageUrl.substr(v.imageUrl.lastIndexOf('/')+1, v.imageUrl.length)}`;
                return v;
            })

            //Now that we have the dataset, its time to download the files :) 
            fs.writeFileSync('./stickers/stickers.json' , JSON.stringify(dataSet))
            dataSet.forEach((sticker) => {
                (async() => {
                    var options = {
                        url: sticker.imageUrl,
                        dest: `./stickers/${sticker.category}`
                      };
                      var { filename, image } = await idownload.image(options)
                      console.log(filename)
                })();
                
            })

        //---------- END
    }
        })();
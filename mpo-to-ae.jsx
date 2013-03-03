﻿// {/*************************************************** This script is build to import json data* from http://www.mediaplanungonline.de/* into After Effects****************************************************** Copyright (c)  2013* Fabian "fabiantheblind" Morón Zirfas* Permission is hereby granted, free of charge, to any * person obtaining a copy of this software and associated* documentation files (the "Software"), to deal in the Software* without restriction, including without limitation the rights * to use, copy, modify, merge, publish, distribute, sublicense,* and/or sell copies of the Software, and to  permit persons to * whom the Software is furnished to do so, subject to* the following conditions:* The above copyright notice and this permission notice* shall be included in all copies or substantial portions of the Software.* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF  CONTRACT,* TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTIO* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.** see also http://www.opensource.org/licenses/mit-license.php** Btw: It's awesome that you are reading the source code* feel free to ask me anything about it****************************************************** there are some js libraries used* ----------------------------------------------* a toml (Tom's Obvious, Minimal Language) parser https://github.com/mojombo/toml * by JonAbrams https://github.com/JonAbrams/tomljs* ----------------------------------------------* The JSON utils by douglascrockford are not in use right now* https://github.com/douglascrockford/JSON-js* ----------------------------------------------* JsonDiffPatch by benjamine to get the toml into* our structure* Diff & Patch for JavaScript objects and arrays* (ie. any JSON serializable structure)* https://github.com/benjamine/JsonDiffPatch**************************************************/ImportMPOdata(this);function ImportMPOdata(thisObj){var path = ((File($.fileName)).path);$.evalFile(File(path + '/_libs/toml.js')); // https://github.com/JonAbrams/tomljs$.evalFile(File(path +'/_libs/json2.js')); // https://github.com/douglascrockford/JSON-js$.evalFile(File(path +'/_libs/jsondiffpatch.js')); // https://github.com/benjamine/JsonDiffPatch// this is globalmpo2ae =  {  'version': '0.0',  'json':null,  'pre_articles':[],  'articles':[],  'json_file':null,  'project_folder_on_drive':null,  'project':null,  'toml':null,  'settings':{    /* These are fallback values and will be overwritten / patched in setup from TOML */    'title' : "MPO 2 title fallback",    'projectname' : "MPO import",    'comp':{      'width':1920,      'height':1080,      'duration':20,      'pixelAspect':1,      'frameRate':25,      'layerpresets':{        'image': "_afx/image_fallback.afx",        'price': "_afx/price_fallback.afx",        'title': "_afx/title_fallback.afx",        'text': "_afx/text_fallback.afx",        'background': "_afx/background_fallback.afx"      },      'render':{        'ommodule':"fallback",        'folder':null      }    },    'images':{      'width':1920,      'height':1080,      'duration':20,      'pixelAspect':1,      'frameRate':25,      'layerpresets':{        'item': "_afx/image_item_fallback.afx"      }    }    /* End of TOML data */  }};///   THIS WILL CHECK IF PANEL IS DOCKABLE OR FLAOTING WINDOWvar win   = buildUI(thisObj );if ((win !== null) && (win instanceof Window)) {  win.center();  win.show();} // end if win  null and not a instance of window /** * Build the User Interface * @param  {this} thisObj who knows what this is * @return {Window or Panel} */function buildUI (thisObj ) {    var H = 25; // the height    var W = 30; // the width    var G = 5; // the gutter    var x = G;    var y = G;    var win = (thisObj instanceof Panel) ? thisObj :  new Window('palette', 'example with proto',[0,0,x + W*5 +G , y + H*3 +G*3],{resizeable: true});    if (win !== null) {      win.setup_button = win.add('button',[x,y,x+W*5,y + H], 'Patch w/ Toml');    y+=H+G; // next row    win.import_button = win.add('button',[x,y,x + W*5,y +H],'Import Json');    y+=H+G; // next row    win.run_button = win.add('button', [x,y,x+W*5,y + H], 'Run');    // win.run_button.onClick = function(){    //   build_comps();    // };    win.run_button.addEventListener ("click", function (k) {      if (k.altKey) {        // alert ("Alt key pressed.");        // app.project.consolidateFootage(); // not good        build_comps();      }else{        // alert('alt key not pressed');        build_comps();      }    });    win.setup_button.onClick = function  () {      var tomltxt = readfile('toml');      if(tomltxt !==null){        // diff and patch the settings        //         mpo2ae.toml = TOML.parse(tomltxt);        var delta = jsondiffpatch.diff(mpo2ae.settings, mpo2ae.toml);        // alert(delta.toSource());        jsondiffpatch.patch(mpo2ae.settings, delta);        // alert(mpo2ae.settings.toSource());      }    };    // gonna use a custom function.    // You can alt click the import button to import into the current    // This is still a hidden feature and its only for coders ;)    // project. But it still will save it    win.import_button.addEventListener ("click", function (k) {      if (k.altKey) {        // alert ("Alt key pressed.");        mpo2ae.project = app.project;        import_data();      }else{        // alert('alt key not pressed');        alert('I will try to create a new project. Please save the old one.\n'+          '');        mpo2ae.project = app.newProject();        alert('the new project should be located next to your .json file and your "files" folder. Please save it too');        mpo2ae.project.save();        if(mpo2ae.project !== null){          import_data();        }else{          alert('I need to create a new project.\nPlease save your old one');        }      }    });  }  return win;}  //     _______   ______     __  ______  //    / ____/ | / / __ \   / / / /  _/  //   / __/ /  |/ / / / /  / / / // /  //  / /___/ /|  / /_/ /  / /_/ // /  // /_____/_/ |_/_____/   \____/___/function build_comps () {  alert("in build comps");  app.beginUndoGroup('MPO build comps');  if(mpo2ae.articles.length > 1){    for(var i = 0 ; i < mpo2ae.articles.length;i++){      var art = mpo2ae.articles[i];      var curComp = mpo2ae.project.items.addComp(        mpo2ae.settings.projectname + " " + art.nr,        mpo2ae.settings.comp.width,        mpo2ae.settings.comp.height,        mpo2ae.settings.comp.pixelAspect,        mpo2ae.settings.comp.duration,        mpo2ae.settings.comp.frameRate);        curComp.parentFolder = art.folder;        var imgComp = mpo2ae.project.items.addComp(        "Images " + art.nr,        mpo2ae.settings.images.width,        mpo2ae.settings.images.height,        mpo2ae.settings.images.pixelAspect,        mpo2ae.settings.images.duration,        mpo2ae.settings.images.frameRate);        imgComp.parentFolder = art.folder;        for(var j = 0; j < art.footage.length;j++){          var imgLyr = imgComp.layers.add(art.footage[j]);          if(j !== 0){            imgLyr.enabled = false;          }        }        curComp.layers.add(imgComp);        art.imgcomp = imgComp;        art.comp = curComp;    } // end i loop mpo2ae.articles  }else{    alert("There are no articles imported. Maybe you should import some JSON data first?\n"+      "Make shure your .aep, .json and .toml file are on the same level.\n"+      "Place the downloaded files folder into the same folder. it should look like this:\n"+      "----------------\n"+      "settings.toml\n"+      "working.aep\n"+      "mpo.json\n"+      " |-files\n"+      " |---7102_stanton\n"+      " |---7240_vestax\n"+      " |---8787_lividinstruments");  }  app.endUndoGroup();}/** * basic file reading function * @param  {String} type the type of file * @return {String or null} */function readfile(type){  var file_to_read = File.openDialog("Select a "+type+" file to import.", "*."+type,false);  var txt = null;  if (file_to_read !== null) {    file_to_read.open('r','TEXT','????');    txt = file_to_read.read();    file_to_read.close();  }  if(txt !== null){    return txt;  }else{    alert('Error reading file');    return null;  }}/** * This imports data from a json file provided by * mediaplanungonline.de * It depends on that data structure * * @todo Fix MPO bild Array and Object bug * @todo fix @attributes name * * @return {nothing} sets a global object */function import_data(){  app.beginUndoGroup('MPO import');  // "in function main. From here on it is a straight run"  var jsonFile = File.openDialog("Select a JSON file to import.", "*.*",false);  // var path = ((new File($.fileName)).path);  if (jsonFile !== null) {    mpo2ae.project_folder_on_drive = jsonFile.parent;    var textLines = [];    jsonFile.open("r", "TEXT", "????");    while (!jsonFile.eof){    textLines[textLines.length] = jsonFile.readln();  }  jsonFile.close();  var str = textLines.join("");  var reg = new RegExp("\n|\r","g");  str.replace (reg, " ");    // var reghack = new RegExp('"@a','g');    // str.replace(reghack, '"a');    mpo2ae.json = eval("(" + str + ")"); // evaluate the JSON code    if(mpo2ae.json !==null){      // alert('JSON file import worked fine');      // alert(mpo2ae.json);      mpo2ae.pre_articles = mpo2ae.json.seite.artikel;      $.write(mpo2ae.pre_articles.toSource());      if(mpo2ae.pre_articles.length > 0){      // get all folders. so we dont duplicate      //      // ------------------------      var allfolders = [];      var projItems = app.project.items;      for(var f = 1; f <= projItems.length;f++){        if (projItems[f] instanceof FolderItem){          allfolders.push(projItems[f]);        }      }      // End Of Folder Collecting       // ------------------------        // alert('Found ' + mpo2ae.pre_articles.length + ' pre_articles');        for(var i = 0; i < mpo2ae.pre_articles.length;i++){          var article = mpo2ae.pre_articles[i];          var artfolder = null;          var artimages = [];          var artnr  = null;          var artprice = null;          var arttxt = null;          var artname = null;          var artdiscr = null;          var artbrand = null;          var artfootage = [];          if(article.hasOwnProperty('artikelInformation')){            ainfo = article.artikelInformation;            if(ainfo.hasOwnProperty('iArtikelNr')){              // artnr = ainfo.iArtikelNr;              // ------------ loop all folders per article ------------              for(var ff = 0; ff < allfolders.length;ff++){                if(allfolders[ff].name == ainfo.iArtikelNr){                  artfolder = allfolders[ff];                  break;                }              } // close ff loop              // ------------ end loop all folders per article ------------              if(artfolder === null){                artfolder = mpo2ae.project.items.addFolder(ainfo.iArtikelNr);              } // close artfolder null            }// close iArtikelNr check            if(ainfo.hasOwnProperty('iHersteller')){              artbrand = ainfo.iHersteller;            }          } // close artikelInformation check          if(article.hasOwnProperty('preis')){            artprice = article.preis;          }          if(article.hasOwnProperty('textPlatzieren')){            if(article.textPlatzieren.hasOwnProperty('artikelBezeichnung')){              artname = article.textPlatzieren.artikelBezeichnung;            }            if(article.textPlatzieren.hasOwnProperty('artikelBeschreibung')){              artdiscr = article.textPlatzieren.artikelBeschreibung;            }            if(article.textPlatzieren.hasOwnProperty('artikelText')){              arttxt = article.textPlatzieren.artikelText;            }            if(article.textPlatzieren.hasOwnProperty('artikelNr')){              artnr = article.textPlatzieren.artikelNr;            }          }// ------------ this is start folder creation and image import ------------          if(artfolder !== null){            if(article.hasOwnProperty('bild')){              if( Object.prototype.toString.call( article.bild ) === '[object Array]' ) {                // article.bild is an array                // lets loop it                for(var j =0;j < article.bild.length;j++){                  if(article.bild[j].hasOwnProperty('@attributes')){                    var imgpath = article.bild[j]['@attributes'].href.substring(8);                    artimages.push(imgpath);                  }// article bild is an Array attributes close                } // close J Loop              }else{                // now this is an error in the JSON                // the property 'bild' comes as Array OR Object                // we need to fix that                if(article.bild.hasOwnProperty('@attributes')){                  artimages.push(article.bild['@attributes'].href.substring(8));                } // article bild is an object attributes close              }// close Object.prototype.toString.call( article.bild )              // alert( mpo2ae.project_folder_on_drive.fullName + "\n" + artimages);              for(var ig = 0; ig < artimages.length;ig++){                var a_img = File( mpo2ae.project_folder_on_drive.fsName + "/" + artimages[ig]);                if(a_img.exists){                var footageitem  = mpo2ae.project.importFile(new ImportOptions(File(a_img)));                footageitem.parentFolder = artfolder;                artfootage.push(footageitem);                }else{                  artfootage.push(null);                } // close else image does not exist on HD              } // end of ig loop artimages            }else{              // artile has no property 'bild'              alert('There are no images on article ' + ainfo.iArtikelNr);            }// ------------ end of folder creation an image import ------------          }else{            // it was not possible to create folders            // neither from the names nor did they exist            alert('Error creating folder for import');          }          // now we got all info togther and everything is checked          // we create an cleaned object with the props we need          // for later usage          var art = new Article();          art.nr = artnr;          art.folder = artfolder;          // art.images = artimages;          art.price = artprice;          art.txt = arttxt;          art.name = artname;          art.discr = artdiscr;          art.brand = artbrand;          art.footage = artfootage;          mpo2ae.articles.push(art);        } // close mpo2ae.pre_articles loop i      }else{        alert('There are no pre_articles in the json file');      }    }else{      alert('JSON file is null. Error importing');    }  }else{    alert('User stoped import');  }    // return obj;  alert(mpo2ae.articles.toSource());  app.endUndoGroup();  } // end of import_data// ------------ END IMPORT JSON DATA ------------/** * The Article Object * right now only storage */function Article(){          this.nr  = null;          this.folder = null;          // this.images = [];          this.price = null;          this.txt = null;          this.name = null;          this.discr = null;          this.brand = null;          this.footage = [];          this.comp = null;          this.imgcomp = null;          this.rqitem = null;} } // close ImportMPOdata// }
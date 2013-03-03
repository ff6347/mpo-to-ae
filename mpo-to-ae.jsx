// {

// This script is build to import json data
// from http://www.mediaplanungonline.de/
// into After Effects
// Copyright (c)  2013
// Fabian "fabiantheblind" Morón Zirfas
// Permission is hereby granted, free of charge, to any 
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights 
// to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to  permit persons to 
// whom the Software is furnished to do so, subject to
// the following conditions:
// The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF  CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTIO
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// see also http://www.opensource.org/licenses/mit-license.php

// Btw: It's awesome that you are reading the source code
// feel free to ask me anything about it





ImportMPOdata(this);


function ImportMPOdata(thisObj){

var path = ((new File($.fileName)).path);

$.evalFile(File(path+ '/_libs/toml.js')); // https://github.com/JonAbrams/tomljs
$.evalFile(File('_libs/json2.js')); // https://github.com/douglascrockford/JSON-js
$.evalFile(File('_libs/jsondiffpatch.js')); // https://github.com/benjamine/JsonDiffPatch

// this is global
mpo2ae =  {
    'version': '0.0',
    'json':null,
    'articles':[],
    'json_file':null,
    'project_folder_on_drive':null,
    'project':null,
    'toml':null,
    'settings':{
    /* These are fallback values and will be overwritten in setup from TOML */
    'title' : "MPO 2 ARISINGE fallback",
    'projectname' : "fallbackname",
    'comp':{
        'width':1920,
        'height':1080,
        'duration':20,
        'layerpresets':{
        'image': "_afx/image_fallback.afx",
        'price': "_afx/price_fallback.afx",
        'title': "_afx/title_fallback.afx",
        'text': "_afx/text_fallback.afx",
        'background': "_afx/background_fallback.afx"
        },
        'render':{
            'ommodule':"fallback"
        }
    }
/* End of TOML data */
    }

};


///   THIS WILL CHECK IF PANEL IS DOCKABLE OR FLAOTING WINDOW
var win   = buildUI(thisObj );
if ((win !== null) && (win instanceof Window)) {
    win.center();
    win.show();
} // end if win  null and not a instance of window 

 function buildUI (thisObj ) {

        var H = 25; // the height
        var W = 30; // the width
        var G = 5; // the gutter
        var x = G;
        var y = G;

    var win = (thisObj instanceof Panel) ? thisObj :  new Window('palette', 'example with proto',[0,0,x + W*5 +G , y + H*3 +G*3],{resizeable: true});

    if (win !== null) {
        win.setup_button = win.add('button',[x,y,x+W*5,y + H], 'Setup & Patch');
        y+=H+G; // next row
        win.import_button = win.add('button',[x,y,x + W*5,y +H],'Import Json');
        y+=H+G; // next row
        win.run_button = win.add('button', [x,y,x+W*5,y + H], 'Run');

        win.run_button.onClick = function(){
            // build_comps();
        };

        win.setup_button.onClick = function  () {
            var tomltxt = readfile('toml');
            if(tomltxt !==null){
                // diff and patch the settings
                // 
                mpo2ae.toml = TOML.parse(tomltxt);
                var delta = jsondiffpatch.diff(mpo2ae.settings, mpo2ae.toml);
                // alert(delta.toSource());
                jsondiffpatch.patch(mpo2ae.settings, delta);
                // alert(mpo2ae.settings.toSource());
            }
        };

        // win.import_button.onClick = function  () {
        //     alert('alt is pressed' + altpressed);
        //     if(mpo2ae.project !== null){

        //         import_data();
        //     }else{
        //         // alert('I need to create a new project.\nPlease save your old one');
        //     }
        // };

        // gonna use a custom function. You can alt click the import button to import into the current
        // project. But it still will save it
        win.import_button.addEventListener ("click", function (k) {
            if (k.altKey) {
                // alert ("Alt key pressed.");
                mpo2ae.project = app.project;
                import_data();

            }else{
                // alert('alt key not pressed');
                alert('I will try to create a new project. Please save the old one.\n'+
                    '');
                mpo2ae.project = app.newProject();
                alert('the new project should be located next to your .json file and your "files" folder. Please save it to');
                mpo2ae.project.save();
                if(mpo2ae.project !== null){
                import_data();
                }else{
                alert('I need to create a new project.\nPlease save your old one');
            }

            }
        });
    }
    return win;
}


function build_comps () {

}

function readfile(type){
    var file_to_read = File.openDialog("Select a "+type+" file to import.", "*."+type,false);
    var txt = null;
        if (file_to_read !== null) {
            file_to_read.open('r','TEXT','????');
            txt = file_to_read.read();
            file_to_read.close();
        }
    if(txt !== null){
        return txt;
    }else{
        alert('Error reading file');
        return null;
    }
}

function import_data(){
    // "in function main. From here on it is a straight run"
  var jsonFile = File.openDialog("Select a text file to import.", "*.*",false);
  // var path = ((new File($.fileName)).path);
      if (jsonFile !== null) {
          mpo2ae.project_folder_on_drive = jsonFile.parent;

        var textLines = [];
        jsonFile.open("r", "TEXT", "????");
        while (!jsonFile.eof){
            textLines[textLines.length] = jsonFile.readln();
            }
        jsonFile.close();

        var str = textLines.join("");
        var reg = new RegExp("\n|\r","g");
        str.replace (reg, " ");
        mpo2ae.json = eval("(" + str + ")"); // evaluate the JSON code
        if(mpo2ae.json !==null){
            alert('JSON file import worked fine');
            // alert(mpo2ae.json);
            mpo2ae.articles = mpo2ae.json.seite.artikel;
            if(mpo2ae.articles.length > 0){
                alert('Found ' + mpo2ae.articles.length + ' articles');

            }else{
                alert('There are no articles in the json file');
            }
        }else{
            alert('JSON file is null. Error importing');
            }
        }else{
            alert('User stoped import');
        }
        // return obj;
    } // end of import_data

 } // close ImportMPOdata

// }
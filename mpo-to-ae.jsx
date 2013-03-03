{
run_script(this);

function run_script(thisObj){

// this is global
mpo2ae =  {
  setting1 : false,
  setting2 : false,
  myArray :[],
  counter : 0
};


///   THIS WILL CHECK IF PANEL IS DOCKABLE OR FLAOTING WINDOW  
var win   = buildUI(thisObj );
if ((win != null) && (win instanceof Window)) {
    win.center();
    win.show();
}; // end if win  null and not a instance of window 

 function buildUI (thisObj  ) {
    var win = (thisObj instanceof Panel) ? thisObj :  new Window('palette', 'example with proto',[0,0,150,260],{resizeable: true}); 

    if (win != null) {
    
        var H = 25; // the height
        var W1 = 30; // the width
        var G = 5; // the gutter
        var x = G; 
        var y = G;
        // var yuioff = G; // and some offset

        win.check_box = win.add('checkbox',[x,y,x+W1*2,y + H],'check');
        win.check_box.value = metaObject.setting1;
        win.clear_button = win.add('button', [x + W1*2 -G*2,y,x+W1*5,y + H], 'clear Array');
        win.up_button = win.add('button', [x + W1*5+ G,y,x + W1*6,y + H], 'Up'); 

        win.check_box.onClick = function (){
            alert("check");
        };
        win.up_button.onClick = function () {
            metaObject.myArray.push(metaObject.counter);
        }
        win.clear_button.onClick = function(){
    main();
      };

    }
    return win
}


function main(){
// "in function main. From here on it is a straight run"
};
 };// close run_script

}
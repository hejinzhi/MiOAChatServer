var fs = require('fs');
var rOption={
    flags:"r",
    encoding:'base64',
    mode:0666
}

var wOption = {
  flags: 'a',
  encoding: 'base64',
  mode: 0666
}
var fileReadStream=fs.createReadStream('D:/111.jpg',rOption);
var fileWriteStream = fs.createWriteStream('D:/github/shunda/public/254.jpg',wOption);

fileReadStream.on('data',function(data){
    fileWriteStream.write(data);
});

fileReadStream.on('end',function(){
    console.log("readStream end");
    fileWriteStream.end();
});

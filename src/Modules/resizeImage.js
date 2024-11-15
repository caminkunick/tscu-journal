const resizeImage = (file,max=2048,size=5) => {
  return new Promise(resolved=>{
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (event)=>{
      var blob = new Blob([event.target.result]);
      window.URL = window.URL||window.webkitURL;
      var blobURL = window.URL.createObjectURL(blob);
      var image = new Image();
      image.src = blobURL;
      image.onload = ()=>{
        var canvas = document.createElement('canvas');
        var width = image.width;
        var height = image.height;
        if(width>max||height>max){
          if(width>height){
            width=Math.round(width*=max/height);
            height=max
          }else{
            height=Math.round(height*=max/width);
            width=max
          }
          if(width>image.width || height>image.height){ width = image.width; height = image.height; }
        }
        canvas.width=width;
        canvas.height=height;
        var ctx=canvas.getContext("2d");
        ctx.drawImage(image,0,0,width,height);
        var qt = 1;
        let resized;
        do{
          resized = canvas.toDataURL("image/jpeg",qt);
          qt -= 0.01;
        } while (resized.length>(size*1024*1024) && qt>0.05);
        resolved(resized)
      }
    }
  })
}

export default resizeImage;
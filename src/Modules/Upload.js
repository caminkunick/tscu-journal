import axios from 'axios';

const uploadUrl = "//bucket.phra.in/";

const uploading = (uploadUrl, data, config) => {
  return new Promise((resolved)=>{
    axios.post(uploadUrl, data, config)
      .then(result=>resolved(result.data))
      .catch(err=>resolved({ error:err }))
  })
}

const UploadFile = async (file, callbackProgress) => {
  const data = new FormData();
  data.append('upload', file);
  const config = {
    onUploadProgress: progressEvent => {
      let progress = progressEvent.loaded / progressEvent.total * 100;
      progress = (progress.toFixed(2)-Math.floor(progress)>0) ? parseFloat(progress.toFixed(2)) : progress;
      callbackProgress(progress);
    }
  };
  let result = await uploading(uploadUrl, data, config);
  let times = 1;
  while(result.error && times<5){
    result = await uploading(uploadUrl, data, config);
    times++;
  }
  return result
};

export {
  UploadFile,
};
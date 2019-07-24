import TopicsLoadData from '@modules/topics/load-data';

export default (params: any) => {
  return new Promise(async resolve => {

    TopicsLoadData(params)
    .then(()=>{
      resolve({ code:200 });
    }).catch(()=>{
      resolve({ code:200 });
    });

  });
}

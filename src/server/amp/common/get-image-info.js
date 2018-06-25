import request from 'request'

const getImageInfo = (arr) => {

  return new Promise((resolve, reject) => {

    let list = [];

    arr.map(item=>{
      list.push(new Promise(resolve => {

        request.get(item+'?imageInfo', {}, (error, response, body = {}) => {

          if (body) {
            try {
              body = JSON.parse(body)
            } catch(err) {
              body = {
                width: 600,
                height: 400
              }
            }
          }

          body.width = body.width || 600
          body.height = body.height || 400

          body.format = 'jpeg'
          body.format = item

          resolve([ null, body ])
        })

      }))
    })

    Promise.all(list).then(value=>{


      console.log(value);
      // resolve({ code:200 });
    });

  });


}

export default getImageInfo

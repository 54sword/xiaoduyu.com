import { RouterContext, match } from 'react-router'
import crateRoutes from '../../src/routes'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import express from 'express'
import configureStore from '../../src/store/configureStore'
import { renderToString } from 'react-dom/server'
// renderToStaticMarkup
import { Provider } from 'react-redux'
import React from 'react'
// import path from 'path';
// import fs from 'fs';
import axios from 'axios'
import DocumentMeta from 'react-document-meta'

const serverRender = express.Router()

import config from '../../config'

function getReduxPromise(props, store, callback) {

  let comp = props.components[props.components.length - 1].WrappedComponent;
  comp = comp.defaultProps.component

  if (comp.loadData) {

    if (process.env.NODE_ENV == 'development') console.log('获取数据')

    comp.loadData({ store, props }, (notFound)=>{
      if (process.env.NODE_ENV == 'development') console.log('获取成功')
      callback(notFound)
    })

  } else {
    callback()
  }

}

const authAccessToken = (accessToken, callback)=> {

  if (!accessToken) {
    callback(false)
    return
  }

  let option = {
    url: config.api_url + '/' + config.api_verstion + '/user',
    method: 'post',
    data: {
      access_token: accessToken
    }
  }

  axios(option).then(resp => {

    const result = resp.data

    if (result.success) {
      callback(result.data)
    } else {
      callback(null)
    }

  })
  .catch(function (error) {
    callback(null)
  });

}

serverRender.route('*').get((req, res) => {

  const history = createMemoryHistory();
  const store = configureStore({
    questionList: { other: { data: [] } },
    scroll: {},
    sign: {
      show: false
    },
    user: {
      profile: {},
      unreadNotice: 0,
      accessToken: ''
    },
    nodes: { other: { data: [] } },
    notification: {},
    people: { other: { data: [] } },
    answerList: { other: { data: [] } },
    commentList: { other: { data: [] } },
    history: []
  });

  let accessToken = req.cookies['accessToken'] || null

  authAccessToken(accessToken, (userinfo)=>{

    if (userinfo) {
      store.dispatch({ type: 'ADD_ACCESS_TOKEN', accessToken })
      // 如果获取到用户信息，那么说明token是有效的，因此将用户信息添加到store
      store.dispatch({ type: 'SET_USER', userinfo })
    } else {
      // 删除token
      res.clearCookie('accessToken');
    }

    let routes = crateRoutes(history, userinfo ? userinfo : false);

    if (process.env.NODE_ENV == 'development') console.log('请求:' + req.originalUrl)

    match({ routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {

      if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (error) {
        res.send(500, error.message);
      } else if (!renderProps) {
        res.status(404).send('Not found')
      } else if (renderProps) {

        getReduxPromise(renderProps, store, (notFound) => {

          if (notFound) {
            res.status(404).send('Not found')
            return
          }

          // console.log(store.getState())

          const reduxState = JSON.stringify(store.getState()).replace(/</g, '\\x3c');
          const html = renderToString(
            <Provider store={store}>
              {<RouterContext {...renderProps} />}
            </Provider>
          );

          // 获取页面的meta，嵌套到模版中
          let meta = DocumentMeta.renderAsHTML()

          res.render('../dist/index.ejs', { meta, html, reduxState });

          if (process.env.NODE_ENV == 'development') console.log('页面渲染完成')

        })

      }
    });

  })

});

export default serverRender;

import express from 'express';
import config from '@config';

export default (req: any, res: any, next: any) => {

  res.send(JSON.stringify({
    "short_name": config.name,
    "name": config.name,
    "description": config.description,
    "icons": [
      {
          "src": "/icon-144.png",
          "type": "image/png",
          "sizes": "144x144"
      },
      {
          "src": "/favicon.png",
          "type": "image/png",
          "sizes": "512x512"
      }
    ],
    "start_url": "/?appshell",
    "scope": "/",
    "display": "standalone",
    "orientation": "portrait",
    "background_color": "#eceef0",
    "theme_color": "#eceef0",
    "related_applications": [],
    "prefer_related_applications": false
  }));

}
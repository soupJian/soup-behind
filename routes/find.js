var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //  type 0 表示本 app 链接 1 表示 站外链接
  const data = {
      data:[
        //   cloudspace
          {
            array:[
                {
                    id: "cloud-1",
                    name: '好友动态',
                    imgUrl: 'http://175.24.116.96:3100/defaultImg/cloud.jpg',
                    url: '/cloud',
                }
            ],
            type: 0
          },
        // workspace
          {
            array:[
                {
                  id: "workspace-1",
                  name: 'vue2.x网易云音乐项目',
                  imgUrl: 'http://175.24.116.96:3100/defaultImg/vue.jpg',
                  url: 'http://175.24.116.96',
                },
                {
                  id: "workspace-2",
                  name: 'react-umi-ts-antd web端网易云',
                  imgUrl: 'http://175.24.116.96:3100/defaultImg/react.jpg',
                  url: 'http://175.24.116.96:8000',
                },
                {
                  id: "workspace-3",
                  name: 'vue3.0之去哪儿网',
                  imgUrl: 'http://175.24.116.96:3100/defaultImg/travel.jpg',
                  url: 'http://175.24.116.96:8886',
                }
            ],
            type: 1
          },
        //   codespace
          {
            array:[
                {
                    id: 'code-1',
                    name: "github",
                    imgUrl: 'http://175.24.116.96:3100/defaultImg/github.jpg',
                    url: 'https://github.com/soupJian',
                },
                {
                    id: 'code-2',
                    name: "gitee",
                    imgUrl: 'http://175.24.116.96:3100/defaultImg/gitee.jpg',
                    url: 'https://gitee.com/soupjian',
                }
            ],
            type: 1
          },
        //   contactspace
          {
            array:[
                {
                  id: 'contact-1',
                  name: "QQ",
                  imgUrl: 'http://175.24.116.96:3100/defaultImg/qq.jpg',
                  url: '/qq',
                },
                {
                  id: 'contact-2',
                  name: "微信",
                  imgUrl: 'http://175.24.116.96:3100/defaultImg/wx.jpg',
                  url: '/wx',
                }
            ],
            type: 0
          }

      ],
      code: 200
  }
  res.send(JSON.stringify(data))
});

module.exports = router;

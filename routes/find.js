var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const data = {
      data:[
        //   cloudspace
          {
            array:[
                {
                    id: "cloud-1",
                    name: '好友动态',
                    imgUrl: 'http://175.24.116.96:3100/defaultImg/cloud.jpg'
                }
            ],
          },
        // workspace
          {
            array:[
                {
                  id: "workspace-1",
                  name: 'vue2.x网易云音乐项目',
                  imgUrl: 'http://175.24.116.96:3100/defaultImg/vue.jpg'
                },
                {
                  id: "workspace-2",
                  name: 'react-umi-ts-antd web端网易云',
                  imgUrl: 'http://175.24.116.96:3100/defaultImg/react.jpg'
                },
                {
                  id: "workspace-3",
                  name: 'vue3.0之去哪儿网',
                  imgUrl: 'http://175.24.116.96:3100/defaultImg/travel.jpg'
                }
            ],
          },
        //   codespace
          {
            array:[
                {
                    id: 'code-1',
                    name: "github",
                    imgUrl: 'http://175.24.116.96:3100/defaultImg/github.jpg'
                },
                {
                    id: 'code-2',
                    name: "gitee",
                    imgUrl: 'http://175.24.116.96:3100/defaultImg/gitee.jpg'
                }
            ],
          },
        //   contactspace
          {
            array:[
                {
                  id: 'contact-1',
                  name: "QQ",
                  imgUrl: 'http://175.24.116.96:3100/defaultImg/qq.jpg'
                },
                {
                  id: 'contact-2',
                  name: "微信",
                  imgUrl: 'http://175.24.116.96:3100/defaultImg/wx.jpg'
                }
            ]
          }

      ],
      code: 200
  }
  res.send(JSON.stringify(data))
});

module.exports = router;

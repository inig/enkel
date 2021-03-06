import { ipcMain, app, dialog, screen } from 'electron'

import fs from 'fs'
import path from 'path'

import axios from 'axios'
axios.defaults.timeout = 10000

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const playlist = `#EXTM3U

#EXTINF:-1,group-title=BY,title=CIETV,url=http://hlsmgzblive.miguvideo.com:8080/envivo_v/2018/SD/cctv/alabo/350/index.m3u8?msisdn=F5A2FB819E7F2A18F52F2B7E0BD6D3FE&mdspid=&spid=699004&netType=0&sid=2200179303&pid=2028597139&timestamp=20191229004206&Channel_ID=H5_&ProgramID=609154345&ParentNodeID=-99&assertID=2200179303&client_ip=43.226.43.2&SecurityKey=20191229004206&promotionId=&mvid=&mcid=&mpid=&playurlVersion=SJ-H1-0.0.3&userid=&jmhm=&videocodec=h264&encrypt=8ba837f152d383d199e3f14d69cb352f,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-1高清,url=http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-3高清,url=http://ivi.bupt.edu.cn/hls/cctv3hd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-5+高清,url=http://ivi.bupt.edu.cn/hls/cctv5phd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-6高清,url=http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-8高清,url=http://ivi.bupt.edu.cn/hls/cctv8hd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CHC高清电影,url=http://ivi.bupt.edu.cn/hls/chchd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京卫视高清,url=http://ivi.bupt.edu.cn/hls/btv1hd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京文艺高清,url=http://ivi.bupt.edu.cn/hls/btv2hd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京纪实高清,url=http://ivi.bupt.edu.cn/hls/btv11hd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=湖南卫视高清,url=http://ivi.bupt.edu.cn/hls/hunanhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=浙江卫视高清,url=http://ivi.bupt.edu.cn/hls/zjhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=江苏卫视高清,url=http://ivi.bupt.edu.cn/hls/jshd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=东方卫视高清,url=http://ivi.bupt.edu.cn/hls/dfhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=安徽卫视高清,url=http://ivi.bupt.edu.cn/hls/ahhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=黑龙江卫视高清,url=http://ivi.bupt.edu.cn/hls/hljhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=辽宁卫视高清,url=http://ivi.bupt.edu.cn/hls/lnhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=深圳卫视高清,url=http://ivi.bupt.edu.cn/hls/szhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=广东卫视高清,url=http://ivi.bupt.edu.cn/hls/gdhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=天津卫视高清,url=http://ivi.bupt.edu.cn/hls/tjhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=湖北卫视高清,url=http://ivi.bupt.edu.cn/hls/hbhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=山东卫视高清,url=http://ivi.bupt.edu.cn/hls/sdhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=重庆卫视高清,url=http://ivi.bupt.edu.cn/hls/cqhd.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-1综合,url=http://ivi.bupt.edu.cn/hls/cctv1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-2财经,url=http://ivi.bupt.edu.cn/hls/cctv2.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-3综艺,url=http://ivi.bupt.edu.cn/hls/cctv3.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-4中文国际,url=http://ivi.bupt.edu.cn/hls/cctv4.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-6电影,url=http://ivi.bupt.edu.cn/hls/cctv6.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-7军事农业,url=http://ivi.bupt.edu.cn/hls/cctv7.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-8电视剧,url=http://ivi.bupt.edu.cn/hls/cctv8.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-9纪录,url=http://ivi.bupt.edu.cn/hls/cctv9.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-10科教,url=http://ivi.bupt.edu.cn/hls/cctv10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-11戏曲,url=http://ivi.bupt.edu.cn/hls/cctv11.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-12社会与法,url=http://ivi.bupt.edu.cn/hls/cctv12.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-13新闻,url=http://ivi.bupt.edu.cn/hls/cctv13.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-14少儿,url=http://ivi.bupt.edu.cn/hls/cctv14.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-15音乐,url=http://ivi.bupt.edu.cn/hls/cctv15.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=CCTV-NEWS,url=http://ivi.bupt.edu.cn/hls/cctv16.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京卫视,url=http://ivi.bupt.edu.cn/hls/btv1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京文艺,url=http://ivi.bupt.edu.cn/hls/btv2.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京科教,url=http://ivi.bupt.edu.cn/hls/btv3.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京影视,url=http://ivi.bupt.edu.cn/hls/btv4.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京财经,url=http://ivi.bupt.edu.cn/hls/btv5.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京生活,url=http://ivi.bupt.edu.cn/hls/btv7.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京青年,url=http://ivi.bupt.edu.cn/hls/btv8.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京新闻,url=http://ivi.bupt.edu.cn/hls/btv9.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=北京卡酷少儿,url=http://ivi.bupt.edu.cn/hls/btv10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=深圳卫视,url=http://ivi.bupt.edu.cn/hls/sztv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=安徽卫视,url=http://ivi.bupt.edu.cn/hls/ahtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=河南卫视,url=http://ivi.bupt.edu.cn/hls/hntv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=陕西卫视,url=http://ivi.bupt.edu.cn/hls/sxtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=吉林卫视,url=http://ivi.bupt.edu.cn/hls/jltv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=广东卫视,url=http://ivi.bupt.edu.cn/hls/gdtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=山东卫视,url=http://ivi.bupt.edu.cn/hls/sdtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=湖北卫视,url=http://ivi.bupt.edu.cn/hls/hbtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=广西卫视,url=http://ivi.bupt.edu.cn/hls/gxtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=河北卫视,url=http://ivi.bupt.edu.cn/hls/hebtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=西藏卫视,url=http://ivi.bupt.edu.cn/hls/xztv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=内蒙古卫视,url=http://ivi.bupt.edu.cn/hls/nmtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=青海卫视,url=http://ivi.bupt.edu.cn/hls/qhtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=四川卫视,url=http://ivi.bupt.edu.cn/hls/sctv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=江苏卫视,url=http://ivi.bupt.edu.cn/hls/jstv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=天津卫视,url=http://ivi.bupt.edu.cn/hls/tjtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=山西卫视,url=http://ivi.bupt.edu.cn/hls/sxrtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=辽宁卫视,url=http://ivi.bupt.edu.cn/hls/lntv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=厦门卫视,url=http://ivi.bupt.edu.cn/hls/xmtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=新疆卫视,url=http://ivi.bupt.edu.cn/hls/xjtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=东方卫视,url=http://ivi.bupt.edu.cn/hls/dftv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=黑龙江卫视,url=http://ivi.bupt.edu.cn/hls/hljtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=湖南卫视,url=http://ivi.bupt.edu.cn/hls/hunantv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=云南卫视,url=http://ivi.bupt.edu.cn/hls/yntv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=江西卫视,url=http://ivi.bupt.edu.cn/hls/jxtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=福建东南卫视,url=http://ivi.bupt.edu.cn/hls/dntv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=浙江卫视,url=http://ivi.bupt.edu.cn/hls/zjtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=贵州卫视,url=http://ivi.bupt.edu.cn/hls/gztv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=宁夏卫视,url=http://ivi.bupt.edu.cn/hls/nxtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=甘肃卫视,url=http://ivi.bupt.edu.cn/hls/gstv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=重庆卫视,url=http://ivi.bupt.edu.cn/hls/cqtv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=兵团卫视,url=http://ivi.bupt.edu.cn/hls/bttv.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=BY,title=旅游卫视,url=http://ivi.bupt.edu.cn/hls/lytv.m3u8,type=application/x-mpegURL

#EXTINF:-1,group-title=卫视,title=湖南卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225827/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=江苏卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225847/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=浙江卫视高清,url=http://223.110.243.153/PLTV/3/224/3221227215/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=东方卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225828/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=北京卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225826/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=广东卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225824/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=深圳卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225848/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=天津卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225830/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=安徽卫视高清,url=http://223.110.243.140/PLTV/3/224/3221225634/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=山东卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225843/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=湖北卫视高清,url=http://223.110.243.140/PLTV/3/224/3221227211/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=辽宁卫视高清,url=http://223.110.243.157/PLTV/3/224/3221225566/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=重庆卫视高清,url=http://223.110.243.138/PLTV/3/224/3221227421/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=江西卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225868/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=河北卫视高清,url=http://weblive.hebtv.com/live/hbws_bq/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=黑龙江卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225862/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=四川卫视,url=http://ott.js.chinamobile.com/PLTV/3/224/3221225814/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=广西卫视,url=http://223.110.243.162/PLTV/3/224/3221225554/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=河南卫视,url=http://112.50.243.8/PLTV/88888888/224/3221225842/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=山西卫视,url=http://112.50.243.8/PLTV/88888888/224/3221225839/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=东南卫视,url=http://223.110.243.158/PLTV/3/224/3221225598/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=厦门卫视,url=http://ott.js.chinamobile.com/PLTV/3/224/3221226093/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=云南卫视,url=http://112.50.243.8/PLTV/88888888/224/3221225853/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=宁夏卫视,url=http://223.110.243.166/PLTV/3/224/3221225628/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=新疆卫视,url=http://223.110.243.140/PLTV/3/224/3221225523/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=旅游卫视,url=http://112.50.243.8/PLTV/88888888/224/3221225855/1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=内蒙古卫视,url=http://223.110.243.142/PLTV/3/224/3221225624/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=凤凰中文台超清,url=http://223.110.243.146/PLTV/3/224/3221226922/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=凤凰资讯台超清,url=http://223.110.243.146/PLTV/3/224/3221226923/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=卫视,title=凤凰香港台超清,url=http://223.110.243.146/PLTV/3/224/3221226975/index.m3u8,type=application/x-mpegURL

#EXTINF:-1,group-title=华数,title=院线大片,url=http://hls-ott-zhibo.wasu.tv/live/357/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=好莱坞大赏,url=http://hls-ott-zhibo.wasu.tv/live/351/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=票房佳作,url=http://hls-ott-zhibo.wasu.tv/live/264/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=浪漫爱情,url=http://hls-ott-zhibo.wasu.tv/live/231/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=欧美冒险,url=http://hls-ott-zhibo.wasu.tv/live/156/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=惊悚悬疑,url=http://hls-ott-zhibo.wasu.tv/live/362/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=热门网大,url=http://hls-ott-zhibo.wasu.tv/live/363/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=动漫电影,url=http://hls-ott-zhibo.wasu.tv/live/356/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=BBC系列,url=http://hls-ott-zhibo.wasu.tv/live/394/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=生活杂谈,url=http://hls-ott-zhibo.wasu.tv/live/131/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=自然世界,url=http://hls-ott-zhibo.wasu.tv/live/128/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=社会真相,url=http://hls-ott-zhibo.wasu.tv/live/130/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=军事纪实,url=http://hls-ott-zhibo.wasu.tv/live/392/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=历史解密,url=http://hls-ott-zhibo.wasu.tv/live/369/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=科教人文,url=http://hls-ott-zhibo.wasu.tv/live/391/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=大国时代,url=http://hls-ott-zhibo.wasu.tv/live/390/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=TVB神剧,url=http://hls-ott-zhibo.wasu.tv/live/202/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=热血抗战,url=http://hls-ott-zhibo.wasu.tv/live/353/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=心动剧场,url=http://hls-ott-zhibo.wasu.tv/live/257/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=百看不厌,url=http://hls-ott-zhibo.wasu.tv/live/259/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=情感生活,url=http://hls-ott-zhibo.wasu.tv/live/261/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=少林问道,url=http://hls-ott-zhibo.wasu.tv/live/160/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=学警雄心,url=http://hls-ott-zhibo.wasu.tv/live/97/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=睡前故事,url=http://hls-ott-zhibo.wasu.tv/live/332/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=宝宝巴士,url=http://hls-ott-zhibo.wasu.tv/live/234/index.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=华数,title=公主城堡,url=http://hls-ott-zhibo.wasu.tv/live/328/index.m3u8,type=application/x-mpegURL

#EXTINF:-1,group-title=CIBN,title=电影导视,url=http://gs.hdp.ds.lunbocl.ott.cibntv.net/hls/vCIBNDYDS/1800/vCIBNDYDS.m3u8?md5=c246ac4e6b6cb88b7f970b530ff04b86,type=application/x-mpegURL
#EXTINF:-1,group-title=CIBN,title=电影综合,url=http://gs.hdp.ds.lunbocl.ott.cibntv.net/hls/vCIBNDYPD/1800/vCIBNDYPD.m3u8?md5=c246ac4e6b6cb88b7f970b530ff04b86,type=application/x-mpegURL
#EXTINF:-1,group-title=CIBN,title=精品影院,url=http://gs.hdp.ds.lunbocl.ott.cibntv.net/hls/vCIBNJPYY/1800/vCIBNJPYY.m3u8?md5=c246ac4e6b6cb88b7f970b530ff04b86,type=application/x-mpegURL
#EXTINF:-1,group-title=CIBN,title=情感影院,url=http://gs.hdp.ds.lunbocl.ott.cibntv.net/hls/vCIBNQGYY/1800/vCIBNQGYY.m3u8?md5=c246ac4e6b6cb88b7f970b530ff04b86,type=application/x-mpegURL
#EXTINF:-1,group-title=CIBN,title=喜剧影院,url=http://gs.hdp.ds.lunbocl.ott.cibntv.net/hls/vCIBNHSYX/1800/vCIBNHSYX.m3u8?md5=c246ac4e6b6cb88b7f970b530ff04b86,type=application/x-mpegURL
#EXTINF:-1,group-title=CIBN,title=古装剧场,url=http://gs.hdp.ds.lunbocl.ott.cibntv.net/hls/vCIBNZYPD/1800/vCIBNZYPD.m3u8?md5=c246ac4e6b6cb88b7f970b530ff04b86,type=application/x-mpegURL
#EXTINF:-1,group-title=CIBN,title=骄阳剧场,url=http://gs.hdp.ds.lunbocl.ott.cibntv.net/hls/vCIBNJDJC/1800/vCIBNJDJC.m3u8?md5=c246ac4e6b6cb88b7f970b530ff04b86,type=application/x-mpegURL

#EXTINF:-1,group-title=爱奇艺,title=电影大片,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_dianyingjingxuan_1080p_t10/c15_lb_dianyingjingxuan_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=贺岁影院,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_haolaiwudapian_1080p_t10/c16_lb_haolaiwudapian_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=豆瓣高分,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_wuxingyingyuan_1080p_t10/c15_lb_wuxingyingyuan_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=动作电影,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_dongzuodianying_1080p_t10/c16_lb_dongzuodianying_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=票房收割机,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_heibangdianying_1080p_t10/c16_lb_heibangdianying_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=欢乐剧场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_xijudianying_1080p_t10/c16_lb_xijudianying_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=经典港片,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_jingdianguangpian_1080p_t10/c15_lb_jingdianguangpian_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=惊悚午夜场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_jingnawuyechang_1080p_t10/c16_lb_jingnawuyechang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=动画电影,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_donghuadianying_1080p_t10/c16_lb_donghuadianying_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=华语院线,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_huayuyuanxian_1080p_t10/c16_lb_huayuyuanxian_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=粤语原生,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_yueyuyuansheng_1080p_t10/c16_lb_yueyuyuansheng_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=怀旧剧场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_huaijiujuchang_1080p_t10/c16_lb_huaijiujuchang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=日韩院线,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_rihanyuanxian_1080p_t10/c16_lb_rihanyuanxian_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=温情影院,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_chenglong_1080p_t10/c15_lb_chenglong_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=周末影院,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_fengxiaogang_1080p_t10/c16_lb_fengxiaogang_1080p_t10.m3u8 ,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=婚姻剧场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_hunyinjuchang_1080p_t10/c16_lb_hunyinjuchang_1080p_t10.m3u8 ,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=权谋剧场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_quanmojuchang_1080p_t10/c16_lb_quanmojuchang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=经典重温,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_jingdianjuchang_1080p_t10/c16_lb_jingdianjuchang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=谍战剧场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_diezhanjuchang_1080p_t10/c16_lb_diezhanjuchang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=军旅剧场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_junlvjuchang_1080p_t10/c16_lb_junlvjuchang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=情景喜剧,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_kaixinjuchang_1080p_t10/c16_lb_kaixinjuchang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=老剧超清修复,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_longmenbiaoju_1080p_t10/c16_lb_longmenbiaoju_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=收视冠军,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_dajuchongwen_1080p_t10/c15_lb_dajuchongwen_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=老年剧场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_laonianjuchang_1080p_t10/c15_lb_laonianjuchang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=仙侠玄幻,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_qingshenshenyumengmeng_1080p_t10/c15_lb_qingshenshenyumengmeng_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=青春剧场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_weizhangzhe_1080p_t10/c15_lb_weizhangzhe_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=宫廷正剧,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_niandaijuchang_1080p_t10/c15_lb_niandaijuchang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=家庭剧场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_jiatingjuchang_1080p_t10/c15_lb_jiatingjuchang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=抗战剧场,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_kangzhanjuchang_1080p_t10/c15_lb_kangzhanjuchang_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=热播电视剧,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_reboju_1080p_t10/c15_lb_reboju_1080p_t10.m3u8 ,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=历史秘闻,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_lishimiwen_1080p_t10/c15_lb_lishimiwen_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=旅游攻略,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_lvyounew_1080p_t10/c15_lb_lvyounew_1080p_t10.m3u8 ,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=军事观察,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_junshinew_1080p_t10/c16_lb_junshinew_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=童年经典,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_balalaxiaomoxian_1080p_t10/c15_lb_balalaxiaomoxian_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=动画小天地,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_dishine_1080p_t10/c15_lb_dishine_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=动物兄弟,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_yingshijinqu_1080p_t10/c16_lb_yingshijinqu_1080p_t10.m3u8 ,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=怀旧动画,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_huanjiudongman_1080p_t10/c15_lb_huanjiudongman_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=儿童乐园,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_dongmantiandi_1080p_t10/c15_lb_dongmantiandi_1080p_t10.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=爱奇艺,title=亲子启蒙,url=http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_qinziqimeng_1080p_t10/c16_lb_qinziqimeng_1080p_t10.m3u8,type=application/x-mpegURL

#EXTINF:-1,group-title=NewTV,title=NewTV古装,url=http://39.135.36.150:18890/000000001000/6859053933687922163/1.m3u8?channel-id=ystenlive&Contentid=6859053933687922163&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=6859053933687922163&owchid=ystenlive&owsid=1106497909461643183&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE7rI6cyOBdMQcbb7pGYvKkkE4PU3Zf45kDZim939dEFvAtUmU8crfqEUv5zpewkRlr9zZahSqXGjBKN9OvmeMwv,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV动作,url=http://39.135.36.146:18890/000000001000/8103864434730665389/1.m3u8?channel-id=ystenlive&Contentid=8103864434730665389&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=8103864434730665389&owchid=ystenlive&owsid=1106497909461651262&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE6gc5lrV9LORe1gi%2brvWfZqjqWg5r9sHf%2bhUiRSDpBuWg5lRQBeU9YctiSzPH6gfVkWNbz7C4olsbRCQkf1hNrZ,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV军旅,url=http://39.135.36.156:18890/000000001000/7485075951068666323/1.m3u8?channel-id=ystenlive&Contentid=7485075951068666323&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=7485075951068666323&owchid=ystenlive&owsid=1106497909461660587&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE7gYwRY3Wxxxjm4eCFATbicSFfA3OO5y8oXZJsD0pdpNF5XUqv6ZoXjgdtsapPA003lukcFW5PcqCPu9LmSAwaU,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV家庭,url=http://39.135.36.154:18890/000000001000/6316377948248689070/1.m3u8?channel-id=ystenlive&Contentid=6316377948248689070&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=6316377948248689070&owchid=ystenlive&owsid=1106497909461667557&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE4ZwpjUZzRJ311OOUZgk%2fdzXH6qIpYr0YPi6NvoFlPR1BKc5nFG3fYCgRA5KoFSBO69EQ0AB6jYRoTGtX%2bXoSmh,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV惊悚,url=http://39.135.36.153:18890/000000001000/7151256057701199617/1.m3u8?channel-id=ystenlive&Contentid=7151256057701199617&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=7151256057701199617&owchid=ystenlive&owsid=1106497909461673183&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE7WcU4uUemDr%2bvU%2bvnnf3N5iO4bkU4W0ueDoorDr5ibxhAm%2f7T1v8XBQNX%2bapKXQ2%2fK9yjYdVWnw2Bihh8x%2bgGK,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV海外,url=http://39.135.36.138:18890/000000001000/7681593242002292003/1.m3u8?channel-id=ystenlive&Contentid=7681593242002292003&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=7681593242002292003&owchid=ystenlive&owsid=1106497909461684320&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE6duq37iJuE%2fAq4jgKsH77XOP4Et6zhgVTiPZi9lOHM23AIuPDem5ywKZGTAm3ZYV4bg0FTwS32NZpO0MD9F11W,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV搏击,url=http://39.135.36.154:18890/000000001000/bokesen/1.m3u8?channel-id=ystenlive&Contentid=bokesen&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=bokesen&owchid=ystenlive&owsid=1106497909461689613&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE7tWwcJ9gAtxn4aPYIw71ppLozLIK9YQrvbqFru4XbE8FIhvh4VgXNnv8f9IP4gfSA%3d,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV明星大片,url=http://39.135.36.143:18890/000000001000/5595720619887440144/1.m3u8?channel-id=ystenlive&Contentid=5595720619887440144&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=5595720619887440144&owchid=ystenlive&owsid=1106497909461695855&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE6YXxE0nCCxd3dck4q0SwSBlg2o%2fvyI82ry5doiaWJPH9u%2fHCOos%2ffJGJ56Qg2QVr1cCX3bbMrMBnTh%2bHCkuVIP,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV爱情喜剧,url=http://39.135.36.152:18890/000000001000/8393829412396288037/1.m3u8?channel-id=ystenlive&Contentid=8393829412396288037&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=8393829412396288037&owchid=ystenlive&owsid=1106497909461701287&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE4y7uVHwAxWluJXzuOABih3FGGfr%2bsJzle%2bv7q7mmo7sH%2b2t%2bWjDtNUzUdL8QTk%2bIUtEVXTAMGlgOpmFrzdrKNl,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV精品大剧,url=http://39.135.36.147:18890/000000001000/7882297361445410858/1.m3u8?channel-id=ystenlive&Contentid=7882297361445410858&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=7882297361445410858&owchid=ystenlive&owsid=1106497909461708013&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE4G3gHhbopAXv1%2bwSMC13LXLIuhzr0myUm7odTYlfUIkKrQcNEkHc7TnPLGe1r4%2bIX7AhIXtKagjAfjVTqFHQE4,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV功夫,url=http://39.135.36.155:18890/000000001000/5897056882324761054/1.m3u8?channel-id=ystenlive&Contentid=5897056882324761054&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=5897056882324761054&owchid=ystenlive&owsid=1106497909461714898&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE7F7WgeLO%2bfyIWPYXQQMhNtCo5WrxR%2bhkEBJzZk8A5S%2bUclQim%2ffZXtk%2bP4F8ROcQNAlQJtGhciSrbmmnbiZQWc,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV金牌综艺,url=http://39.135.36.140:18890/000000001000/6399725674632152632/1.m3u8?channel-id=ystenlive&Contentid=6399725674632152632&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=6399725674632152632&owchid=ystenlive&owsid=1106497909461719323&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE4gyKcpvop%2bJI182Bs2kqZG345lJmBteJiRcq6kB86C9F3lxBSs1xa6%2bdgOwB1WRIKDdF3P8H%2bLGMiwAhepZKru,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV军事评论,url=http://39.135.36.151:18890/000000001000/5822616274253344775/1.m3u8?channel-id=ystenlive&Contentid=5822616274253344775&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=5822616274253344775&owchid=ystenlive&owsid=1106497909461724106&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE7%2baKbhkowsYIbIX%2fDf65zZplfMot6mRkOGBkot%2bjE4A8Wm%2bKVEkV%2fcPOkvsemBIenlZSBuNy85BFE%2b0UBbzIgQ,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV农业致富,url=http://39.135.36.147:18890/000000001000/6193684637634073625/1.m3u8?channel-id=ystenlive&Contentid=6193684637634073625&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=6193684637634073625&owchid=ystenlive&owsid=1106497909461729529&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE7wjRXywerl7HoD%2bJ8krwUOzhLEwHQymxgjBufQTPa%2bdlXx%2bGBQLAIX%2bfssQZb%2fjX3XANYjuYXkdYX5N1o%2b7hmV,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV精品记录,url=http://39.135.36.156:18890/000000001000/6298506997017621594/1.m3u8?channel-id=ystenlive&Contentid=6298506997017621594&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=6298506997017621594&owchid=ystenlive&owsid=1106497909461739335&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE5Z%2fEzyUAZDVIPoiwNPLYgjJvkohoXFTsC5VYOGHUU7RlueMvRrGKmSZC%2bNKYW4Mlhq%2bt9ZsVsg39%2bFutggbU%2f7,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV健康有约,url=http://39.135.36.155:18890/000000001000/7820874641606664941/1.m3u8?channel-id=ystenlive&Contentid=7820874641606664941&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=7820874641606664941&owchid=ystenlive&owsid=1106497909461745819&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE5qWkmkT2TXMLlfHzXJDPRjWZjitMMZdXIPlgQOHqalAjnZ%2bnAyI8gVeuqRanEvNgZ6w0N1hxkH6zHVX54bK3KE,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV精品体育,url=http://39.135.36.157:18890/000000001000/6460382139625130259/1.m3u8?channel-id=ystenlive&Contentid=6460382139625130259&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=6460382139625130259&owchid=ystenlive&owsid=1106497909461751360&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE7bXyHXx9pcAUwTaLb5AbAmkHYZnpwVd9P8mvmphlj1JalYdRW8FBsCqY%2f8wxvQntk%2bssuunsLwIBwjlBeIJxeC,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV潮妈辣婆,url=http://39.135.36.147:18890/000000001000/6516734029835465177/1.m3u8?channel-id=ystenlive&Contentid=6516734029835465177&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=6516734029835465177&owchid=ystenlive&owsid=1106497909461757416&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE7lpjlDkCigeV92%2fGgzDbl17YJnmK%2bNapvzR3hZbQitGUDQ%2f2RfKI5ienTpN%2bdmcS6qzJsR4R%2fYKs50I6pDfn83,type=application/x-mpegURL
#EXTINF:-1,group-title=NewTV,title=NewTV炫舞未来,url=http://39.135.36.157:18890/000000001000/1000000001000000515/1.m3u8?channel-id=ystenlive&Contentid=1000000001000000515&livemode=1&stbId=005203FF000360100001001A34C0CD33&userToken=4ef1f6fdd53988bdf19472c73151206f21vv&usergroup=g21077200000&version=1.0&owaccmark=1000000001000000515&owchid=ystenlive&owsid=1106497909461764488&AuthInfo=yOLXJswzZFfV3FvB8MhHuElKGJKLbU5H0jB3qAhfSE7AORAoVDZDWbFnJ0sXJEaRNwKLc81VtMnWmF2ZM43fEHzlD22rx2n%2flxPrsDq9A4qonSPaCT%2bEq8mzJT5jo5U4,type=application/x-mpegURL
 
#EXTINF:-1,group-title=轮播,title=科幻电影,url=http://aldirect.hls.huya.com/huyalive/28466698-2689656864-11551988268341919744-2847699194-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=轮播,title=好莱坞电影,url=http://aldirect.hls.huya.com/huyalive/30765679-2484192572-10669525853706125312-2847687498-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=轮播,title=怪物科幻,url=http://js.hls.huya.com/huyalive/30765679-2478268764-10644083292078342144-2847699106-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=轮播,title=漫威电影,url=http://aldirect.hls.huya.com/huyalive/30765679-2504742278-10757786168918540288-3049003128-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=轮播,title=惊悚大片,url=http://tx.hls.huya.com/huyalive/29106097-2689447600-11551089486305689600-2789274568-10057-A-1525420695-1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=轮播,title=灾难电影,url=http://aldirect.hls.huya.com/huyalive/29169025-2686219962-11537226886652362752-2710080226-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=轮播,title=丧尸电影,url=http://tx.hls.huya.com/huyalive/29106097-2689286606-11550398022340837376-2789274544-10057-A-0-1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=轮播,title=动漫大电影,url=http://tx.hls.huya.com/huyalive/28466698-2689661530-11552008308659322880-3049003102-10057-A-0-1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=轮播,title=亚洲电影1,url=http://tx.hls.huya.com/huyalive/30765679-2554414680-10971127511022305280-3048991634-10057-A-0-1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=轮播,title=亚洲电影2,url=http://tx.hls.huya.com/huyalive/30765679-2554414705-10971127618396487680-3048991636-10057-A-0-1.m3u8,type=application/x-mpegURL
#EXTINF:-1,group-title=轮播,title=亚洲电影3,url=http://tx.hls.huya.com/huyalive/29359996-2689475864-11551210879261343744-2847699104-10057-A-1525430092-1.m3u8,type=application/x-mpegURL


#EXTINF:0,group-title=Enkel,title=CCTV-1综合,url=http://223.110.242.130:6610/gitv/live1/G_CCTV-1-HQ/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-2财经,url=http://112.50.243.10/PLTV/88888888/224/3221225800/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-3综艺,url=http://183.207.249.14/PLTV/3/224/3221225588/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-4中文国际,url=http://223.110.242.130:6610/gitv/live1/G_CCTV-4-HQ/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-5体育,url=http://223.110.243.172/PLTV/3/224/3221227166/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-5+体育赛事,url=http://223.110.243.162/PLTV/3/224/3221225604/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-6电影,url=http://223.110.243.139/PLTV/3/224/3221225548/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-7军事农业,url=http://112.50.243.8/PLTV/88888888/224/3221225805/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-8电视剧,url=http://223.110.243.171/PLTV/3/224/3221227204/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-9记录,url=http://112.50.243.8/PLTV/88888888/224/3221225820/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-10科教,url=http://183.207.249.14/PLTV/3/224/3221225550/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-11戏曲,url=http://112.50.243.8/PLTV/88888888/224/3221225815/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-12社会与法,url=http://223.110.245.172/PLTV/3/224/3221225556/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-13新闻,url=http://112.50.243.8/PLTV/88888888/224/3221225817/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-14少儿,url=http://223.110.245.169/PLTV/3/224/3221227201/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=CCTV-15音乐,url=http://112.50.243.8/PLTV/88888888/224/3221225818/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=湖南卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225827/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=江苏卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225847/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=浙江卫视高清,url=http://223.110.243.153/PLTV/3/224/3221227215/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=东方卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225828/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=北京卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225826/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=广东卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225824/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=深圳卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225848/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=天津卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225830/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=安徽卫视高清,url=http://223.110.243.140/PLTV/3/224/3221225634/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=山东卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225843/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=湖北卫视高清,url=http://223.110243.140/PLTV/3/224/3221227211/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=辽宁卫视高清,url=http://223.110.243.157/PLTV/3/224/3221225566/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=重庆卫视高清,url=http://223.110.243.138/PLTV/3/224/3221227421/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=江西卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225868/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=河北卫视高清,url=http://weblive.hebtv.com/live/hbws_bq/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=黑龙江卫视高清,url=http://112.50.243.8/PLTV/88888888/224/3221225862/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=四川卫视,url=http://ott.js.chinamobile.com/PLTV/3/224/3221225814/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=广西卫视,url=http://223.110.243.162/PLTV/3/224/3221225554/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=河南卫视,url=http://112.50.243.8/PLTV/88888888/224/3221225842/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=山西卫视,url=http://112.50.243.8/PLTV/88888888/224/3221225839/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=东南卫视,url=http://223.110.243.158/PLTV/3/224/3221225598/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=厦门卫视,url=http://ott.js.chinamobile.com/PLTV/3/224/3221226093/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=云南卫视,url=http://112.50.243.8/PLTV/88888888/224/3221225853/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=宁夏卫视,url=http://223.110.243.166/PLTV/3/224/3221225628/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=新疆卫视,url=http://223.110.243.140/PLTV/3/224/3221225523/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=旅游卫视,url=http://112.50.243.8/PLTV/88888888/224/3221225855/1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=内蒙古卫视,url=http://223.110.243.142/PLTV/3/224/3221225624/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=凤凰中文台超清,url=http://223.110.243.146/PLTV/3/224/3221226922/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=凤凰资讯台超清,url=http://223.110.243.146/PLTV/3/224/3221226923/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=凤凰香港台超清,url=http://223.110.243.146/PLTV/3/224/3221226975/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv动作电影,url=http://183.207.249.15/PLTV/3/224/3221225529/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv惊悚悬疑,url=http://183.207.249.7/PLTV/3/224/3221225561/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv精品电影,url=http://183.207.249.14/PLTV/3/224/3221225567/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv明星大片,url=http://183.207.249.14/PLTV/3/224/3221225535/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv家庭剧场,url=http://183.207.249.14/PLTV/3/224/3221225549/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv精品大剧,url=http://183.207.249.14/PLTV/3/224/3221225569/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv金牌综艺,url=http://183.207.249.16/PLTV/3/224/3221225559/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv精品记录,url=http://183.207.249.14/PLTV/3/224/3221225557/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv精品体育,url=http://183.207.249.16/PLTV/3/224/3221225543/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv北京纪实,url=http://117.169.79.101:8080/PLTV/88888888/224/3221225764/index.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv上海纪实,url=http://huaweicdn.hb.chinamobile.com/PLTV/88888888/224/3221225769/3.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv纪实天下(电),url=rtsp://120.205.96.36:554/live/ch16022917175374294745.sdp?playtype=1&boid=001&backupagent=120.205.32.36:554&clienttype=1&time=20161205230814+08&life=172800&ifpricereqsnd=1&vcdnid=001&userid=&mediaid=ch16022917175374294745&ctype=2&TSTVTimeLife=60&contname=&authid=0&terminalflag=1&UserLiveType=0&stbid=&nodelevel=3,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv全纪实,url=http://huaweicdn.hb.chinamobile.com/PLTV/88888888/224/3221225791/3.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv欢笑剧场,url=http://huaweicdn.hb.chinamobile.com/PLTV/88888888/224/3221225776/3.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=Newtv都市剧场,url=http://huaweicdn.hb.chinamobile.com/PLTV/88888888/224/3221225754/3.m3u8,type=application/x-mpegURL

#EXTINF:0,group-title=Enkel,title=科幻电影,url=http://aldirect.hls.huya.com/huyalive/28466698-2689656864-11551988268341919744-2847699194-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=速度与激情,url=http://aldirect.hls.huya.com/huyalive/29169025-2686219962-11537226886652362752-2710080226-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=赌博电影,url=http://js.hls.huya.com/huyalive/29106097-2689446042-11551082794746642432-2789253870-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=赌神全集新木乃伊,url=http://aldirect.hls.huya.com/huyalive/29169025-2686220018-11537227127170531328-2847699120-10057-A-1524041208-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=王晶导演,url=https://aldirect.hls.huya.com/huyalive/94525224-2579683592-11079656661667807232-2847687574-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=徐克导演,url=http://tx.hls.huya.com/huyalive/29106097-2689447148-11551087544980471808-2789253872-10057-A-1525420294-1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=黄渤,url=https://aldirect.hls.huya.com/huyalive/30765679-2554414680-10971127511022305280-3048991634-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=徐峥,url=https://aldirect.hls.huya.com/huyalive/29106097-2689278568-11550363499393712128-2710090468-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=斯坦森,url=http://tx.hls.huya.com/huyalive/30765679-2554414705-10971127618396487680-3048991636-10057-A-0-1.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=黄百鸣,url=http://ws4.streamhls.huya.com/huyalive/29169025-2686220062-11537227316149092352-2777037828-10057-A-1524041857-1_1200/playlist.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=陈小春,url=http://ws4.streamhls.huya.com/huyalive/30765679-2523417522-10837995731143360512-2777068634-10057-A-0-1_1200/playlist.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=黄日华,url=http://ws4.streamhls.huya.com/huyalive/30765679-2523417506-10837995662423883776-2777071322-10057-A-0-1_1200/playlist.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=甄子丹,url=http://ws4.streamhls.huya.com/huyalive/29169025-2686219938-11537226783573147648-2847699096-10057-A-1524024759-1_1200/playlist.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=李连杰,url=http://js.hls.huya.com/huyalive/94525224-2460686093-10568566295157014528-2789253848-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=刘德华,url=http://aldirect.hls.huya.com/huyalive/94525224-2467341872-10597152648291418112-2789274550-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=成龙,url=http://aldirect.hls.huya.com/huyalive/94525224-2460685722-10568564701724147712-2789253838-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=周星驰,url=http://aldirect.hls.huya.com/huyalive/94525224-2460685313-10568562945082523648-2789274524-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=林正英,url=http://js.hls.huya.com/huyalive/94525224-2460686034-10568566041753944064-2789274542-10057-A-0-1_1200.m3u8,type=application/x-mpegURL
#EXTINF:0,group-title=Enkel,title=徐老师LOL故事,url=http://aldirect.hls.huya.com/huyalive/28466698-2689658976-11551997339312848896-2789274534-10057-A-0-1_1200.m3u8,type=application/x-mpegURL

`
if (!fs.existsSync(app.getPath('userData'))) {
  fs.mkdirSync(app.getPath('userData'))
  fs.writeFileSync(app.getPath('userData') + path.sep + 'enkel_user_data.json', '{}')
} else {
  if (!fs.existsSync(app.getPath('userData') + path.sep + 'enkel_user_data.json')) {
    fs.writeFileSync(app.getPath('userData') + path.sep + 'enkel_user_data.json', '{}')
  }
  // if (!fs.existsSync(app.getPath('userData') + path.sep + 'enkel_playlist.m3u')) {
  // fs.writeFileSync(app.getPath('userData') + path.sep + 'enkel_playlist.m3u', playlist)
  // }
}
// console.log('===', app.getPath('userData') + path.sep + 'enkel_user_data.json')
const adapter = new FileSync(app.getPath('userData') + path.sep + 'enkel_user_data.json')
const db = low(adapter)

db.defaults({
  video: {
    code: ''
  },
  fm: {
    mood: '迷茫', // 1: 烦躁；2: 悲伤；3: 孤独；4: 已弃疗；5: 减压；6: 无奈；7: 快乐；8: 感动；9: 迷茫
    bg: 'http://attach.bbs.miui.com/forum/201107/18/1128552dfogdk5efkhzmoh.jpg',
    customBg: '',
    favorite: {
      radio: [], // 直播电台
      sound: [], // 主播声音
      anchor: [] // 主播
    }
  }
}).write()

function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
function getUUID (perfix) {
  return ((perfix ? (perfix + '-') : '') + S4() + S4() + S4())
}

function getCode () {
  return db.get('video.code').value()
}

function setCode (code) {
  db.get('video').assign({
    code: code
  }).write()
}

function getMood () {
  return db.get('fm.mood').value()
}

function setMood (mood) {
  db.get('fm').assign({
    mood: mood
  }).write()
}

function getAllFavoriteFm () {
  return db.get('fm.favorite').value() || {
    radio: [],
    sound: [],
    anchor: []
  }
}

function setFavoriteFm (item, type) {
  if (!db.get('fm.favorite').value()) {
    db.get('fm').assign({
      favorite: {
        radio: [],
        sound: [],
        anchor: []
      }
    }).write()
  } else if (!db.get('fm.favorite.' + type).value()) {
    let d = {}
    d[type] = []
    db.get('fm.favorite').assign(d).write()
  }
  let list = db.get('fm.favorite.' + type).value()
  if (type === 'anchor') {
    if (!list.some(itm => itm.id === item.id)) {
      list.push(item)
    }
  } else {
    if (!list.some(itm => itm.url === item.url)) {
      list.push(item)
    }
  }
  let d2 = {}
  d2[type] = list
  db.get('fm.favorite').assign(d2).write()
}

function removeFavoriteFm (item, type) {
  if (item.url || item.id) {
    let list = db.get('fm.favorite.' + type).value()
    if (list && (list.length > 0)) {
      let i = 0
      let outIndex = -1
      if (type === 'anchor') {
        for (i; i < list.length; i++) {
          if (list[i].id === item.id) {
            outIndex = i
            i = list.length
          }
        }
      } else {
        for (i; i < list.length; i++) {
          if (list[i].url === item.url) {
            outIndex = i
            i = list.length
          }
        }
      }
      if (outIndex > -1) {
        list.splice(outIndex, 1)
        let d2 = {}
        d2[type] = list
        db.get('fm.favorite').assign(d2).write()
      }
    }
  }
}

function getFmBg () {
  return db.get('fm.customBg').value() || db.get('fm.bg').value() || 'http://attach.bbs.miui.com/forum/201107/18/1128552dfogdk5efkhzmoh.jpg'
}

function setFmBg (bg) {
  db.get('fm').assign({
    customBg: bg
  }).write()
}

let outList = []
ipcMain.on('get-play-list', (event, data) => {
  if (outList.length > 0) {
    event.returnValue = outList
    return
  }
  // let fileData = fs.readFileSync(path.join(__dirname, '../renderer/assets/preload/playlist.m3u'), {
  // let fileData = fs.readFileSync(app.getPath('userData') + path.sep + 'enkel_playlist.m3u', {
  //   encoding: 'utf-8'
  // })
  let fileData = playlist

  let list = fileData.split('\n')
  let indexMap = {}
  let i = 0
  let groupTitle = ''
  let title = ''
  let url = ''
  let type = ''
  for (i; i < list.length; i++) {
    if (list[i].trim() && (list[i].indexOf('#EXTINF:') === 0)) {
      groupTitle = list[i].replace(/^(.*)(group\-title\=)([^,]*)(,.*)$/, '$3')
      title = list[i].replace(/^(.*)(title\=)([^,]*)(,.*)$/, '$3')
      url = list[i].replace(/^(.*)(url\=)([^,]*)(,?.*)$/, '$3')
      type = list[i].replace(/^(.*)(type\=)([^,]*)(,?.*)$/, '$3')
      if (!indexMap.hasOwnProperty(groupTitle)) {
        outList.push({
          label: groupTitle,
          children: [
            {
              label: title,
              url: url,
              type: type
            }
          ]
        })
        indexMap[groupTitle] = outList.length - 1
      } else {
        outList[indexMap[groupTitle]].children.push({
          label: title,
          url: url,
          type: type
        })
      }
    }
  }
  event.returnValue = outList
})

ipcMain.on('init-code', (event) => {
  let code = getCode()
  event.returnValue = code
})

ipcMain.on('verify-code', async (event, data) => {
  if (!data || !data.code) {
    event.returnValue = {
      status: 1003,
      message: 'Code不能为空'
    }
  } else {
    let res = await axios.get(`http://talkapi.dei2.com/enkel/index/validCode?code=${data.code}`)
    if (res.data && res.data.status === 200 && res.data.data && res.data.data.code) {
      setCode(res.data.data.code)
    }
    event.returnValue = res.data
  }
})

// https://www.jianshu.com/p/c0f368fd0388
ipcMain.on('get-fm-home-list', async (event, data) => {
  let res = await axios.get('http://yiapi.xinli001.com/fm/home-list.json?key=046b6a2a43dc6ff6e770255f57328f89')
  // console.log('======', res.data)
  event.returnValue = res.data
})

ipcMain.on('get-fm-recommend-detail', async (event, data) => {
  if (!data || !data.tag) {
    event.returnValue = {
      code: 1,
      count: 0,
      data: []
    }
  } else {
    // %E6%8A%91%E9%83%81%E7%97%87%E6%98%AF%E6%9D%A1%E9%BB%91%E7%8B%97
    let res = await axios.get(`http://bapi.xinli001.com/fm2/broadcast_list.json/?offset=${((data.pageIndex - 1) || 0) * (data.pageSize || 20)}&speaker_id=0&tag=${encodeURIComponent(data.tag)}&rows=${data.pageSize || 20}&key=046b6a2a43dc6ff6e770255f57328f89`)
    event.returnValue = Object.assign({}, res.data, {
      pageIndex: data.pageIndex || 1,
      pageSize: data.pageSize || 20
    })
  }
})

ipcMain.on('fm-get-mood', (event) => {
  event.returnValue = getMood()
})

ipcMain.on('fm-set-mood', (event, mood) => {
  setMood(mood || '迷茫')
})

ipcMain.on('fm-get-bg', (event) => {
  event.returnValue = getFmBg()
})

ipcMain.on('fm-set-bg', (event, bg) => {
  if (bg) {
    setFmBg(bg)
  }
})

ipcMain.on('fm-get-recommend', async (event, data) => {
  let offset = ((data.pageIndex - 1) || 0) * (data.pageSize || 20)
  let limit = data.pageSize || 20
  let res = await axios.get(`http://yiapi.xinli001.com/fm/newfm-list.json?offset=${offset}&limit=${limit}&key=046b6a2a43dc6ff6e770255f57328f89`)
  event.returnValue = Object.assign({}, res.data, {
    pageIndex: data.pageIndex || 1,
    pageSize: data.pageSize || 20
  })
})

ipcMain.on('fm-get-list-by-mood', async (event, data) => {
  let offset = ((data.pageIndex - 1) || 0) * (data.pageSize || 20)
  let limit = data.pageSize || 20
  let res = await axios.get(`http://bapi.xinli001.com/fm2/broadcast_list.json/?offset=${offset}&speaker_id=0&tag=${encodeURIComponent(data.mood || getMood())}&rows=${limit}&key=046b6a2a43dc6ff6e770255f57328f89`)
  event.returnValue = Object.assign({}, res.data, {
    pageIndex: data.pageIndex || 1,
    pageSize: data.pageSize || 20
  })
})

// ipcMain.on('fm-get-detail', async (event, d))

ipcMain.on('fm-get-radio-by-place', async (event, data) => {
  // http://tacc.radio.cn/pcpages/radiopages?callback=jQuery11220497578513847472_1578151724973&place_id=3225&date=2020-01-04&_=1578151724974
  let now = new Date()
  let date = now.getFullYear() + '-' + (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' + now.getDate() : now.getDate())
  let ts = now.getTime()
  let res = await axios.get(`http://tacc.radio.cn/pcpages/radiopages?callback=jQuery11220497578513847472_${ts}&place_id=${data.place || 3225}&date=${date}&_=${ts}`)
  res.data = res.data.replace(new RegExp('^jQuery11220497578513847472_' + ts + '\\\('), '').replace(/\)$/, '')
  try {
    res.data = JSON.parse(res.data)
  } catch (err) {
    res.data = {}
  }
  event.returnValue = res.data
})

// 搜主播、节目、tag
ipcMain.on('fm-search', async (event, data) => {
  let offset = ((data.pageIndex - 1) || 0) * (data.pageSize || 20)
  let limit = data.pageSize || 20
  let res = await axios.get(`http://bapi.xinli001.com/fm2/broadcast_list.json/?q=${encodeURIComponent(data.key)}&is_teacher=&offset=${offset}&speaker_id=0&rows=${limit}&key=046b6a2a43dc6ff6e770255f57328f89`)
  event.returnValue = Object.assign({}, res.data, {
    pageIndex: data.pageIndex || 1,
    pageSize: data.pageSize || 20
  })
})

/**
 * 获取主播的节目列表
 * anchorId: 主播ID
 */
ipcMain.on('fm-get-anchor-playlist', async (event, data) => {
  let offset = ((data.pageIndex - 1) || 0) * (data.pageSize || 20)
  let limit = data.pageSize || 20
  let res = await axios.get(`http://yiapi.xinli001.com/fm/diantai-jiemu-list.json?offset=${offset}&limit=${limit}&diantai_id=${data.anchorId}&key=046b6a2a43dc6ff6e770255f57328f89`)
  event.returnValue = Object.assign({}, res.data, {
    pageIndex: data.pageIndex || 1,
    pageSize: data.pageSize || 20
  })
})

/**
 * 获取主播详情
 * anchorId: 主播ID
 */
ipcMain.on('fm-get-anchor-detail', async (event, data) => {
  let res = await axios.get(`http://yiapi.xinli001.com/fm/diantai-detai.json?id=${data.anchorId}&key=046b6a2a43dc6ff6e770255f57328f89`)
  event.returnValue = Object.assign({}, res.data, {
    pageIndex: data.pageIndex || 1,
    pageSize: data.pageSize || 20
  })
})

/**
 * 获取主播列表
 */
ipcMain.on('fm-get-anchor-list', async (event, data) => {
  let offset = ((data.pageIndex - 1) || 0) * (data.pageSize || 20)
  let limit = data.pageSize || 20
  let res = await axios.get(`http://yiapi.xinli001.com/fm/diantai-new-list.json?offset=${offset}&limit=${limit}&key=046b6a2a43dc6ff6e770255f57328f89`)
  event.returnValue = Object.assign({}, res.data, {
    pageIndex: data.pageIndex || 1,
    pageSize: data.pageSize || 20
  })
})

ipcMain.on('fm-get-all-favorite', (event) => {
  event.returnValue = getAllFavoriteFm() || {
    radio: [],
    sound: [],
    anchor: []
  }
})

ipcMain.on('fm-set-favorite', (event, data) => {
  setFavoriteFm(data.data, data.type)
  event.returnValue = true
})

ipcMain.on('fm-remove-favorite', (event, data) => {
  removeFavoriteFm(data.data, data.type)
  event.returnValue = true
})

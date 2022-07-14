var CreateRDPDesktop=function(e,a){var o={m:{KeyAction:{NONE:0,DOWN:1,UP:2,SCROLL:3,EXUP:4,EXDOWN:5,DBLCLICK:6}},State:0};o.canvas=Q(e),"string"==typeof(o.CanvasId=e)&&(o.CanvasId=Q(e)),o.Canvas=o.CanvasId.getContext("2d"),o.ScreenWidth=o.width=1280,o.ScreenHeight=o.height=1024,o.m.onClipboardChanged=null;var i=!(o.onConsoleMessageChange=null),r="default";function n(e){return(!0===o.m.SwapMouse?[2,0,1,0,0]:[1,0,2,0,0])[e]}function c(e){o.State!=e&&(o.State=e,null!=o.onStateChanged&&o.onStateChanged(o,o.State))}function s(e){var t=o.Canvas.canvas.height/o.CanvasId.clientHeight,n=o.Canvas.canvas.width/o.CanvasId.clientWidth,s=function(e){var t=Array(2);for(t[0]=t[1]=0;e;)t[0]+=e.offsetLeft,t[1]+=e.offsetTop,e=e.offsetParent;return t}(o.Canvas.canvas),n=(e.pageX-s[0])*n,t=(e.pageY-s[1])*t;return e.addx&&(n+=e.addx),e.addy&&(t+=e.addy),{x:n,y:t}}o.mouseCursorActive=function(e){i!=e&&(i=e,o.CanvasId.style.cursor=1==e?r:"default")},o.Start=function(e,t,n){c(1),o.nodeid=e,o.port=t;var s={savepass:(o.credentials=n).savecred,useServerCreds:n.servercred,width:n.width,height:n.height,flags:n.flags,workingDir:n.workdir,alternateShell:n.altshell};n.width&&n.height&&(s.width=o.ScreenWidth=o.width=n.width,s.height=o.ScreenHeight=o.height=n.height,delete n.width,delete n.height),o.render=new Mstsc.Canvas.create(o.canvas),o.socket=new WebSocket("wss://"+window.location.host+a+"mstscrelay.ashx"),o.socket.binaryType="arraybuffer",o.socket.onopen=function(){c(2),o.socket.send(JSON.stringify(["infos",{ip:o.nodeid,port:o.port,screen:{width:o.width,height:o.height},domain:n.domain,username:n.username,password:n.password,options:s,locale:Mstsc.locale()}]))},o.socket.onmessage=function(e){if("string"==typeof e.data){var t=JSON.parse(e.data);switch(t[0]){case"rdp-connect":c(3),o.rotation=0,o.Canvas.setTransform(1,0,0,1,0,0),o.Canvas.canvas.width=o.ScreenWidth,o.Canvas.canvas.height=o.ScreenHeight,o.Canvas.fillRect(0,0,o.ScreenWidth,o.ScreenHeight),null!=o.m.onScreenSizeChange&&o.m.onScreenSizeChange(o,o.ScreenWidth,o.ScreenHeight,o.CanvasId);break;case"rdp-bitmap":if(null==o.bitmapData)break;var n=t[1];n.data=o.bitmapData,delete o.bitmapData,o.render.update(n);break;case"rdp-pointer":n=t[1];r=n,i&&(o.CanvasId.style.cursor=n);break;case"rdp-close":o.Stop();break;case"rdp-error":switch(o.consoleMessageTimeout=5,o.consoleMessage=t[1],delete o.consoleMessageArgs,2<t.length&&(o.consoleMessageArgs=[t[2]]),t[1]){case"NODE_RDP_PROTOCOL_X224_NEG_FAILURE":1==t[2]?o.consoleMessageId=9:2==t[2]?o.consoleMessageId=10:3==t[2]?o.consoleMessageId=11:4==t[2]?o.consoleMessageId=12:5==t[2]?o.consoleMessageId=13:6==t[2]?o.consoleMessageId=14:o.consoleMessageId=7;break;case"NODE_RDP_PROTOCOL_X224_NLA_NOT_SUPPORTED":o.consoleMessageId=8;break;default:o.consoleMessageId=null}o.onConsoleMessageChange&&o.onConsoleMessageChange(),o.Stop();break;case"rdp-clipboard":o.lastClipboardContent=t[1],o.m.onClipboardChanged&&o.m.onClipboardChanged(t[1]);break;case"ping":o.socket.send('["pong"]')}}else o.bitmapData=e.data},o.socket.onclose=function(){c(0)},c(1)},o.Stop=function(){o.Canvas.fillRect(0,0,o.ScreenWidth,o.ScreenHeight),o.socket&&o.socket.close()},o.m.setClipboard=function(e){o.socket&&o.socket.send(JSON.stringify(["clipboard",e]))},o.m.getClipboard=function(){return o.lastClipboardContent},o.m.mousemove=function(e){if(o.socket&&3==o.State){var t=s(e);if(!(t.x<0||t.y<0||t.x>o.ScreenWidth||t.y>o.ScreenHeight))return o.mouseNagleData=["mouse",t.x,t.y,0,!1],null==o.mouseNagleTimer&&(o.mouseNagleTimer=setTimeout(function(){o.socket.send(JSON.stringify(o.mouseNagleData)),o.mouseNagleTimer=null},50)),e.preventDefault(),!1}},o.m.mouseup=function(e){if(o.socket&&3==o.State){var t=s(e);if(!(t.x<0||t.y<0||t.x>o.ScreenWidth||t.y>o.ScreenHeight))return null!=o.mouseNagleTimer&&(clearTimeout(o.mouseNagleTimer),o.mouseNagleTimer=null),o.socket.send(JSON.stringify(["mouse",t.x,t.y,n(e.button),!1])),e.preventDefault(),!1}},o.m.mousedown=function(e){if(o.socket&&3==o.State){var t=s(e);if(!(t.x<0||t.y<0||t.x>o.ScreenWidth||t.y>o.ScreenHeight))return null!=o.mouseNagleTimer&&(clearTimeout(o.mouseNagleTimer),o.mouseNagleTimer=null),o.socket.send(JSON.stringify(["mouse",t.x,t.y,n(e.button),!0])),e.preventDefault(),!1}},o.m.handleKeyUp=function(e){if(o.socket&&3==o.State)return o.socket.send(JSON.stringify(["scancode",Mstsc.scancode(e),!1])),e.preventDefault(),!1},o.m.handleKeyDown=function(e){if(o.socket&&3==o.State)return o.socket.send(JSON.stringify(["scancode",Mstsc.scancode(e),!0])),e.preventDefault(),!1},o.m.mousewheel=function(e){if(o.socket&&3==o.State){var t=s(e);if(!(t.x<0||t.y<0||t.x>o.ScreenWidth||t.y>o.ScreenHeight)){null!=o.mouseNagleTimer&&(clearTimeout(o.mouseNagleTimer),o.mouseNagleTimer=null);var n=0;return e.detail?n=120*e.detail:e.wheelDelta&&(n=3*e.wheelDelta),o.m.ReverseMouseWheel&&(n*=-1),0!=n&&o.socket.send(JSON.stringify(["wheel",t.x,t.y,n,!1,!1])),e.preventDefault(),!1}}},o.m.SendStringUnicode=function(e){o.socket&&3==o.State&&o.socket.send(JSON.stringify(["utype",e]))},o.m.SendKeyMsgKC=function(e,t,n){if(3==o.State)if("object"==typeof e)for(var s in e)o.m.SendKeyMsgKC(e[s][0],e[s][1],e[s][2]);else{t=d[t];null!=t&&o.socket.send(JSON.stringify(["scancode",t,0!=(1&e)]))}},o.m.mousedblclick=function(){},o.m.handleKeyPress=function(){},o.m.setRotation=function(){},o.m.sendcad=function(){o.socket.send(JSON.stringify(["scancode",29,!0])),o.socket.send(JSON.stringify(["scancode",56,!0])),o.socket.send(JSON.stringify(["scancode",57427,!0])),o.socket.send(JSON.stringify(["scancode",57427,!1])),o.socket.send(JSON.stringify(["scancode",56,!1])),o.socket.send(JSON.stringify(["scancode",29,!1]))};var d={9:15,16:42,17:29,18:56,27:1,33:57417,34:57425,35:57423,36:57415,37:57419,38:57416,39:57421,40:57424,44:57399,45:57426,46:57427,65:30,66:48,67:46,68:32,69:18,70:33,71:34,72:35,73:23,74:36,75:37,76:38,77:50,78:49,79:24,80:25,81:16,82:19,83:31,84:20,85:22,86:47,87:17,88:45,89:21,90:44,91:57435,112:59,113:60,114:61,115:62,116:63,117:64,118:65,119:66,120:67,121:68,122:87,123:88};return o}
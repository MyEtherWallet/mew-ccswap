(function(){var e={7099:function(e,t,a){"use strict";var n=a(3862),i=a(3396),r=a(7718),s=a(3140);function o(e,t,a,n,o,l){const c=(0,i.up)("router-view");return(0,i.wg)(),(0,i.j4)(r.q,null,{default:(0,i.w5)((()=>[(0,i.Wm)(s.O,null,{default:(0,i.w5)((()=>[(0,i.Wm)(c)])),_:1})])),_:1})}var l=(0,i.aZ)({name:"App"}),c=a(89);const d=(0,c.Z)(l,[["render",o]]);var u=d,m=a(678),p=a(7139),f=a(4870),h=a.p+"img/icon-visa.a210c6d6.svg",g=a.p+"img/icon-master.e13b09eb.svg",y=a.p+"img/icon-apple-pay.8729e08b.svg",w=a.p+"img/icon-simplex.36f689db.svg",A=a.p+"img/icon-mew-logo-dark.49ceaae5.svg";const E=e=>((0,i.dD)("data-v-638a42a6"),e=e(),(0,i.Cn)(),e),v=["src"],S={class:"d-flex align-center",style:{"margin-top":"60px"}},R=E((()=>(0,i._)("div",{class:"mr-2 text--secondary"},"Powered by",-1))),b=["src"],C={class:"d-flex flex-wrap align-center mt-4"},I=E((()=>(0,i._)("div",{class:"mr-2 text--secondary"},[(0,i.Uk)(" We accept "),(0,i._)("u",{class:"font-weight-medium text--secondary"}," Visa "),(0,i.Uk)(" , "),(0,i._)("u",{class:"font-weight-medium text--secondary"}," Apple Pay "),(0,i.Uk)(" and "),(0,i._)("u",{class:"font-weight-medium text--secondary"}," MasterCard ")],-1))),U={class:"d-flex align-center"},k=["src"],J=["src"],F=["src"];var B=(0,i.aZ)({__name:"HeaderComponent",setup(e){return(e,t)=>((0,i.wg)(),(0,i.iD)("div",null,[(0,i._)("img",{src:(0,f.SU)(A),alt:"MEW",height:"36"},null,8,v),(0,i._)("div",{class:(0,p.C_)((e.$vuetify.display.smAndUp,"heading-1")),style:(0,p.j5)(e.$vuetify.display.smAndUp?"margin-top: 100px; max-width: 340px":"margin-top: 50px;  max-width: 340px")}," Buy Ethereum at Lower Rates ",6),(0,i._)("div",S,[R,(0,i._)("img",{src:(0,f.SU)(w),alt:"Simplex",height:"30"},null,8,b)]),(0,i._)("div",C,[I,(0,i._)("div",U,[(0,i._)("img",{class:"mr-2",src:(0,f.SU)(h),alt:"Visa",height:"22"},null,8,k),(0,i._)("img",{class:"mr-2",src:(0,f.SU)(y),alt:"Visa",height:"22"},null,8,J),(0,i._)("img",{src:(0,f.SU)(g),alt:"Master",height:"22"},null,8,F)])])]))}});const M=(0,c.Z)(B,[["__scopeId","data-v-638a42a6"]]);var Q=M,N=a.p+"img/icon-mew-logo-light.b7102cfa.svg",T=a(7312),x=a(3369);const K=e=>((0,i.dD)("data-v-8f248acc"),e=e(),(0,i.Cn)(),e),O={class:"component--footer py-2"},q=["src"],W=K((()=>(0,i._)("div",{class:"font-weight-regular mb-3"},[(0,i.Uk)(" Need Ethereum wallet? Get one from "),(0,i._)("a",{href:"https://www.myetherwallet.com/wallet/create",target:"_blank"},[(0,i._)("span",{class:"text--primary font-weight-bold"}," myetherwallet.com ")])],-1))),P=(0,i.Uk)(" Get Ethereum wallet ");var z=(0,i.aZ)({__name:"FooterComponent",setup(e){const t=e=>{const t=window.open(e,"_blank");t?.focus()},a=(new Date).getFullYear();return(e,n)=>((0,i.wg)(),(0,i.iD)("div",O,[(0,i.Wm)(x.K,{class:"text-center"},{default:(0,i.w5)((()=>[(0,i._)("img",{src:(0,f.SU)(N),alt:"MEW",height:"25"},null,8,q),(0,i._)("div",null,"©"+(0,p.zw)((0,f.SU)(a))+" MyEtherWallet Inc. All rights reserved",1),W,(0,i.Wm)(T.T,{onClick:n[0]||(n[0]=e=>t("https://www.myetherwallet.com/wallet/create")),size:"small"},{default:(0,i.w5)((()=>[P])),_:1})])),_:1})]))}});const Y=(0,c.Z)(z,[["__scopeId","data-v-8f248acc"]]);var V=Y,D=(a(6699),a(7629)),j=a.n(D),Z=a(6265),L=a.n(Z),G=a(4806);const H=["ETH","BNB","MATIC","DOT","KSM"],X=["USD","EUR","JPY","AUD","CAD","GBP"],_={USD:"$",RUB:"₽",EUR:"€",JPY:"¥",AUD:"AU$",CAD:"CA$",GBP:"£"};async function $(e,t,a,n,i="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"){const r="https://mainnet.mewwallet.dev/purchase/simplex/quote";return await L().get(r,{params:{id:`WEB|${i}`,fiatCurrency:e,cryptoCurrency:t,requestedCurrency:a,requestedAmount:(0,G.toNumber)(n)}}).then((e=>e.data)).catch((e=>{throw e}))}const ee=e=>{const{data:t}=e;if(Array.isArray(t))return t.find((e=>"SIMPLEX"===e.name))};async function te(e){const t="https://mainnet.mewwallet.dev/v3/purchase/providers/ios";if(e)return await L().get(t,{params:{iso:"us",cryptoCurrency:e}}).then((e=>ee(e))).catch((e=>{throw e}));const a=["ETH","MATIC","BNB","DOT","KSM"];return Promise.all(a.map((e=>L().get(t,{params:{iso:"us",cryptoCurrency:e}}).then((e=>ee(e))).catch((e=>{throw e}))))).catch((e=>{throw e}))}a(1703);const ae="https://mainnet.mewwallet.dev",ne="https://mainnet.mewwallet.dev/purchase/simplex/order";async function ie(e,t){return await L().get(ne,{params:{paymentId:e,address:t}}).then((e=>e.data)).catch((e=>e))}async function re(e){const t=`WEB|${e["destination_wallet[address]"]}`,a=`${ae}/v2/purchase/simplex/order?id=${t}&fiatCurrency=${e["fiat_total_amount[currency]"]}&requestedCurrency=${e["fiat_total_amount[currency]"]}&requestedAmount=${e["fiat_total_amount[amount]"]}&address=${e["destination_wallet[address]"]}`;window.location.href=encodeURI(a)}async function se(e,t,a,n,i){let r=null;try{r=await $(e,t,a,n,i)}catch(o){throw new Error(o)}const s=await ie(r.payment_id,i);return await re(s.form),s.form}var oe=a(513),le=a.n(oe),ce=a.p+"img/icon-mew-wallet.5236daa6.png",de=a(7802),ue=a(2121),me=a(3173),pe=a(421),fe=a(3444),he=a(9509);const ge={class:"component--buy-form elevated-box pa-3 pa-sm-6 pa-md-8",ref:"formDiv"},ye={class:"mb-10"},we={class:"d-flex align-center"},Ae=(0,i._)("div",{class:"heading-4 text-uppercase"},"Price",-1),Ee={key:0,class:"ml-2"},ve=(0,i._)("span",{class:"h3 font-weight-regular mr-1 text--mew"},"Loading",-1),Se={class:"d-flex mt-2"},Re={class:"mb-10"},be=(0,i._)("div",{class:"d-flex align-center"},[(0,i._)("div",{class:"heading-4 text-uppercase"},"Amount")],-1),Ce={class:"d-flex mt-2"},Ie=(0,i._)("div",{class:"d-sm-flex align-center justify-space-between mb-2"},[(0,i._)("div",{class:"heading-4 text-uppercase mr-2"},"To Address"),(0,i._)("a",{class:"small d-block mt-n1 mt-sm-0",href:"https://www.myetherwallet.com/wallet/create",target:"_blank"}," Don't have one? ")],-1),Ue={key:0,class:"pt-2 text-center"},ke=(0,i._)("div",{class:"text--white"},"Continue",-1),Je=(0,i._)("div",{class:"text--secondary mt-6"}," You will be redirected to the partner's site ",-1),Fe={key:1,class:"text-center py-5"},Be=(0,i._)("div",{class:"text-center font-weight-bold mt-3",style:{"line-height":"1.4rem"}}," Processing purchase.... ",-1),Me={class:"text-center pa-3",style:{"max-width":"350px"}},Qe=["src"],Ne={key:0,class:"text--white"},Te=(0,i.Uk)(" Uh oh... Maximum daily crypto buy limit is between "),xe=(0,i._)("span",{style:{"font-size":"1.2rem"},class:"text--white font-weight-bold"}," USD $50 ~ $20,000 ",-1),Ke=[Te,xe],Oe={key:1,style:{"font-size":"1.2rem"},class:"text--white font-weight-bold"},qe=(0,i.Uk)(" Close ");var We=(0,i.aZ)({__name:"BuyForm",setup(e){const t=ce,a="0";(0,i.bv)((async()=>{w(),v(),await h(),y(),setInterval(h,12e4)}));const n=X,r=H;let s={ETH:{conversion_rates:{},limits:{},prices:{}},MATIC:{conversion_rates:{},limits:{},prices:{}},BNB:{conversion_rates:{},limits:{},prices:{}},DOT:{conversion_rates:{},limits:{},prices:{}},KSM:{conversion_rates:{},limits:{},prices:{}}};const o=(0,f.qj)({fiatAmount:a,fiatSelected:"USD",cryptoAmount:"1",cryptoSelected:"ETH",address:"",validAddress:!1,addressErrorMsg:"",reCaptchaToken:"",addressError:!1}),l=(0,f.qj)({data:!1,showAlert:!1,processingBuyForm:!1,alertMessage:""});(0,i.YP)((()=>o.cryptoSelected),(()=>{v(),g()})),(0,i.YP)((()=>o.fiatSelected),(()=>{v(),y()})),(0,i.YP)((()=>o.fiatAmount),(()=>{l.data||m()})),(0,i.YP)((()=>o.cryptoAmount),(()=>{l.data||m()}));const c=(0,i.Fl)((()=>u.value&&o.fiatSelected&&o.cryptoSelected&&o.address&&!o.addressError&&""===o.addressErrorMsg&&""===l.alertMessage&&o.validAddress)),d=[e=>!!((0,G.isString)(e)&&e?.length>0)||(!!(0,G.isNumber)(e)||"Must be a valid number")],u=(0,i.Fl)((()=>{const{cryptoSelected:e,fiatAmount:t,fiatSelected:a}=o;if(!s[e].limits[a])return!1;const n=s[e].limits[a],i=new(j())(t||0),r=i.gte(new(j())(n.min))&&i.lte(new(j())(n.max));return r})),m=()=>{const e=s[o.cryptoSelected].limits[o.fiatSelected];if(!u.value)return l.showAlert=!0,void(l.alertMessage=`Fiat price must be between ${_[o.fiatSelected]}${e.min} and ${_[o.fiatSelected]}${e.max}`);l.showAlert=!1,l.alertMessage=""},h=async()=>{try{l.data=!0;const e=await te();e.forEach((e=>{const t={conversion_rates:{},limits:{},prices:{}};e.conversion_rates.forEach((e=>t.conversion_rates[e.fiat_currency]=e.exchange_rate)),e.limits.forEach((e=>{"WEB"===e.type&&(t.limits[e.fiat_currency]=e.limit)})),e.prices.forEach((e=>t.prices[e.fiat_currency]=e.price)),s[e.crypto_currencies[0]]=t})),l.data=!1}catch(e){A(e)}},g=()=>{const{fiatSelected:e,fiatAmount:t,cryptoSelected:a}=o,n=new(j())(s[a].prices[e]),i=new(j())(t||"0");o.cryptoAmount=i.dividedBy(n).toString()},y=()=>{const e=new(j())(s[o.cryptoSelected].prices[o.fiatSelected]),t=new(j())(o.cryptoAmount||"0");o.fiatAmount=t.times(e).toFixed(2).toString()},w=()=>{const e=window.location.search;if(e){const t=new URLSearchParams(e),a=t.get("crypto_amount"),n=t.get("fiat"),i=t.get("crypto"),r=t.get("to");o.fiatSelected=n||"USD",o.fiatAmount=a||"100",o.cryptoSelected=i||"ETH",o.cryptoAmount=a||"1",o.address=r||""}},A=e=>{const t=new(j())(o.fiatAmount).gt(0);if(t){const t=(0,G.isObject)(e.response.data.error);if(t){const t=e.response.data.error.hasOwnProperty("errors");t&&(l.alertMessage=e.response.data.error.errors[0].message)}else l.alertMessage=e.response.data.error}},E=e=>e&&(0,de.isHexStrict)(e)&&(0,de.isAddress)(e),v=()=>{const e=["DOT","KSM"],t=e.includes(o.cryptoSelected)?(0,ue.U)(o.address,!1,"DOT"===o.cryptoSelected?0:2):le().validate(o.address,o.cryptoSelected)&&E(o.address);t?(o.addressErrorMsg="",o.addressError=!1,o.validAddress=!0):o.address?(o.addressErrorMsg=`Please provide a valid ${o.cryptoSelected} address`,o.validAddress=!1):(o.addressErrorMsg="",o.validAddress=!1)},S=()=>{l.processingBuyForm=!0,se(o.fiatSelected,o.cryptoSelected,o.fiatSelected,o.fiatAmount,o.address)};return(e,a)=>((0,i.wg)(),(0,i.iD)("div",ge,[(0,i._)("div",ye,[(0,i._)("div",we,[Ae,l.data?((0,i.wg)(),(0,i.iD)("div",Ee,[ve,(0,i.Wm)(me.L,{size:11,width:2,indeterminate:""})])):(0,i.kq)("",!0)]),(0,i._)("div",Se,[(0,i.Wm)(he.h,{onInput:g,type:"number",modelValue:o.fiatAmount,"onUpdate:modelValue":a[0]||(a[0]=e=>o.fiatAmount=e),modelModifiers:{number:!0},required:"",dense:"",disabled:l.data,rules:d},null,8,["modelValue","disabled"]),(0,i.Wm)(pe.r,{style:{"max-width":"120px"},modelValue:o.fiatSelected,"onUpdate:modelValue":a[1]||(a[1]=e=>o.fiatSelected=e),items:(0,f.SU)(n),disabled:l.data},null,8,["modelValue","items","disabled"])])]),(0,i._)("div",Re,[be,(0,i._)("div",Ce,[(0,i.Wm)(he.h,{onInput:y,type:"number",modelValue:o.cryptoAmount,"onUpdate:modelValue":a[2]||(a[2]=e=>o.cryptoAmount=e),modelModifiers:{number:!0},required:"",dense:"",rules:d,disabled:l.data},null,8,["modelValue","disabled"]),(0,i.Wm)(pe.r,{style:{"max-width":"120px"},modelValue:o.cryptoSelected,"onUpdate:modelValue":a[3]||(a[3]=e=>o.cryptoSelected=e),items:(0,f.SU)(r),disabled:l.data},null,8,["modelValue","items","disabled"])])]),(0,i._)("div",null,[Ie,(0,i.Wm)(he.h,{modelValue:o.address,"onUpdate:modelValue":a[4]||(a[4]=e=>o.address=e),required:"",dense:"","error-messages":o.addressErrorMsg,onKeyup:v,ref:"address"},null,8,["modelValue","error-messages"])]),l.processingBuyForm?((0,i.wg)(),(0,i.iD)("div",Fe,[(0,i.Wm)(me.L,{size:70,width:7,indeterminate:"",color:"#05c0a5"}),Be])):((0,i.wg)(),(0,i.iD)("div",Ue,[(0,i._)("div",null,[(0,i.Wm)(T.T,{rounded:"pill",disabled:!(0,f.SU)(c),"min-height":"60px","min-width":"200px",color:"#05C0A5",onClick:S},{default:(0,i.w5)((()=>[ke])),_:1},8,["disabled"])]),Je])),(0,i.Wm)(fe.v,{modelValue:l.showAlert,"onUpdate:modelValue":a[6]||(a[6]=e=>l.showAlert=e),"multi-line":"",timeout:"5000"},{default:(0,i.w5)((()=>[(0,i._)("div",Me,[(0,i._)("img",{src:(0,f.SU)(t),alt:"MEW doggy",style:{"max-width":"80px"}},null,8,Qe),""===l.alertMessage?((0,i.wg)(),(0,i.iD)("h3",Ne,Ke)):((0,i.wg)(),(0,i.iD)("h3",Oe,(0,p.zw)(l.alertMessage),1)),(0,i.Wm)(T.T,{class:"mt-3",onClick:a[5]||(a[5]=e=>l.showAlert=!1),size:"small"},{default:(0,i.w5)((()=>[qe])),_:1})])])),_:1},8,["modelValue"])],512))}});const Pe=We;var ze=Pe,Ye="data:image/png;base64,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",Ve="data:image/png;base64,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",De="data:image/png;base64,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",je="data:image/png;base64,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",Ze=a(6824),Le=a(8521);const Ge=e=>((0,i.dD)("data-v-33950a10"),e=e(),(0,i.Cn)(),e),He=Ge((()=>(0,i._)("h1",{class:"mb-9"}," We have increased maximum buy limits for hassle free transactions ",-1))),Xe={class:"elevated-box-small pa-10"},_e={class:"heading-2 text--mew mb-2"},$e={class:"font-weight-medium text--secondary"},et=Ge((()=>(0,i._)("h1",{class:"mb-9"}," That is the reason why millions of our users choose us ",-1))),tt={class:"d-flex align-center pb-8"},at=["src"],nt={class:"heading-3 mb-1"},it={key:0,style:{"max-width":"350px"},class:"text--secondary heading-5"},rt={key:1,class:"text--secondary heading-5",style:{"max-width":"350px"}},st=(0,i.Uk)(" Feel free to contact "),ot=Ge((()=>(0,i._)("a",{href:"mailto:support@simplex.com"},"support@simplex.com",-1))),lt=(0,i.Uk)(" should you have questions "),ct=[st,ot,lt];var dt=(0,i.aZ)({__name:"PromoComponent",setup(e){const t=[{title:"For your first transaction",description:"If you are buying coins very first time, you can buy up to $20,000 worth of coins.",amount:"$50 to $20,000",rate:"for first buy"},{title:"Daily limit",description:"You can buy up to $20,000 worth of coins daily.",amount:"Up to $20,000",rate:"/day"},{title:"Monthly limit",description:"You can buy up to $50,000 worth of coins monthly.",amount:"Up to $50,000",rate:"/month"}],a=[{icon:Ye,title:"Reasonable fee",description:"Extra charges apply in addition to the rate provided, including a 1% MyEtherWallet fee."},{icon:Ve,title:"Quick transactions",description:"We offer lightning-fast transactions typically taking just minutes."},{icon:De,title:"Easy verification",description:"Payment process is pretty simple and takes just a few steps."},{icon:je,title:"Instant support"}];return(e,n)=>((0,i.wg)(),(0,i.iD)("div",{class:"component--promo",style:(0,p.j5)(e.$vuetify.display.lgAndUp?"padding-top: 150px":"padding-top: 100px")},[(0,i._)("div",null,[He,(0,i.Wm)(Ze.o,null,{default:(0,i.w5)((()=>[((0,i.wg)(),(0,i.iD)(i.HY,null,(0,i.Ko)(t,((e,t)=>(0,i.Wm)(Le.D,{cols:"12",md:"4",key:t},{default:(0,i.w5)((()=>[(0,i._)("div",Xe,[(0,i._)("div",_e,(0,p.zw)(e.amount),1),(0,i._)("h2",$e,(0,p.zw)(e.title),1)])])),_:2},1024))),64))])),_:1})]),(0,i._)("div",{style:(0,p.j5)(e.$vuetify.display.mdAndUp?"margin-top: 200px":"margin-top: 100px")},[et,(0,i.Wm)(Ze.o,null,{default:(0,i.w5)((()=>[((0,i.wg)(),(0,i.iD)(i.HY,null,(0,i.Ko)(a,((t,a)=>(0,i.Wm)(Le.D,{cols:"12",md:"6",key:a,class:(0,p.C_)(e.$vuetify.display.mdAndUp?"":"d-flex justify-center")},{default:(0,i.w5)((()=>[(0,i._)("div",tt,[(0,i._)("img",{class:"mr-4",src:t.icon,alt:"Promo"},null,8,at),(0,i._)("div",null,[(0,i._)("div",nt,(0,p.zw)(t.title),1),t.description?((0,i.wg)(),(0,i.iD)("div",it,(0,p.zw)(t.description),1)):((0,i.wg)(),(0,i.iD)("div",rt,ct))])])])),_:2},1032,["class"]))),64))])),_:1})],4)],4))}});const ut=(0,c.Z)(dt,[["__scopeId","data-v-33950a10"]]);var mt=ut,pt=a.p+"img/bg-bar-old.a1ec2988.svg",ft=(0,i.aZ)({__name:"LandingPage",setup(e){return(e,t)=>((0,i.wg)(),(0,i.iD)("div",{class:(0,p.C_)(["pt-15 component--landing-page-old-design",[e.$vuetify.display.mdAndUp?"background-lg":"background-sm"]]),style:(0,p.j5)({"background-image":`url(${(0,f.SU)(pt)})`})},[(0,i.Wm)(x.K,null,{default:(0,i.w5)((()=>[(0,i.Wm)(Ze.o,null,{default:(0,i.w5)((()=>[(0,i.Wm)(Le.D,{cols:"12",md:"5",lg:"6"},{default:(0,i.w5)((()=>[(0,i.Wm)(Q)])),_:1}),(0,i.Wm)(Le.D,{cols:"12",md:"7",lg:"6"},{default:(0,i.w5)((()=>[(0,i.Wm)(ze)])),_:1})])),_:1}),(0,i.Wm)(Ze.o,null,{default:(0,i.w5)((()=>[(0,i.Wm)(Le.D,null,{default:(0,i.w5)((()=>[(0,i.Wm)(mt)])),_:1})])),_:1})])),_:1}),(0,i.Wm)(V)],6))}});const ht=(0,c.Z)(ft,[["__scopeId","data-v-c03687de"]]);var gt=ht;const yt=(0,m.r5)("/mew-ccswap/"),wt=(0,m.p7)({history:yt,routes:[{path:"/",name:"home",component:gt}]});var At=wt,Et=a(65),vt=(0,Et.MT)({state:{},getters:{},mutations:{},actions:{},modules:{}}),St=(a(9773),a(8685)),Rt=(0,St.Rd)();async function bt(){const e=await a.e(461).then(a.t.bind(a,3657,23));e.load({google:{families:["Roboto:100,300,400,500,700,900&display=swap"]}})}bt(),(0,n.ri)({render:()=>(0,i.h)(u)}).use(At).use(vt).use(Rt).mount("#app")},6601:function(){},9214:function(){},7790:function(){},2361:function(){},4616:function(){},6567:function(){},7500:function(){}},t={};function a(n){var i=t[n];if(void 0!==i)return i.exports;var r=t[n]={id:n,loaded:!1,exports:{}};return e[n].call(r.exports,r,r.exports,a),r.loaded=!0,r.exports}a.m=e,function(){a.amdO={}}(),function(){var e=[];a.O=function(t,n,i,r){if(!n){var s=1/0;for(d=0;d<e.length;d++){n=e[d][0],i=e[d][1],r=e[d][2];for(var o=!0,l=0;l<n.length;l++)(!1&r||s>=r)&&Object.keys(a.O).every((function(e){return a.O[e](n[l])}))?n.splice(l--,1):(o=!1,r<s&&(s=r));if(o){e.splice(d--,1);var c=i();void 0!==c&&(t=c)}}return t}r=r||0;for(var d=e.length;d>0&&e[d-1][2]>r;d--)e[d]=e[d-1];e[d]=[n,i,r]}}(),function(){a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,{a:t}),t}}(),function(){var e,t=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__};a.t=function(n,i){if(1&i&&(n=this(n)),8&i)return n;if("object"===typeof n&&n){if(4&i&&n.__esModule)return n;if(16&i&&"function"===typeof n.then)return n}var r=Object.create(null);a.r(r);var s={};e=e||[null,t({}),t([]),t(t)];for(var o=2&i&&n;"object"==typeof o&&!~e.indexOf(o);o=t(o))Object.getOwnPropertyNames(o).forEach((function(e){s[e]=function(){return n[e]}}));return s["default"]=function(){return n},a.d(r,s),r}}(),function(){a.d=function(e,t){for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}}(),function(){a.f={},a.e=function(e){return Promise.all(Object.keys(a.f).reduce((function(t,n){return a.f[n](e,t),t}),[]))}}(),function(){a.u=function(e){return"js/webfontloader.123a661b.js"}}(),function(){a.miniCssF=function(e){}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="mew-ccswap:";a.l=function(n,i,r,s){if(e[n])e[n].push(i);else{var o,l;if(void 0!==r)for(var c=document.getElementsByTagName("script"),d=0;d<c.length;d++){var u=c[d];if(u.getAttribute("src")==n||u.getAttribute("data-webpack")==t+r){o=u;break}}o||(l=!0,o=document.createElement("script"),o.charset="utf-8",o.timeout=120,a.nc&&o.setAttribute("nonce",a.nc),o.setAttribute("data-webpack",t+r),o.src=n),e[n]=[i];var m=function(t,a){o.onerror=o.onload=null,clearTimeout(p);var i=e[n];if(delete e[n],o.parentNode&&o.parentNode.removeChild(o),i&&i.forEach((function(e){return e(a)})),t)return t(a)},p=setTimeout(m.bind(null,void 0,{type:"timeout",target:o}),12e4);o.onerror=m.bind(null,o.onerror),o.onload=m.bind(null,o.onload),l&&document.head.appendChild(o)}}}(),function(){a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){a.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){a.p="/mew-ccswap/"}(),function(){var e={143:0};a.f.j=function(t,n){var i=a.o(e,t)?e[t]:void 0;if(0!==i)if(i)n.push(i[2]);else{var r=new Promise((function(a,n){i=e[t]=[a,n]}));n.push(i[2]=r);var s=a.p+a.u(t),o=new Error,l=function(n){if(a.o(e,t)&&(i=e[t],0!==i&&(e[t]=void 0),i)){var r=n&&("load"===n.type?"missing":n.type),s=n&&n.target&&n.target.src;o.message="Loading chunk "+t+" failed.\n("+r+": "+s+")",o.name="ChunkLoadError",o.type=r,o.request=s,i[1](o)}};a.l(s,l,"chunk-"+t,t)}},a.O.j=function(t){return 0===e[t]};var t=function(t,n){var i,r,s=n[0],o=n[1],l=n[2],c=0;if(s.some((function(t){return 0!==e[t]}))){for(i in o)a.o(o,i)&&(a.m[i]=o[i]);if(l)var d=l(a)}for(t&&t(n);c<s.length;c++)r=s[c],a.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return a.O(d)},n=self["webpackChunkmew_ccswap"]=self["webpackChunkmew_ccswap"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var n=a.O(void 0,[998],(function(){return a(7099)}));n=a.O(n)})();
//# sourceMappingURL=app.4b4b0446.js.map
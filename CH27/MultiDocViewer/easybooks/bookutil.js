//---------------------addfavor
function addFavor( bid )
{
	ajaxpool.sendReq( "myzoneResource?_method=addFavor&bid="+bid, addFavorResp, 1 );
}

function addFavorResp( text, sid )
{
	bdAlert( text );
}
//--------------------clickcount
function clickCount( bid )
{
	ajaxpool.postReq( "bookDetail?_method=clickCounter", "b="+bid, null, 2 );
}
//--------------------loadStationEditor
function loadStationEditor( bid )
{
	ajaxpool.sendReq( "bookDetail?_method=readStationEditor&b="+bid, readStationEditor, 4, "xml" );
}
function readStationEditor( doc, sid )
{
	if(!doc || doc.parserError && doc.parseError.errorCode != 0 || !doc.documentElement) {
		return;
	}
	var root = doc.documentElement;
	var pro = root.childNodes[0];
	var se = root.childNodes[1];
	var flag = root.childNodes[2].childNodes[0].nodeValue;
	
	if(flag == 1){
		var provice = pro.childNodes[0].nodeValue;
		var seAddr = se.childNodes[0].childNodes[0].nodeValue;
		var seZipcode = se.childNodes[1].childNodes[0].nodeValue;
		var seEmail = se.childNodes[2].childNodes[0].nodeValue;
		var sePhone = se.childNodes[3].childNodes[0].nodeValue;
		var seMobilphone = se.childNodes[4].childNodes[0].nodeValue;
		var seMember = se.childNodes[5].childNodes[0].nodeValue;
			
		var template = document.getElementById("s_e_text").value;
		var __ct = "";
		__ct = template.replace( /\$\(provice\)/g, provice).replace( /\$\(seAddr\)/g, seAddr).replace( /\$\(seZipcode\)/g, seZipcode)
						.replace( /\$\(seEmail\)/g, seEmail).replace( /\$\(sePhone\)/g, sePhone)
						.replace( /\$\(seMobilphone\)/g, seMobilphone).replace( /\$\(seMember\)/g, seMember);
		document.getElementById("stationeditor").innerHTML = __ct;
	}
}
//--------------------readstate
//http://192.168.1.254:800/hxedu/bookDetail?_method=readState&b=0000
function readState( bid )
{
	ajaxpool.sendReq( "bookDetail?_method=readState&b="+bid, readStateResp, 3, "xml" );
}
function readStateResp( doc, sid )
{
	if(!doc || doc.parserError && doc.parseError.errorCode != 0 || !doc.documentElement) {
		return;
	}
	try{
		var root = doc.documentElement;
		var state = root.childNodes[0];
		var state1 = parseInt(state.childNodes[0].childNodes[0].nodeValue,10);
		var state2 = parseInt(state.childNodes[1].childNodes[0].nodeValue,10);
		var state3 = parseInt(state.childNodes[2].childNodes[0].nodeValue,10);
		
		if( document.getElementById("allReadState") )
			document.getElementById( "allReadState" ).innerHTML = state1 + state2 + state3;
		
		if( document.getElementById("brs001") )
			document.getElementById( "brs001" ).innerHTML = state2;
		if( document.getElementById("brs002") )
			document.getElementById( "brs002" ).innerHTML = state3;
		if( document.getElementById("brs003") )
			document.getElementById( "brs003" ).innerHTML = state1;
		
		try{
			if( onReadStateResp && typeof( onReadStateResp ) == 'function' )
				onReadStateResp({"state1":state1, "state2":state2, "state3":state3});
		}
		catch( e){}
		
		var recents = root.childNodes[1].childNodes;
		
		var template = document.getElementById("brd21_1_tplt").value;
		var __ct = "";
		for( var i=0;i<recents.length;i++ ){
			var recent = recents[i];
			var memid = recent.childNodes[0].childNodes.length ?  recent.childNodes[0].childNodes[0].nodeValue : "";
			var memname = recent.childNodes[1].childNodes.length ? recent.childNodes[1].childNodes[0].nodeValue : "????????????";
			var memheadurl = recent.childNodes[2].childNodes.length ? recent.childNodes[2].childNodes[0].nodeValue : "";
			var readstate = recent.childNodes[3].childNodes[0].nodeValue;
			var elapsetime = recent.childNodes[4].childNodes[0].nodeValue;
			
			var elapseText = getElapseText( elapsetime ) + getElapseState( readstate );
			
			__ct += template.replace( /\$\(pic\)/g, memheadurl ).replace( /\$\(uid\)/g, memid )
				.replace( /\$\(un\)/g, memname ).replace( /\$\(state\)/g, elapseText );
		}

		document.getElementById("brd21_1").innerHTML = __ct;
	}
	catch( e ){alert(e.message );}
}
function getElapseText( elapsetime )
{
	elapsetime = Math.ceil(elapsetime/1000);
	return elapsetime > 2592000 ? "?????????" : elapsetime > 86400 ? (Math.ceil(elapsetime/86400) + "??????") :
			elapsetime > 3600 ? (Math.ceil(elapsetime/3600) + "?????????") : elapsetime > 60 ? (Math.ceil(elapsetime/60) + "?????????") :
			elapsetime > 0 ? (elapsetime + "??????") : "??????";
}
function getElapseState( readstate )
{
	return readstate == 1? "??????" : readstate == 2 ? "??????" : readstate == 3? "??????" : "??????";
}
//---------------------readstateclick
function readStateClick( bid, state )
{
	ajaxpool.postReq( "bookDetail?_method=readStateClick", "b="+bid+"&st="+state, readStateClickResp, bid );
}
function readStateClickResp( text, bid )
{
	if( text == "SUCCE" ){
		bdAlert( "??????????????????????????????", 300, 140 );
		bdClose( 3000 );
		readState( bid );
	}else if( text == "NOT_LOGIN" ){
		bdAlert( "????????????????????????????????????", 300, 140 );
	}else if( text == "NO_BOOK" ){
		bdAlert( "?????????????????????", 300, 140 );
	}else if( text == "WAIT_TOMORO" ){
		bdAlert( "?????????????????????????????????????????????..", 300, 140 );
	}
}

//---------------------buybook
var mp_pop = null;
function showBuyURL( url ){
	if( mp_pop === null ){
		mp_pop = new Popup({ contentType:2, isReloadOnClose:false, width:500, height:224 });
	}
	mp_pop.setContent("title","????????????");
	mp_pop.setContent("contentHtml", "<div id=\"buyContent\">???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????<a href='"+url+"' target='_blank'>"+url+"<\/a>?????????????????????<\/div>");
	mp_pop.build();
	mp_pop.show();
}

//---------------------infoauto
var infoControllers = {
	idCounter: 1,
	all: {},
	addController : function( controller ) 
	{
		controller.__id = this.idCounter++;
		this.all[controller.__id] = controller;
	},
	removeController : function(controller)
	{
		delete this.all[controller.__id];
	},
	_unfold : function( cId )
	{
		var _controller = this.all[cId];
		if( _controller ){
			_controller.unfold();
		}
	},
	_fold : function( cId )
	{
		var _controller = this.all[cId];
		if( _controller ){
			_controller.fold();
		}
	}
}


var _p = null;

function InfoAuto(){}
_p = InfoAuto.prototype;

_p.__id = 0;
_p.target = null;
_p.fulltext = null;
_p.sumtext = null;
_p.summaryLen = 500;

_p.foldLink = null;

_p.toplantext = function( src )
{
	src = "" + src;
	var output = src.replace(/&nbsp;/g," ");
	return output;
}

_p.init = function( _targetId, _foldLinkId, _summarylen )
{
	this.summaryLen = _summarylen;
	
	if( typeof( _targetId ) == "string" ){
		this.target = document.getElementById( _targetId ) || document.all[_targetId];
	}
	else{
		this.target = _targetId;
	}
	if( !this.target ){
		throw new Error("??????????????????????????????");
		return;
	}
	
	if( typeof( _foldLinkId ) == "string" ){
		this.foldLink = document.getElementById( _foldLinkId ) || document.all[_foldLinkId];
	}
	else{
		this.foldLink = _foldLinkId;
	}
	if( this.foldLink ){
		this.foldLink.className = "ydiaounfolded";
		this.foldLink.style.display = "none";
	}
	
	infoControllers.addController( this );
	
	this.fulltext = this.toplantext( this.target.innerHTML );
	//alert( this.fulltext );
	
	if( this.fulltext.length > this.summaryLen ){
		this.sumtext = this.fulltext.substr(0,this.summaryLen);
		this.fold();
		
		if( this.foldLink ){
			this.foldLink.innerHTML = "??????";
			this.foldLink.href = "javascript:infoControllers._fold(" + this.__id + ");";
		}
	}
}

_p.geneUnfoldlink = function()
{
	return "<a class=\"ydiaofolded\" href=\"javascript:infoControllers._unfold(" + this.__id + ");\">????????????</a>";
}

_p.geneFoldlink = function()
{
	return "<a class=\"ydiaounfolded\" href=\"javascript:infoControllers._fold(" + this.__id + ");\">??????</a>";
}

_p.unfold = function()
{
	//alert( this.__id );
	this.target.innerHTML = this.fulltext + "(" + this.geneFoldlink() + ")";
	if( this.foldLink ){
		this.foldLink.style.display = "inline";
	}
}

_p.fold = function()
{
	this.target.innerHTML = this.sumtext + "??????(" + this.geneUnfoldlink() + ")";
	if( this.foldLink ){
		this.foldLink.style.display = "none";
	}
}

//----------------------------------------replace author link
function repAutlink( _linkId, _author )
{
	var theLink = null;
	if( typeof( _linkId ) == "string" ){
		theLink = document.getElementById( _linkId ) || document.all[_linkId];
	}
	else{
		theLink = _linkId;
	}
	if( !theLink ){
		alert("????????????????????????????????????");
		return;
	}

	var i_len = _author.length;
	if( i_len>=3 ){
		var pos = -1;
		pos = _author.indexOf("??????");
		if( pos!=-1 ) _author = _author.substring(0,pos);
		pos = _author.indexOf("??????");
		if( pos!=-1 ) _author = _author.substring(0,pos);
		pos = _author.indexOf("??????");
		if( pos!=-1 ) _author = _author.substring(0,pos);
		pos = _author.indexOf("???");
		if( pos!=-1 ) _author = _author.substring(0,pos);
		pos = _author.indexOf("???");
		if( pos!=-1 ) _author = _author.substring(0,pos);
		pos = _author.indexOf("???");
		if( pos!=-1 ) _author = _author.substring(0,pos);
	}
	
	//??????.
	try {
		var encAuthor = encodeURIComponent(_author);
		theLink.href = theLink.href.replace( /\$\(author\)/gi, encAuthor );
	} catch (e) {
		theLink.href = theLink.href.replace( /\$\(author\)/gi, _author );
	}
	
	return;
}

//----------------------------------????????????????????????
function loadBooktezt( bid, callback )
{
	ajaxpool.sendReq( "bookDetail?_method=tezt&b="+bid, loadBookteztResp, callback, "xml" );
}
function loadBookteztResp( doc, callback )
{
	var _teztlist = new Array();
	var root = doc.documentElement;
	if( root.childNodes.length > 0 ){
		for( var i=0;i<root.childNodes.length;i++ ){
			var _node = root.childNodes[i];
			var _sort = _node.childNodes[0].childNodes.length ?  _node.childNodes[0].childNodes[0].nodeValue : "??????";
			var _kemu = _node.childNodes[1].childNodes.length ? _node.childNodes[1].childNodes[0].nodeValue : "??????";
			var _zujuanM = _node.childNodes[2].childNodes.length ? parseInt(_node.childNodes[2].childNodes[0].nodeValue,10) : 0;
			var _ceshiM = _node.childNodes[3].childNodes.length ? parseInt(_node.childNodes[3].childNodes[0].nodeValue,10) : 0;
			
			var _o = {"sort":_sort, "kemu":_kemu, "zujuanM":_zujuanM, "ceshiM":_ceshiM};
			_teztlist.push( _o );
		}
	}
	
	if( callback )
		callback( _teztlist );
}

//---------------------------------??????/??????/?????????
var lastId = -1;
function showext( extId, bookcode )
{
	var theFrame = document.getElementById('bi43_2_frm');
	var theDiv = document.getElementById('bi43_3');
	if( lastId == extId ){
		extId = 0;
		lastId = -1;
	}
	
	if( extId == 0 ){
		//theFrame.src = "about:blank";
		theDiv.innerHTML = "";
		setExtheight( 0 );
		lastId = -1;
	}
	else if( extId == 1 )
	{
		if( checkSample( theFrame, theDiv ) ){
			theFrame.src = "bookDetail?_method=apply&b="+bookcode;
			theDiv.innerHTML = "";
			monitFrame();
		}
	}
	else if( extId == 2 ){
		if( checkSample( theFrame, theDiv ) ){
			theFrame.src = "bookDetail?_method=reback&b="+bookcode;
			theDiv.innerHTML = "";
			monitFrame();
		}
	}
	else if( extId == 3 ){
		theFrame.style.height = "0px";
		theDiv.innerHTML = geneBooktezt();
		setExtheight( theDiv.offsetHeight+40 );
	}
	else if( extId == 100 )
	{
		theFrame.style.height = "0px";
		theDiv.innerHTML = geneFrameerror();
		setExtheight( theDiv.offsetHeight+40 );
	}
	
	if( extId > 0 )
		lastId = extId;
}

var extIntervalId = -1;
var extheight = 0;
var curheight = 0;
function setExtheight( _theHeight )
{
	extheight = _theHeight;
	if( extIntervalId>0 )
		clearInterval( extIntervalId );
	extIntervalId = setInterval( __changeHeight, 60 );
}

function setFrameHeight( _theHeight )
{
	var theFrame = document.getElementById('bi43_2_frm');
	theFrame.style.height = _theHeight + "px";
	setExtheight( _theHeight + 40 );
}

function __changeHeight()
{
	var bi_4_3 = document.getElementById('bi_4_3');
	if( !bi_4_3 ) return;
	
	curheight = bi_4_3.offsetHeight;
	if( curheight > extheight ){
		curheight -= (curheight - extheight)*0.4;
	}
	else if( curheight < extheight ){
		curheight += (extheight - curheight)*0.4;
	}
	
	if( Math.abs( curheight - extheight ) < 2 ){
		curheight = extheight;
		clearInterval( extIntervalId );
		extIntervalId = -1;
	}
	
	bi_4_3.style.height = curheight + "px";
}

function checkSample( theFrame, theDiv )
{
	if( auth == 0 ){
		theFrame.style.height = "0px";
		theDiv.innerHTML = geneNoauth();
		setExtheight( theDiv.offsetHeight+40 );
		return false;
	}
	
	if( sampleOpen == 0 ){
		theFrame.style.height = "0px";
		theDiv.innerHTML = geneNosample();
		setExtheight( theDiv.offsetHeight+40 );
		return false;
	}
	
	return true;
}

function geneNoauth()
{
	var __ct = "<div id='bi43_3_msg'>????????????????????????????????????????????????????????????????????????</div>";
	return __ct;
}

function geneNosample()
{
	var __ct = "<div id='bi43_3_msg'>????????????????????????????????????????????????????????????????????????<br />??????:010-88254491 ??????:edu@phei.com.cn</div>";
	return __ct;
}

function geneFrameerror()
{
	var __ct = "<div id='bi43_3_msg'>?????????????????????????????????</div>";
	return __ct;
}

function geneBooktezt()
{
	if( testList == null ) return;
	
	var template = document.getElementById("bi43_3_tplt").value;
	var __ct = "<table>";
	for( var i=0;i<testList.length;i++ ){
		var _o = testList[i];
		
		__ct += template.replace( /\$\(sort\)/g, _o.sort ).replace( /\$\(kemu\)/g, _o.kemu )
			.replace( /\$\(zujuanM\)/g, _o.zujuanM ).replace( /\$\(ceshiM\)/g, _o.ceshiM );
	}
	__ct += "</table>";
	
	return __ct;	
}

function monitFrame()
{
	if (window.frames["bi43_2_frm"].document == null){
		showext(100);
	}
	else if (window.frames["bi43_2_frm"].document.title ){//&& window.frames["bi43_2_frm"].document.title.indexOf("error")!=-1) {
		if( /error/ig.test( window.frames["bi43_2_frm"].document.title ) );
			showext(100);
	} else
		setTimeout("monitFrame()", 200);
}

/**-----------booksearch-----------**/
function buildsel( sel_cate, cates, param )
{
	var __ct = "";
	if( sel_cate == "" || notIN( sel_cate, cates ) ){
		var template = document.getElementById("bssel_none_tplt").value;
		for( var i=0;i<cates.length;i++ ){
			var _o = cates[i];
			__ct += template.replace( /\$\(seltext\)/g, _o.nm ).replace( /\$\(selid\)/g, _o.id )
				.replace( /\$\(selact\)/g, param );
		}
	}
	else{
		var template = document.getElementById("bssel_tplt").value;
		for( var i=0;i<cates.length;i++ ){
			var _o = cates[i];
			if( _o.id == sel_cate ){
				__ct = template.replace( /\$\(seltext\)/g, _o.nm ).replace( /\$\(selid\)/g, _o.id )
					.replace( /\$\(selact\)/g, param );
				break;
			}
		}
	}
	document.getElementById("sel_"+param).innerHTML = __ct;
}
function notIN( sel_cate, cates )
{
	for( var i=0;i<cates.length;i++ ){
		var _o = cates[i];
		if( _o.id == sel_cate ){ return false }
	}
	return true;
}

function setcate( theform, cate )
{
	document.comboSearchForm.cate.value = cate;
	document.comboSearchForm.submit();	
}

function setpub( theform, pub )
{
	document.comboSearchForm.pubId.value = pub;
	document.comboSearchForm.submit();	
}

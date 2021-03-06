if(typeof Effect=="undefined"){throw ("controls.js requires including script.aculo.us' effects.js library")
}var Autocompleter={};
Autocompleter.Base=Class.create({baseInitialize:function(B,C,A){B=$(B);
this.element=B;
this.update=$(C);
this.hasFocus=false;
this.changed=false;
this.active=false;
this.index=0;
this.entryCount=0;
this.oldElementValue=this.element.value;
if(this.setOptions){this.setOptions(A)
}else{this.options=A||{}
}this.options.paramName=this.options.paramName||this.element.name;
this.options.tokens=this.options.tokens||[];
this.options.frequency=this.options.frequency||0.4;
this.options.minChars=this.options.minChars||1;
this.options.onShow=this.options.onShow||function(D,E){if(!E.style.position||E.style.position=="absolute"){E.style.position="absolute";
Position.clone(D,E,{setHeight:false,offsetTop:D.offsetHeight})
}Effect.Appear(E,{duration:0.15})
};
this.options.onHide=this.options.onHide||function(D,E){new Effect.Fade(E,{duration:0.15})
};
if(typeof (this.options.tokens)=="string"){this.options.tokens=new Array(this.options.tokens)
}if(!this.options.tokens.include("\n")){this.options.tokens.push("\n")
}this.observer=null;
this.element.setAttribute("autocomplete","off");
Element.hide(this.update);
Event.observe(this.element,"blur",this.onBlur.bindAsEventListener(this));
Event.observe(this.element,"keydown",this.onKeyPress.bindAsEventListener(this))
},show:function(){if(Element.getStyle(this.update,"display")=="none"){this.options.onShow(this.element,this.update)
}if(!this.iefix&&(Prototype.Browser.IE)&&(Element.getStyle(this.update,"position")=="absolute")){new Insertion.After(this.update,'<iframe id="'+this.update.id+'_iefix" style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
this.iefix=$(this.update.id+"_iefix")
}if(this.iefix){setTimeout(this.fixIEOverlapping.bind(this),50)
}},fixIEOverlapping:function(){Position.clone(this.update,this.iefix,{setTop:(!this.update.style.height)});
this.iefix.style.zIndex=1;
this.update.style.zIndex=2;
Element.show(this.iefix)
},hide:function(){this.stopIndicator();
if(Element.getStyle(this.update,"display")!="none"){this.options.onHide(this.element,this.update)
}if(this.iefix){Element.hide(this.iefix)
}},startIndicator:function(){if(this.options.indicator){Element.show(this.options.indicator)
}},stopIndicator:function(){if(this.options.indicator){Element.hide(this.options.indicator)
}},onKeyPress:function(A){if(this.active){switch(A.keyCode){case Event.KEY_TAB:case Event.KEY_RETURN:this.selectEntry();
Event.stop(A);
case Event.KEY_ESC:this.hide();
this.active=false;
Event.stop(A);
return ;
case Event.KEY_LEFT:case Event.KEY_RIGHT:return ;
case Event.KEY_UP:this.markPrevious();
this.render();
Event.stop(A);
return ;
case Event.KEY_DOWN:this.markNext();
this.render();
Event.stop(A);
return 
}}else{if(A.keyCode==Event.KEY_TAB||A.keyCode==Event.KEY_RETURN||(Prototype.Browser.WebKit>0&&A.keyCode==0)){return 
}}this.changed=true;
this.hasFocus=true;
if(this.observer){clearTimeout(this.observer)
}this.observer=setTimeout(this.onObserverEvent.bind(this),this.options.frequency*1000)
},activate:function(){this.changed=false;
this.hasFocus=true;
this.getUpdatedChoices()
},onHover:function(B){var A=Event.findElement(B,"LI");
if(this.index!=A.autocompleteIndex){this.index=A.autocompleteIndex;
this.render()
}Event.stop(B)
},onClick:function(B){var A=Event.findElement(B,"LI");
this.index=A.autocompleteIndex;
this.selectEntry();
this.hide()
},onBlur:function(A){setTimeout(this.hide.bind(this),250);
this.hasFocus=false;
this.active=false
},render:function(){if(this.entryCount>0){for(var A=0;
A<this.entryCount;
A++){this.index==A?Element.addClassName(this.getEntry(A),"selected"):Element.removeClassName(this.getEntry(A),"selected")
}if(this.hasFocus){this.show();
this.active=true
}}else{this.active=false;
this.hide()
}},markPrevious:function(){if(this.index>0){this.index--
}else{this.index=this.entryCount-1
}this.getEntry(this.index).scrollIntoView(true)
},markNext:function(){if(this.index<this.entryCount-1){this.index++
}else{this.index=0
}this.getEntry(this.index).scrollIntoView(false)
},getEntry:function(A){return this.update.firstChild.childNodes[A]
},getCurrentEntry:function(){return this.getEntry(this.index)
},selectEntry:function(){this.active=false;
this.updateElement(this.getCurrentEntry())
},updateElement:function(F){if(this.options.updateElement){this.options.updateElement(F);
return 
}var D="";
if(this.options.select){var A=$(F).select("."+this.options.select)||[];
if(A.length>0){D=Element.collectTextNodes(A[0],this.options.select)
}}else{D=Element.collectTextNodesIgnoreClass(F,"informal")
}var C=this.getTokenBounds();
if(C[0]!=-1){var E=this.element.value.substr(0,C[0]);
var B=this.element.value.substr(C[0]).match(/^\s+/);
if(B){E+=B[0]
}this.element.value=E+D+this.element.value.substr(C[1])
}else{this.element.value=D
}this.oldElementValue=this.element.value;
this.element.focus();
if(this.options.afterUpdateElement){this.options.afterUpdateElement(this.element,F)
}},updateChoices:function(C){if(!this.changed&&this.hasFocus){this.update.innerHTML=C;
Element.cleanWhitespace(this.update);
Element.cleanWhitespace(this.update.down());
if(this.update.firstChild&&this.update.down().childNodes){this.entryCount=this.update.down().childNodes.length;
for(var A=0;
A<this.entryCount;
A++){var B=this.getEntry(A);
B.autocompleteIndex=A;
this.addObservers(B)
}}else{this.entryCount=0
}this.stopIndicator();
this.index=0;
if(this.entryCount==1&&this.options.autoSelect){this.selectEntry();
this.hide()
}else{this.render()
}}},addObservers:function(A){Event.observe(A,"mouseover",this.onHover.bindAsEventListener(this));
Event.observe(A,"click",this.onClick.bindAsEventListener(this))
},onObserverEvent:function(){this.changed=false;
this.tokenBounds=null;
if(this.getToken().length>=this.options.minChars){this.getUpdatedChoices()
}else{this.active=false;
this.hide()
}this.oldElementValue=this.element.value
},getToken:function(){var A=this.getTokenBounds();
return this.element.value.substring(A[0],A[1]).strip()
},getTokenBounds:function(){if(null!=this.tokenBounds){return this.tokenBounds
}var E=this.element.value;
if(E.strip().empty()){return[-1,0]
}var F=arguments.callee.getFirstDifferencePos(E,this.oldElementValue);
var H=(F==this.oldElementValue.length?1:0);
var D=-1,C=E.length;
var G;
for(var B=0,A=this.options.tokens.length;
B<A;
++B){G=E.lastIndexOf(this.options.tokens[B],F+H-1);
if(G>D){D=G
}G=E.indexOf(this.options.tokens[B],F+H);
if(-1!=G&&G<C){C=G
}}return(this.tokenBounds=[D+1,C])
}});
Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos=function(C,A){var D=Math.min(C.length,A.length);
for(var B=0;
B<D;
++B){if(C[B]!=A[B]){return B
}}return D
};
Ajax.Autocompleter=Class.create(Autocompleter.Base,{initialize:function(C,D,B,A){this.baseInitialize(C,D,A);
this.options.asynchronous=true;
this.options.onComplete=this.onComplete.bind(this);
this.options.defaultParams=this.options.parameters||null;
this.url=B
},getUpdatedChoices:function(){this.startIndicator();
var A=encodeURIComponent(this.options.paramName)+"="+encodeURIComponent(this.getToken());
this.options.parameters=this.options.callback?this.options.callback(this.element,A):A;
if(this.options.defaultParams){this.options.parameters+="&"+this.options.defaultParams
}new Ajax.Request(this.url,this.options)
},onComplete:function(A){this.updateChoices(A.responseText)
}});
Autocompleter.Local=Class.create(Autocompleter.Base,{initialize:function(B,D,C,A){this.baseInitialize(B,D,A);
this.options.array=C
},getUpdatedChoices:function(){this.updateChoices(this.options.selector(this))
},setOptions:function(A){this.options=Object.extend({choices:10,partialSearch:true,partialChars:2,ignoreCase:true,fullSearch:false,selector:function(B){var D=[];
var C=[];
var H=B.getToken();
var G=0;
for(var E=0;
E<B.options.array.length&&D.length<B.options.choices;
E++){var F=B.options.array[E];
var I=B.options.ignoreCase?F.toLowerCase().indexOf(H.toLowerCase()):F.indexOf(H);
while(I!=-1){if(I==0&&F.length!=H.length){D.push("<li><strong>"+F.substr(0,H.length)+"</strong>"+F.substr(H.length)+"</li>");
break
}else{if(H.length>=B.options.partialChars&&B.options.partialSearch&&I!=-1){if(B.options.fullSearch||/\s/.test(F.substr(I-1,1))){C.push("<li>"+F.substr(0,I)+"<strong>"+F.substr(I,H.length)+"</strong>"+F.substr(I+H.length)+"</li>");
break
}}}I=B.options.ignoreCase?F.toLowerCase().indexOf(H.toLowerCase(),I+1):F.indexOf(H,I+1)
}}if(C.length){D=D.concat(C.slice(0,B.options.choices-D.length))
}return"<ul>"+D.join("")+"</ul>"
}},A||{})
}});
Field.scrollFreeActivate=function(A){setTimeout(function(){Field.activate(A)
},1)
};
Ajax.InPlaceEditor=Class.create({initialize:function(C,B,A){this.url=B;
this.element=C=$(C);
this.prepareOptions();
this._controls={};
arguments.callee.dealWithDeprecatedOptions(A);
Object.extend(this.options,A||{});
if(!this.options.formId&&this.element.id){this.options.formId=this.element.id+"-inplaceeditor";
if($(this.options.formId)){this.options.formId=""
}}if(this.options.externalControl){this.options.externalControl=$(this.options.externalControl)
}if(!this.options.externalControl){this.options.externalControlOnly=false
}this._originalBackground=this.element.getStyle("background-color")||"transparent";
this.element.title=this.options.clickToEditText;
this._boundCancelHandler=this.handleFormCancellation.bind(this);
this._boundComplete=(this.options.onComplete||Prototype.emptyFunction).bind(this);
this._boundFailureHandler=this.handleAJAXFailure.bind(this);
this._boundSubmitHandler=this.handleFormSubmission.bind(this);
this._boundWrapperHandler=this.wrapUp.bind(this);
this.registerListeners()
},checkForEscapeOrReturn:function(A){if(!this._editing||A.ctrlKey||A.altKey||A.shiftKey){return 
}if(Event.KEY_ESC==A.keyCode){this.handleFormCancellation(A)
}else{if(Event.KEY_RETURN==A.keyCode){this.handleFormSubmission(A)
}}},createControl:function(G,C,B){var E=this.options[G+"Control"];
var F=this.options[G+"Text"];
if("button"==E){var A=document.createElement("input");
A.type="submit";
A.value=F;
A.className="editor_"+G+"_button";
if("cancel"==G){A.onclick=this._boundCancelHandler
}this._form.appendChild(A);
this._controls[G]=A
}else{if("link"==E){var D=document.createElement("a");
D.href="#";
D.appendChild(document.createTextNode(F));
D.onclick="cancel"==G?this._boundCancelHandler:this._boundSubmitHandler;
D.className="editor_"+G+"_link";
if(B){D.className+=" "+B
}this._form.appendChild(D);
this._controls[G]=D
}}},createEditField:function(){var C=(this.options.loadTextURL?this.options.loadingText:this.getText());
var B;
if(1>=this.options.rows&&!/\r|\n/.test(this.getText())){B=document.createElement("input");
B.type="text";
var A=this.options.size||this.options.cols||0;
if(0<A){B.size=A
}}else{B=document.createElement("textarea");
B.rows=(1>=this.options.rows?this.options.autoRows:this.options.rows);
B.cols=this.options.cols||40
}B.name=this.options.paramName;
B.value=C;
B.className="editor_field";
if(this.options.submitOnBlur){B.onblur=this._boundSubmitHandler
}this._controls.editor=B;
if(this.options.loadTextURL){this.loadExternalText()
}this._form.appendChild(this._controls.editor)
},createForm:function(){var B=this;
function A(D,E){var C=B.options["text"+D+"Controls"];
if(!C||E===false){return 
}B._form.appendChild(document.createTextNode(C))
}this._form=$(document.createElement("form"));
this._form.id=this.options.formId;
this._form.addClassName(this.options.formClassName);
this._form.onsubmit=this._boundSubmitHandler;
this.createEditField();
if("textarea"==this._controls.editor.tagName.toLowerCase()){this._form.appendChild(document.createElement("br"))
}if(this.options.onFormCustomization){this.options.onFormCustomization(this,this._form)
}A("Before",this.options.okControl||this.options.cancelControl);
this.createControl("ok",this._boundSubmitHandler);
A("Between",this.options.okControl&&this.options.cancelControl);
this.createControl("cancel",this._boundCancelHandler,"editor_cancel");
A("After",this.options.okControl||this.options.cancelControl)
},destroy:function(){if(this._oldInnerHTML){this.element.innerHTML=this._oldInnerHTML
}this.leaveEditMode();
this.unregisterListeners()
},enterEditMode:function(A){if(this._saving||this._editing){return 
}this._editing=true;
this.triggerCallback("onEnterEditMode");
if(this.options.externalControl){this.options.externalControl.hide()
}this.element.hide();
this.createForm();
this.element.parentNode.insertBefore(this._form,this.element);
if(!this.options.loadTextURL){this.postProcessEditField()
}if(A){Event.stop(A)
}},enterHover:function(A){if(this.options.hoverClassName){this.element.addClassName(this.options.hoverClassName)
}if(this._saving){return 
}this.triggerCallback("onEnterHover")
},getText:function(){return this.element.innerHTML.unescapeHTML()
},handleAJAXFailure:function(A){this.triggerCallback("onFailure",A);
if(this._oldInnerHTML){this.element.innerHTML=this._oldInnerHTML;
this._oldInnerHTML=null
}},handleFormCancellation:function(A){this.wrapUp();
if(A){Event.stop(A)
}},handleFormSubmission:function(D){var B=this._form;
var C=$F(this._controls.editor);
this.prepareSubmission();
var E=this.options.callback(B,C)||"";
if(Object.isString(E)){E=E.toQueryParams()
}E.editorId=this.element.id;
if(this.options.htmlResponse){var A=Object.extend({evalScripts:true},this.options.ajaxOptions);
Object.extend(A,{parameters:E,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler});
new Ajax.Updater({success:this.element},this.url,A)
}else{var A=Object.extend({method:"get"},this.options.ajaxOptions);
Object.extend(A,{parameters:E,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler});
new Ajax.Request(this.url,A)
}if(D){Event.stop(D)
}},leaveEditMode:function(){this.element.removeClassName(this.options.savingClassName);
this.removeForm();
this.leaveHover();
this.element.style.backgroundColor=this._originalBackground;
this.element.show();
if(this.options.externalControl){this.options.externalControl.show()
}this._saving=false;
this._editing=false;
this._oldInnerHTML=null;
this.triggerCallback("onLeaveEditMode")
},leaveHover:function(A){if(this.options.hoverClassName){this.element.removeClassName(this.options.hoverClassName)
}if(this._saving){return 
}this.triggerCallback("onLeaveHover")
},loadExternalText:function(){this._form.addClassName(this.options.loadingClassName);
this._controls.editor.disabled=true;
var A=Object.extend({method:"get"},this.options.ajaxOptions);
Object.extend(A,{parameters:"editorId="+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(C){this._form.removeClassName(this.options.loadingClassName);
var B=C.responseText;
if(this.options.stripLoadedTextTags){B=B.stripTags()
}this._controls.editor.value=B;
this._controls.editor.disabled=false;
this.postProcessEditField()
}.bind(this),onFailure:this._boundFailureHandler});
new Ajax.Request(this.options.loadTextURL,A)
},postProcessEditField:function(){var A=this.options.fieldPostCreation;
if(A){$(this._controls.editor)["focus"==A?"focus":"activate"]()
}},prepareOptions:function(){this.options=Object.clone(Ajax.InPlaceEditor.DefaultOptions);
Object.extend(this.options,Ajax.InPlaceEditor.DefaultCallbacks);
[this._extraDefaultOptions].flatten().compact().each(function(A){Object.extend(this.options,A)
}.bind(this))
},prepareSubmission:function(){this._saving=true;
this.removeForm();
this.leaveHover();
this.showSaving()
},registerListeners:function(){this._listeners={};
var A;
$H(Ajax.InPlaceEditor.Listeners).each(function(B){A=this[B.value].bind(this);
this._listeners[B.key]=A;
if(!this.options.externalControlOnly){this.element.observe(B.key,A)
}if(this.options.externalControl){this.options.externalControl.observe(B.key,A)
}}.bind(this))
},removeForm:function(){if(!this._form){return 
}this._form.remove();
this._form=null;
this._controls={}
},showSaving:function(){this._oldInnerHTML=this.element.innerHTML;
this.element.innerHTML=this.options.savingText;
this.element.addClassName(this.options.savingClassName);
this.element.style.backgroundColor=this._originalBackground;
this.element.show()
},triggerCallback:function(B,A){if("function"==typeof this.options[B]){this.options[B](this,A)
}},unregisterListeners:function(){$H(this._listeners).each(function(A){if(!this.options.externalControlOnly){this.element.stopObserving(A.key,A.value)
}if(this.options.externalControl){this.options.externalControl.stopObserving(A.key,A.value)
}}.bind(this))
},wrapUp:function(A){this.leaveEditMode();
this._boundComplete(A,this.element)
}});
Object.extend(Ajax.InPlaceEditor.prototype,{dispose:Ajax.InPlaceEditor.prototype.destroy});
Ajax.InPlaceCollectionEditor=Class.create(Ajax.InPlaceEditor,{initialize:function($super,C,B,A){this._extraDefaultOptions=Ajax.InPlaceCollectionEditor.DefaultOptions;
$super(C,B,A)
},createEditField:function(){var A=document.createElement("select");
A.name=this.options.paramName;
A.size=1;
this._controls.editor=A;
this._collection=this.options.collection||[];
if(this.options.loadCollectionURL){this.loadCollection()
}else{this.checkForExternalText()
}this._form.appendChild(this._controls.editor)
},loadCollection:function(){this._form.addClassName(this.options.loadingClassName);
this.showLoadingText(this.options.loadingCollectionText);
var options=Object.extend({method:"get"},this.options.ajaxOptions);
Object.extend(options,{parameters:"editorId="+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){var js=transport.responseText.strip();
if(!/^\[.*\]$/.test(js)){throw ("Server returned an invalid collection representation.")
}this._collection=eval(js);
this.checkForExternalText()
}.bind(this),onFailure:this.onFailure});
new Ajax.Request(this.options.loadCollectionURL,options)
},showLoadingText:function(B){this._controls.editor.disabled=true;
var A=this._controls.editor.firstChild;
if(!A){A=document.createElement("option");
A.value="";
this._controls.editor.appendChild(A);
A.selected=true
}A.update((B||"").stripScripts().stripTags())
},checkForExternalText:function(){this._text=this.getText();
if(this.options.loadTextURL){this.loadExternalText()
}else{this.buildOptionList()
}},loadExternalText:function(){this.showLoadingText(this.options.loadingText);
var A=Object.extend({method:"get"},this.options.ajaxOptions);
Object.extend(A,{parameters:"editorId="+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(B){this._text=B.responseText.strip();
this.buildOptionList()
}.bind(this),onFailure:this.onFailure});
new Ajax.Request(this.options.loadTextURL,A)
},buildOptionList:function(){this._form.removeClassName(this.options.loadingClassName);
this._collection=this._collection.map(function(D){return 2===D.length?D:[D,D].flatten()
});
var B=("value" in this.options)?this.options.value:this._text;
var A=this._collection.any(function(D){return D[0]==B
}.bind(this));
this._controls.editor.update("");
var C;
this._collection.each(function(E,D){C=document.createElement("option");
C.value=E[0];
C.selected=A?E[0]==B:0==D;
C.appendChild(document.createTextNode(E[1]));
this._controls.editor.appendChild(C)
}.bind(this));
this._controls.editor.disabled=false;
Field.scrollFreeActivate(this._controls.editor)
}});
Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions=function(A){if(!A){return 
}function B(C,D){if(C in A||D===undefined){return 
}A[C]=D
}B("cancelControl",(A.cancelLink?"link":(A.cancelButton?"button":A.cancelLink==A.cancelButton==false?false:undefined)));
B("okControl",(A.okLink?"link":(A.okButton?"button":A.okLink==A.okButton==false?false:undefined)));
B("highlightColor",A.highlightcolor);
B("highlightEndColor",A.highlightendcolor)
};
Object.extend(Ajax.InPlaceEditor,{DefaultOptions:{ajaxOptions:{},autoRows:3,cancelControl:"link",cancelText:"cancel",clickToEditText:"Click to edit",externalControl:null,externalControlOnly:false,fieldPostCreation:"activate",formClassName:"inplaceeditor-form",formId:null,highlightColor:"#ffff99",highlightEndColor:"#ffffff",hoverClassName:"",htmlResponse:true,loadingClassName:"inplaceeditor-loading",loadingText:"Loading...",okControl:"button",okText:"ok",paramName:"value",rows:1,savingClassName:"inplaceeditor-saving",savingText:"Saving...",size:0,stripLoadedTextTags:false,submitOnBlur:false,textAfterControls:"",textBeforeControls:"",textBetweenControls:""},DefaultCallbacks:{callback:function(A){return Form.serialize(A)
},onComplete:function(B,A){new Effect.Highlight(A,{startcolor:this.options.highlightColor,keepBackgroundImage:true})
},onEnterEditMode:null,onEnterHover:function(A){A.element.style.backgroundColor=A.options.highlightColor;
if(A._effect){A._effect.cancel()
}},onFailure:function(B,A){alert("Error communication with the server: "+B.responseText.stripTags())
},onFormCustomization:null,onLeaveEditMode:null,onLeaveHover:function(A){A._effect=new Effect.Highlight(A.element,{startcolor:A.options.highlightColor,endcolor:A.options.highlightEndColor,restorecolor:A._originalBackground,keepBackgroundImage:true})
}},Listeners:{click:"enterEditMode",keydown:"checkForEscapeOrReturn",mouseover:"enterHover",mouseout:"leaveHover"}});
Ajax.InPlaceCollectionEditor.DefaultOptions={loadingCollectionText:"Loading options..."};
Form.Element.DelayedObserver=Class.create({initialize:function(B,A,C){this.delay=A||0.5;
this.element=$(B);
this.callback=C;
this.timer=null;
this.lastValue=$F(this.element);
Event.observe(this.element,"keyup",this.delayedListener.bindAsEventListener(this))
},delayedListener:function(A){if(this.lastValue==$F(this.element)){return 
}if(this.timer){clearTimeout(this.timer)
}this.timer=setTimeout(this.onTimerEvent.bind(this),this.delay*1000);
this.lastValue=$F(this.element)
},onTimerEvent:function(){this.timer=null;
this.callback(this.element,$F(this.element))
}});
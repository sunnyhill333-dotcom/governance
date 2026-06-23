WRMCB=function(e){var c=console;if(c&&c.log&&c.error){c.log('Error running batched script.');c.error(e);}}
;
try {
/* module-key = 'com.atlassian.confluence.plugins.confluence-frontend:attachments', location = '/includes/soy/attachments.soy' */
// This file was automatically generated from attachments.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Confluence.Templates.Attachments.
 */

if (typeof Confluence == 'undefined') { var Confluence = {}; }
if (typeof Confluence.Templates == 'undefined') { Confluence.Templates = {}; }
if (typeof Confluence.Templates.Attachments == 'undefined') { Confluence.Templates.Attachments = {}; }


Confluence.Templates.Attachments.removalConfirmationTitle = function(opt_data, opt_ignored) {
  return '' + soy.$$escapeHtml('\ucca8\ubd80 \ud30c\uc77c \uc0ad\uc81c \ud655\uc778');
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.removalConfirmationTitle.soyTemplateName = 'Confluence.Templates.Attachments.removalConfirmationTitle';
}


Confluence.Templates.Attachments.removalConfirmationTitleV2 = function(opt_data, opt_ignored) {
  return '' + soy.$$escapeHtml('\ucca8\ubd80 \ud30c\uc77c \uc0ad\uc81c');
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.removalConfirmationTitleV2.soyTemplateName = 'Confluence.Templates.Attachments.removalConfirmationTitleV2';
}


Confluence.Templates.Attachments.removalSelectedConfirmationTitle = function(opt_data, opt_ignored) {
  return '' + soy.$$escapeHtml(AJS.format('{0}\uac1c\uc758 {0,choice,0#\ucca8\ubd80 \ud30c\uc77c|1#\ucca8\ubd80 \ud30c\uc77c|1\x3c\ucca8\ubd80 \ud30c\uc77c} \uc0ad\uc81c',opt_data.fileCount));
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.removalSelectedConfirmationTitle.soyTemplateName = 'Confluence.Templates.Attachments.removalSelectedConfirmationTitle';
}


Confluence.Templates.Attachments.removalAllConfirmationTitle = function(opt_data, opt_ignored) {
  return '' + soy.$$escapeHtml('\ubaa8\ub4e0 \ucca8\ubd80 \ud30c\uc77c \uc0ad\uc81c \ud655\uc778');
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.removalAllConfirmationTitle.soyTemplateName = 'Confluence.Templates.Attachments.removalAllConfirmationTitle';
}


Confluence.Templates.Attachments.removalConfirmationBody = function(opt_data, opt_ignored) {
  return '<div>' + soy.$$escapeHtml(AJS.format('\ucca8\ubd80 \ud30c\uc77c \x22{0}\x22(\uc744)\ub97c \ud734\uc9c0\ud1b5\uc73c\ub85c \ubcf4\ub0b4\uc2dc\uaca0\uc2b5\ub2c8\uae4c? \uacf5\uac04 \uad00\ub9ac\uc790\ub9cc \uc774 \uc791\uc5c5\uc744 \ucde8\uc18c\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.',opt_data.filename)) + '</div>';
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.removalConfirmationBody.soyTemplateName = 'Confluence.Templates.Attachments.removalConfirmationBody';
}


Confluence.Templates.Attachments.removalConfirmationBodyV2 = function(opt_data, opt_ignored) {
  return '<div><p>' + soy.$$escapeHtml('\ud734\uc9c0\ud1b5\uc73c\ub85c \ubcf4\ub0b8 \ud56d\ubaa9\uc740 \uc2a4\ud398\uc774\uc2a4 \uad00\ub9ac\uc790\uac00 \ubcf5\uc6d0\ud558\uac70\ub098 \uc0ad\uc81c\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.') + '</p></div>';
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.removalConfirmationBodyV2.soyTemplateName = 'Confluence.Templates.Attachments.removalConfirmationBodyV2';
}


Confluence.Templates.Attachments.deleteSuccessFlagBody = function(opt_data, opt_ignored) {
  return '<div><p><button id="attachment-remove-success-notification-body-refresh-button" class="aui-button aui-button-link">' + soy.$$escapeHtml('\ud398\uc774\uc9c0 \uc0c8\ub85c \uace0\uce68') + '</button></p></div>';
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.deleteSuccessFlagBody.soyTemplateName = 'Confluence.Templates.Attachments.deleteSuccessFlagBody';
}


Confluence.Templates.Attachments.partialFailedFlagBody = function(opt_data, opt_ignored) {
  return '<div><p>' + soy.$$escapeHtml('\uc77c\ubd80 \ud30c\uc77c\uc744 \uc0ad\uc81c\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. \ub098\uc911\uc5d0 \ub2e4\uc2dc \uc2dc\ub3c4\ud558\uac70\ub098 \uc774 \uc624\ub958\uac00 \uacc4\uc18d \ubc1c\uc0dd\ud558\ub294 \uacbd\uc6b0 \uc9c0\uc6d0 \ud300\uc5d0 \ubb38\uc758\ud558\uc138\uc694.') + '</p><ul class="aui-nav-actions-list"><li><button id="attachment-remove-fail-notification-body-refresh-button" class="aui-button aui-button-link">' + soy.$$escapeHtml('\ud398\uc774\uc9c0 \uc0c8\ub85c \uace0\uce68') + '</button></li><li><a href=' + soy.$$escapeHtml("https:\/\/docs.atlassian.com\/confluence\/docs-92\/Manage+Files") + '><button id="attachment-remove-fail-notification-body-learn-more-button" class="aui-button aui-button-link">' + soy.$$escapeHtml('\uc790\uc138\ud788 \uc54c\uc544\ubcf4\uae30') + '</button></a></li></ul></div>';
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.partialFailedFlagBody.soyTemplateName = 'Confluence.Templates.Attachments.partialFailedFlagBody';
}


Confluence.Templates.Attachments.versionRemovalConfirmationTitle = function(opt_data, opt_ignored) {
  return '' + soy.$$escapeHtml('\ucca8\ubd80\ud30c\uc77c \ubc84\uc804 \uc0ad\uc81c \ud655\uc778');
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.versionRemovalConfirmationTitle.soyTemplateName = 'Confluence.Templates.Attachments.versionRemovalConfirmationTitle';
}


Confluence.Templates.Attachments.versionRemovalConfirmationBody = function(opt_data, opt_ignored) {
  return '<div>' + soy.$$escapeHtml(AJS.format('{1} \ucca8\ubd80\ud30c\uc77c\uc758 \ubc84\uc804 {0}\uc744 \uc0ad\uc81c\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?',opt_data.version,opt_data.filename)) + '</div>';
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.versionRemovalConfirmationBody.soyTemplateName = 'Confluence.Templates.Attachments.versionRemovalConfirmationBody';
}


Confluence.Templates.Attachments.selectedAttachmentsRemovalConfirmationBody = function(opt_data, opt_ignored) {
  var output = '<div><p>' + soy.$$escapeHtml('\ud734\uc9c0\ud1b5\uc73c\ub85c \ubcf4\ub0b8 \ud56d\ubaa9\uc740 \uc2a4\ud398\uc774\uc2a4 \uad00\ub9ac\uc790\uac00 \ubcf5\uc6d0\ud558\uac70\ub098 \uc0ad\uc81c\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.') + '</p>';
  if (opt_data.undeletable.length > 0) {
    output += '<div class="aui-message aui-message-warning"><p class="title"><strong>' + soy.$$escapeHtml('\uc77c\ubd80 \ud30c\uc77c\uc740 \uc0ad\uc81c\ub418\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4') + '</strong></p><p>' + soy.$$escapeHtml('\ub2e4\uc74c \ucca8\ubd80 \ud30c\uc77c\uc744 \uc0ad\uc81c\ud560 \uad8c\ud55c\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.') + '</p><ul>';
    var undeletableFilenameList49 = opt_data.undeletable;
    var undeletableFilenameListLen49 = undeletableFilenameList49.length;
    for (var undeletableFilenameIndex49 = 0; undeletableFilenameIndex49 < undeletableFilenameListLen49; undeletableFilenameIndex49++) {
      var undeletableFilenameData49 = undeletableFilenameList49[undeletableFilenameIndex49];
      output += '<li>' + soy.$$escapeHtml(undeletableFilenameData49) + '</li>';
    }
    output += '</ul></div>';
  }
  output += '</div>';
  return output;
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.selectedAttachmentsRemovalConfirmationBody.soyTemplateName = 'Confluence.Templates.Attachments.selectedAttachmentsRemovalConfirmationBody';
}


Confluence.Templates.Attachments.allAttachmentsRemovalConfirmationBody = function(opt_data, opt_ignored) {
  return '<div><p>' + soy.$$escapeHtml('\uc774 \ud398\uc774\uc9c0\uc758 \ubaa8\ub4e0 \ud30c\uc77c\uc744 \uc0ad\uc81c\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?') + '</p><p>' + soy.$$escapeHtml('\ud734\uc9c0\ud1b5\uc73c\ub85c \ubcf4\ub0b8 \ud56d\ubaa9\uc740 \uc2a4\ud398\uc774\uc2a4 \uad00\ub9ac\uc790\uac00 \ubcf5\uc6d0\ud558\uac70\ub098 \uc0ad\uc81c\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.') + '</p></div>';
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.allAttachmentsRemovalConfirmationBody.soyTemplateName = 'Confluence.Templates.Attachments.allAttachmentsRemovalConfirmationBody';
}


Confluence.Templates.Attachments.removalErrorTitle = function(opt_data, opt_ignored) {
  return '' + soy.$$escapeHtml('\ucca8\ubd80\ud30c\uc77c \uc0ad\uc81c \uc624\ub958');
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.removalErrorTitle.soyTemplateName = 'Confluence.Templates.Attachments.removalErrorTitle';
}


Confluence.Templates.Attachments.removalErrorBody = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  var output = '<div class="aui-message error">';
  if (! opt_data.messages) {
    output += soy.$$escapeHtml('\ucca8\ubd80\ud30c\uc77c\uc744 \uc0ad\uc81c\ud558\ub824\uace0 \ud560 \ub54c \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4. \ud604\uc7ac \uc0c1\ud0dc\ub97c \ud655\uc778\ud558\uc2ed\uc2dc\uc624. \ud30c\uc77c\uc774 \uc774\ubbf8 \uc0ad\uc81c \ub418\uc5c8\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.');
  } else {
    if (opt_data.messages.length == 1) {
      var messageList72 = opt_data.messages;
      var messageListLen72 = messageList72.length;
      for (var messageIndex72 = 0; messageIndex72 < messageListLen72; messageIndex72++) {
        var messageData72 = messageList72[messageIndex72];
        output += soy.$$escapeHtml(messageData72);
      }
    } else {
      output += '<ul>';
      var messageList77 = opt_data.messages;
      var messageListLen77 = messageList77.length;
      for (var messageIndex77 = 0; messageIndex77 < messageListLen77; messageIndex77++) {
        var messageData77 = messageList77[messageIndex77];
        output += '<li>' + soy.$$escapeHtml(messageData77) + '</li>';
      }
      output += '</ul>';
    }
  }
  output += '</div>';
  return output;
};
if (goog.DEBUG) {
  Confluence.Templates.Attachments.removalErrorBody.soyTemplateName = 'Confluence.Templates.Attachments.removalErrorBody';
}

}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.plugins.confluence-frontend:attachments', location = '/includes/js/attachments.js' */
define("confluence/attachments","ajs confluence/templates confluence/api/ajax confluence/api/constants confluence/api/event confluence/api/logger confluence/dark-features confluence/flag confluence/meta confluence/message-controller wrm/context-path".split(" "),function(g,p,N,v,w,O,m,x,G,P,H){function q(){window.location.reload(!0)}function I(b){clearTimeout(J);y&&(O.log("Preventing submit due to recent form submission."),b.preventDefault());y=!0;J=setTimeout(function(){y=!1},2E3)}var r={showOlderVersions:function(b){b(".attachment-history a").click(function(z){var n=
b(this).parents("table.attachments"),A=b(this).parents("tr:first")[0].id.replace("attachment-","");n=b(".history-"+A,n);b(this).toggleClass("aui-iconfont-chevron-down");b(this).toggleClass("aui-iconfont-chevron-right");n.toggleClass("hidden");b(this).attr("aria-expanded",b(this).hasClass("aui-iconfont-chevron-down"));z.stopPropagation();return!1})}},B={close:"manual",type:"success",stack:"attachments",fifo:!0},y=!1,J;return{component:r,initialiser:function(b){function z(a){var c=new x(b.extend({},
B,{title:g.format("{0,choice,0#\uac1c\uc758 \ucca8\ubd80 \ud30c\uc77c \uc0ad\uc81c\ub428|1#\uac1c\uc758 \ucca8\ubd80 \ud30c\uc77c \uc0ad\uc81c\ub428|1\u003c\uac1c\uc758 \ucca8\ubd80 \ud30c\uc77c \uc0ad\uc81c\ub428}",a),body:k.deleteSuccessFlagBody(),extraClasses:"attachment-deleted-success-flag"}));b("#attachment-remove-success-notification-body-refresh-button").click(function(){q()});setTimeout(function(){c.close()},8E3)}function n(a){var c=new x(b.extend({},B,{title:g.format("{0,choice,0#\ucca8\ubd80 \ud30c\uc77c|1#\ucca8\ubd80 \ud30c\uc77c|1\u003c\ucca8\ubd80 \ud30c\uc77c}\uc744 \uc0ad\uc81c\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4",a),body:"\uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4. \ub098\uc911\uc5d0 \ub2e4\uc2dc \uc2dc\ub3c4\ud558\uac70\ub098 \uc774 \uc624\ub958\uac00 \uacc4\uc18d \ubc1c\uc0dd\ud558\ub294 \uacbd\uc6b0 \uc9c0\uc6d0 \ud300\uc5d0 \ubb38\uc758\ud558\uc138\uc694.",type:"error",extraClasses:"attachment-deleted-error-flag"}));
setTimeout(function(){c.close()},8E3)}function A(a,c){var e=new x(b.extend({},B,{title:g.format("{1}\uac1c \uc911 {0}\uac1c\uc758 {1,choice,0#\ud30c\uc77c \uc0ad\uc81c\ub428|1#\ud30c\uc77c \uc0ad\uc81c\ub428|1\u003c\ud30c\uc77c \uc0ad\uc81c\ub428}",a,c),body:k.partialFailedFlagBody(),type:"error",extraClasses:"attachment-deleted-partial-error-flag"}));b("#attachment-remove-fail-notification-body-refresh-button").click(function(){q()});setTimeout(function(){e.close()},8E3)}function C(a,c){return b(a).parents("["+c+"]").attr(c)}function Q(){return b("tr[id^\x3dattachment-]").toArray().map(function(a){return{fileName:a.attributes["data-attachment-filename"].value,
id:a.id,isDeletable:0<b(a).find(".removeAttachmentLink").length,isSelected:b(a).find("[id^\x3dselected-attachment]")[0].checked}})}function R(){return b("tr[id^\x3dattachment-]").toArray().map(function(a){return{attachmentId:b(a)[0].id.replace("attachment-",""),isSelected:b(a).find("[id^\x3dselected-attachment]")[0].checked}}).filter(function(a){return a.isSelected}).map(function(a){return a.attachmentId})}function t(){return b("[id^\x3dselected-attachment]").filter(function(a,c){return c.checked}).length}
function S(a,c,e,d){N.ajax({type:"POST",url:a,data:c||{},success:e,error:d})}function T(a){return a.reduce(function(c,e){return c.then(function(d){return e().then(Array.prototype.concat.bind(d))})},Promise.resolve([]))}function U(a,c){var e=null,d=0,l=a.filter(function(h){return void 0!==h&&null!==h}).map(function(h){return h.replace("attachment-","")}).filter(function(h){return!Number.isNaN(h)}).map(function(h){return function(){return fetch(v.CONTEXT_PATH+"/rest/api/content/"+h,{method:"DELETE"}).then(function(f){204===
f.status?d++:e=400===f.status?"\uc798\ubabb\ub41c \uc694\uccad":404===f.status?"\ucca8\ubd80 \ud30c\uc77c\uc744 \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4":409===f.status?"\ud3b8\uc9d1\uae30\uac00 \uc0ac\uc6a9 \uc911\uc77c \uc218 \uc788\uc73c\uba70 \ucca8\ubd80 \ud30c\uc77c\uc744 \uc0ac\uc6a9 \uc911\uc785\ub2c8\ub2e4":"\ucca8\ubd80 \ud30c\uc77c\uc744 \uc0ad\uc81c\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4"})}});w.trigger("analyticsEvent",{name:"confluence.attachments.delete.selected",data:{count:a.length}});c.disable();Promise.resolve(T(l)).catch(function(){return e="could not send delete attachment request"}).finally(function(){c.enable();
d===a.length?z(d):0===d?n(a.length):A(d,a.length);c.remove()})}function D(a){return g.ConfluenceDialog({width:600,height:200,id:a})}function E(a,c){var e=200;1<c&&16>c?e=200+28*(c-1):16<=c&&(e=620);return g.ConfluenceDialog({width:600,height:e,id:a})}function K(a,c,e){if(m.isEnabled("confluence.attachments.bulk.delete")){var d=E("attachment-removal-confirm-dialog",2);var l="\uc0ad\uc81c"}else d=D("attachment-removal-confirm-dialog"),l="\ud655\uc778";d.addHeader(c);d.addPanel("",
e);d.addSubmit(l,function(){var h;S(a,null,function(){q()},function(f){var F=[];F.push(P.parseError(f));f.responseText&&(f=f.responseText?JSON.parse(f.responseText):null,f.actionErrors&&(F=f.actionErrors));h=m.isEnabled("confluence.attachments.bulk.delete")?E("attachment-removal-error-dialog",2):D("attachment-removal-error-dialog");h.addHeader(k.removalErrorTitle());h.addPanel("",k.removalErrorBody({messages:F}));h.addButton("\ub2eb\uae30",function(){q()});h.show();h.updateHeight();
d.remove()})});d.addCancel("\ucde8\uc18c",function(){d.remove()});d.show()}function L(a,c,e,d){var l=m.isEnabled("confluence.attachments.bulk.delete")?E("attachment-removal-confirm-dialog",d):D("attachment-removal-confirm-dialog");l.addHeader(c);l.addPanel("",e);0<a.length&&l.addSubmit("\uc0ad\uc81c",function(){U(a,l)});l.addCancel("\ucde8\uc18c",function(){l.remove()});l.show()}function u(){0<t()?document.getElementById("menu-attachment-bulk-action-left-children").style.display=
"flex":document.getElementById("menu-attachment-bulk-action-left-children").style.display="none";var a=t();a=g.format("{0,choice,1#{0}\uac1c \uc120\ud0dd\ub428|1\u003c{0}\uac1c \uc120\ud0dd\ub428}",a);b("#bulk-action-selected-count").text(a);a=t();var c=a===b("[id^\x3dselected-attachment]").length,e=b("#select-all-attachments-checkbox"),d=e[0];0===a?(d.checked=!1,d.ariaChecked=!1,e.prop("indeterminate",!1)):c?(d.checked=!0,d.ariaChecked=!0,e.prop("indeterminate",!1)):(d.checked=!1,d.ariaChecked="mixed",e.prop("indeterminate",!0))}b("#upload-attachments").on("submit",
I);var M=b("#more-attachments-link");M.click(function(a){b(".more-attachments").removeClass("hidden");M.addClass("hidden");a.stopPropagation();return!1});r.showOlderVersions(b);var k=p.Attachments;r.showRemoveAttachmentConfirmDialog=function(a){var c=v.CONTEXT_PATH+"/json/removeattachment.action"+a.search;if(m.isEnabled("confluence.attachments.bulk.delete")){var e=k.removalConfirmationTitleV2();a=k.removalConfirmationBodyV2()}else e=k.removalConfirmationTitle(),a=k.removalConfirmationBody({filename:C(a,
"data-attachment-filename")});K(c,e,a)};b(".removeAttachmentLink").click(function(){r.showRemoveAttachmentConfirmDialog(this);return!1});b(".removeAttachmentLinkVersion").click(function(){K(v.CONTEXT_PATH+"/json/removeattachmentversion.action"+this.search,k.versionRemovalConfirmationTitle(),k.versionRemovalConfirmationBody({filename:C(this,"data-attachment-filename"),version:C(this,"data-attachment-version")}));return!1});b("#download-all-attachments").click(function(){var a=G.get("page-id");window.location.href=
H()+"/pages/downloadallattachments.action?pageId\x3d"+a;w.trigger("analyticsEvent",{name:"confluence.attachments.download.all",data:{pageID:a}});return!1});b("#download-selected-attachments").click(function(){var a=G.get("page-id"),c=R();window.location.href=H()+"/pages/downloadallattachments.action?pageId\x3d"+a+"\x26attachmentIds\x3d"+c.join(",");w.trigger("analyticsEvent",{name:"confluence.attachments.download.selected",data:{count:c.length}});return!1});b("#delete-all-attachments").click(function(){L("all",
k.removalAllConfirmationTitle(),k.allAttachmentsRemovalConfirmationBody(),2);return!1});b("#delete-selected-attachments").click(function(){var a=Q(),c=a.filter(function(f){return f.isSelected}),e=a.filter(function(f){return f.isSelected&&f.isDeletable});a=a.filter(function(f){return f.isSelected&&!f.isDeletable});var d=e.map(function(f){return f.id}),l=a.map(function(f){return f.fileName});var h=2+(0<a.length?2:0);h+=a.length;0<c.length&&L(d,k.removalSelectedConfirmationTitle({fileCount:e.length}),
k.selectedAttachmentsRemovalConfirmationBody({undeletable:l}),h);return!1});b("#select-all-attachments-checkbox").click(function(){0===t()?b("[id^\x3dselected-attachment]").toArray().forEach(function(a){a.checked=!0;a.ariaChecked=!0}):b("[id^\x3dselected-attachment]").toArray().forEach(function(a){a.checked=!1;a.ariaChecked=!1});u()});m.isEnabled("confluence.attachments.bulk.delete")&&(b("tr[id^\x3dattachment-]").change(u),b("[id^\x3dselect-all-attachments-checkbox]").change(u),u())},submitHandler:I}});
require("confluence/module-exporter").safeRequire("confluence/attachments",function(g){var p=require("ajs");p.Attachments=g.component;p.toInit(g.initialiser)});
}catch(e){WRMCB(e)};
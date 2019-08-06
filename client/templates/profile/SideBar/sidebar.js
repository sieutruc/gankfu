/* TODO:
    problem when update the avatar to mongodb, file is uploaded but not stored in db
*/

var FILEUPLOAD = {
    IMG : {  TYPE: ["image/jpeg", "image/png"], MAXSIZE: 1024000  },// 1 mb
    DOC : []
};

Template.avatarModel.created = function() {
    this.saveState = new ReactiveVar("disabled");
    this.uploader  = new ReactiveVar();
    this.avatarUser  = new ReactiveVar();
    this.url = "";
}

Template.avatarModel.rendered = function() {
    //$("#avatar-modal").modal("show");
    modalAvatar = this;
    CropAvatar(modalAvatar);
    initTooltip(modalAvatar);

}

Template.profilePicture.helpers({
    avatarUser: function() {
        if(!Meteor.user().profile.avatar){
            //SETS THE DEFAULT AVATAR
            return "/img/gfavatarSimple.png";
        }
        else{
            return Meteor.user().profile.avatar;
        }

    }
});

Template.avatarModel.helpers({
    saveState: function() {
        return Template.instance().saveState.get();
    }
});

Template.avatarModel.events({
    'change .avatar-input': function(evt,tmpl) {
        evt.preventDefault();
        tmpl.uploader.set(); // reset progress to nil
        //tmpl.saveState.set('disabled');
        
        var file, input = tmpl.find('input[name=avatar_file]');
        if (input.files.length > 0) {
            file = input.files[0];
            if (isImageFile(file,tmpl)) {
                if (tmpl.url) {
                    URL.revokeObjectURL(tmpl.url); // Revoke the old one
                }
                tmpl.url = URL.createObjectURL(file);
                startCropper(tmpl);
            }
        }
    },
    'click .avatar-view': function(evt) {
        evt.preventDefault();
        //$('#avatar-modal').modal('show');
    },
    'click .avatar-btns': function(evt,tmpl) {
        rotate(evt, tmpl);
        //$('#avatar-modal').modal('hide');
    },
    'click .avatar-reset': function(evt,tmpl) {
        tmpl.$img.cropper('reset');
    },
    'shown.bs.modal #avatar-modal': function(e,tmpl){
        initPreview(tmpl);
        if(tmpl.$avatarUpload.siblings('.alert').length > 0)
            tmpl.$avatarUpload.siblings('.alert').remove();
    },
    'click .avatar-save': function(evt,tmpl) {
        evt.preventDefault();
        tmpl.uploader.set(); // reset progress to nil
        tmpl.saveState.set('disabled');
        
        // TODO: add your Slingshot setup
        var upload = new Slingshot.Upload("myFileUploads")
        var canvas = tmpl.$img.cropper('getCroppedCanvas');
        var data = canvas.toDataURL();
        
        var match = /^data:([^;]+);base64,(.+)$/.exec(data);
        var type = match[1];
        var b64 = match[2];
        var blob = b64ToBlob(b64, type)
        
        // TODO: generate your filename
        blob.name = 'avartar-' + Date.now();
        
        upload.send(blob, function (error, downloadUrl) {
            if (error) {
                // TODO: whatever you need on upload failure
                // Log service detailed response.
                alert(error,tmpl);
            }
            else {
                Meteor.call('updateAvatar',downloadUrl,function(err){
                    if(err) {
                        alert(err.message,tmpl);
                        return
                    } else {
                        success('Your avatar is changed successfully !',tmpl);
                        // TODO: whatever you need on upload success
                        console.log('Success uploading: ', downloadUrl);
                        Session.set('avatarUser', downloadUrl);
                    }
                });
            }
            tmpl.saveState.set('disabled');
        });
        tmpl.uploader.set(upload);
    }
});

var CropAvatar = function(modal) {
    modal.$avatarView = $('.avatar-view');
    modal.$avatar = modal.$avatarView.find('img');
    modal.$avatarModal = $('#avatar-modal');
    modal.$loading = $('.loading');

    modal.$avatarUpload = modal.$avatarModal.find('.avatar-upload');
    modal.$avatarSrc = modal.$avatarModal.find('.avatar-src');
    modal.$avatarData = modal.$avatarModal.find('.avatar-data');
    modal.$avatarInput = modal.$avatarModal.find('.avatar-input');
    modal.$avatarSave = modal.$avatarModal.find('.avatar-save');
    modal.$avatarReset = modal.$avatarModal.find('.avatar-save');
    modal.$avatarBtns = modal.$avatarModal.find('.avatar-btns');

    modal.$avatarWrapper = modal.$avatarModal.find('.avatar-wrapper');
    modal.$avatarPreview = modal.$avatarModal.find('.avatar-preview');
    modal.$avatarIndicate = modal.$avatarModal.find('.avatar-indicate');
}

// test if the uploaded file is a valid file, need to be checked on server
var isImageFile = function(file, tmpl) {
    // check file
    if(!_.contains(FILEUPLOAD.IMG.TYPE, file.type)){
        alert("File format not supported. Please upload .jpg or .png",tmpl);
        return false;
    }
    // check size
    if(file.size > FILEUPLOAD.IMG.MAXSIZE){
        alert("File is too large. 1mb size limit",tmpl);
        return false;
    }
    return true;
}

var startCropper = function (tmpl) {
    tmpl.saveState.set('');

      if (tmpl.active) {
        tmpl.$img.cropper('replace', tmpl.url);
      } else {
        tmpl.$img = $('<img src="' + tmpl.url + '">');
        tmpl.$avatarIndicate.empty().html('<p>Avatar preview</p>');
        tmpl.$avatarWrapper.empty().html(tmpl.$img);
        tmpl.$img.cropper({
          aspectRatio: 1,
          preview: tmpl.$avatarPreview.selector,
          strict: true,  
          center: true,  // show cursor in the middle
          guides: false, // no grid lines
          background: false, // no grid background of the container
          crop: function (e) {
            var json = [
                  '{"x":' + e.x,
                  '"y":' + e.y,
                  '"height":' + e.height,
                  '"width":' + e.width,
                  '"rotate":' + e.rotate + '}'
                ].join();

            tmpl.$avatarData.val(json);
          }
        });
        tmpl.active = true;
      }

      tmpl.$avatarModal.one('hidden.bs.modal', function () {
        tmpl.$img.attr('src', '');
        stopCropper(tmpl);
      });
}

var stopCropper = function (tmpl) {
  if (tmpl.active) {
    tmpl.saveState.set('disabled');
    tmpl.$avatarInput.val('');
    tmpl.$img.cropper('destroy');
    tmpl.$img.remove();
    tmpl.$avatarIndicate.empty().html('<p>Current avatar</p>');
    tmpl.active = false;
  }
}

var rotate = function (e,tmpl) {
  var data;

  if (tmpl.active) {
    data = $(e.target).data();

    if (data.method) {
      tmpl.$img.cropper(data.method, data.option);
    }
  }
}

var initTooltip = function (tmpl) {
  tmpl.$avatarView.tooltip({
    placement: 'bottom'
  });
}

var initPreview = function (tmpl) {
  var url = tmpl.$avatar.attr('src');

  tmpl.$avatarPreview.html('<img src="' + url + '">');
}

var alert = function (msg,tmpl) {
    var $alert = [
        '<div class="alert alert-danger avatar-alert alert-dismissable">',
          '<button type="button" class="close" data-dismiss="alert">&times;</button>',
          msg,
        '</div>'
      ].join('');
    if(tmpl.$avatarUpload.siblings('.alert').length > 0)
        tmpl.$avatarUpload.siblings('.alert').remove();
    tmpl.$avatarUpload.after($alert);
}

var success = function (msg,tmpl) {
    var $alert = [
        '<div class="alert alert-success avatar-alert alert-dismissable">',
          '<button type="button" class="close" data-dismiss="alert">&times;</button>',
          msg,
        '</div>'
      ].join('');
    if(tmpl.$avatarUpload.siblings('.alert').length > 0)
        tmpl.$avatarUpload.siblings('.alert').remove();
    tmpl.$avatarUpload.after($alert);
}

var b64ToBlob = function(b64Data, contentType, sliceSize) {
    var byteArray, byteArrays, byteCharacters, byteNumbers, i, offset, slice
    sliceSize = sliceSize || 512
    byteCharacters = atob(b64Data)
    byteArrays = []
    offset = 0
    while (offset < byteCharacters.length) {
        slice = byteCharacters.slice(offset, offset + sliceSize)
        byteNumbers = (function() {
            var j, ref, results
            results = []
            for (i = j = 0, ref = slice.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                results.push(slice.charCodeAt(i))
            }
            return results
        })()
        byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
        offset += sliceSize
    }
    return new Blob(byteArrays, { type: contentType })
}

Template.profileChat.helpers({
    firstName:function (){
        if (typeof(Meteor.user().profile.firstname) !== 'undefined') {
            return Meteor.user().profile.firstname;
        }
    },
    lastName:function (){
        if (typeof(Meteor.user().profile.lastname) !== 'undefined') {
            return Meteor.user().profile.lastname;
        }
    }
});

Template.mainUserProfile.onCreated( function() {
    // define the default template for the profile content
    Template.instance().data.profileContent =new ReactiveVar("userProfileGamesList");
});

Template.mainUserProfile.helpers({
    firstName:function (){
        if (typeof(Meteor.user().profile.firstname) !== 'undefined') {
            return Meteor.user().profile.firstname;
        }
    },
    lastName:function (){
        if (typeof(Meteor.user().profile.lastname) !== 'undefined') {
            return Meteor.user().profile.lastname;
        }
    },
    avatarUser: function() {
        return Meteor.user().profile.avatar;
    },
    getProfileContent: function() {
        return Template.instance().data.profileContent.get();
    }
});

Template.mainUserProfile.events({
    "click #GamesList": function (e, t) {
        e.preventDefault();
        setActive(e,0);
        Template.instance().data.profileContent.set("userProfileGamesList");
    },
    "click #AccountSettings": function (e, t) {
        e.preventDefault();
        setActive(e,1);
        Template.instance().data.profileContent.set("accountSettings");
    }
});

var setActive = function(e, num) {
    var lisNode = e.target.parentNode.parentNode.children;
    for( var i =0; i < lisNode.length; i++ ) {
        if (i == num)
            lisNode[i].setAttribute("class", "active");
        else
            lisNode[i].setAttribute("class", "");
    }
}
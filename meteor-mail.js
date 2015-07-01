Mails = new Mongo.Collection("mails");


var selectedFolder = '';
var selectedMail = '';
var mailText = '';
var folderList = [];

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        folders: function () {
            var data = Mails.find().fetch();
            var distinctData = _.uniq(data, false, function (d) {
                return d.folder
            });
            return _.pluck(distinctData, "folder");
        },
        mails: function () {
            var help = Session.get('selectedFolder');
            console.log("mails::" + selectedFolder);
            var blub = Mails.find({folder: selectedFolder}).fetch();
            console.log(blub);
            return blub;
        },
        mail: function () {
            console.log('client::helper.mail');
            return Session.get('mail');
        }

    });

    Template.body.events({
        "submit .new-task": function (event) {
            // This function is called when the new task form is submitted
            var newName = event.target.text.value;
            Meteor.call('renameFolder', selectedFolder, newName);
            // Clear form
            event.target.text.value = "";
            // Prevent default form submit
            return false;
        },

        "submit .renameMail": function (event) {
            console.log('rename submitevent feuert');
            var newFolder = event.target.text.value;

            Meteor.call('moveToFolder', selectedMail, newFolder);
            event.target.text.value = "";

            return false;
        }
    });

    Template.folder.events({

        "click .delete": function (e) {
            console.log(".delete");
            console.log(e.target.value);
            Meteor.call('removeFolder', e.target.value)
        },
        "click .folderBar": function (e) {
            selectedFolder = event.target.innerHTML;
            console.log(selectedFolder);
            Session.set('selectedFolder', selectedFolder);
            Meteor.call('getMailsByFolder', selectedFolder, function (err, data) {
                mailsByFolder = data;
                console.log(mailsByFolder);
            });
        }
    });

    Template.mailHeads.events({
        "click .deleteMail": function (e) {
            console.log(".deleteMail::" + this._id);
            console.log(e.target.value);
            Mails.remove({_id: this._id});
        },

        "click .folderBar" : function (e) {
            selectedMail = this;
            console.log(this.text);
            mailText = this.text;
            Session.set('mail', this);
        }

    })

    Template.newMail.events({
        'submit form': function (e) {
            console.log("form newMail");
            console.log(e.type);
        },

        'change form': function (e) {
            console.log(e);
        }
    });


}

if (Meteor.isServer) {

    Meteor.startup(function () {
        return Meteor.methods({
            removeFolder: function (f) {
                console.log("server::removeFolder:: " + f);
                return Mails.remove({folder: f});
            },

            renameFolder: function (oldName, newName) {
                console.log("server::renameFolder:: " + oldName + " " + newName);
                return Mails.update({folder: oldName}, {$set: {folder: newName}}, {multi: true});
            },

            moveToFolder: function (id, newFolder) {
                console.log("server::moveToFolder:: "+ id +" "+ newFolder);
                return Mails.update({_id: id._id}, {$set: {folder: newFolder}});
            },
            /*           getMailsByFolder: function(f) {
             console.log("server::getMailsByFolder:: "+f);
             blub = Mails.find({folder: f});
             },

             removeMail : function(obj) {
             console.log("server::removeMail::"+obj._id);
             blub = Mails.remove({_id: obj._id});
             console.log(blub);
             },
             */
            getFolders: function () {
                console.log("server::getFolders");
                blub = Mails.distinct('folder');
                console.log(blub);
                return blub;
            }
        });
    });
}
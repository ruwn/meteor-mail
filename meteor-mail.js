Mails = new Mongo.Collection("mails");

var selectedFolder = '';

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        folders: function () {
            var data = Mails.find().fetch();
            var distinctData = _.uniq(data, false, function(d) {return d.folder});
            return _.pluck(distinctData, "folder");
        }
    });

    Template.body.events({
        "submit .new-task": function (event) {
            // This function is called when the new task form is submitted
            var newName = event.target.text.value;
            Meteor.call('renameFolder',selectedFolder,newName);

            // Clear form
            event.target.text.value = "";

            // Prevent default form submit
            return false;
        }
    });

    Template.folder.events({
        "click .toggle-checked": function () {
            // Set the checked property to the opposite of its current value
            Tasks.update(this._id, {$set: {checked: !this.checked}});
        },
        "click .delete": function (e) {
            console.log(".delete");
            console.log(e.target.value);
            Meteor.call('removeFolder', e.target.value)
        },
        "click .folderBar": function (e) {
            selectedFolder = event.target.innerHTML;
            console.log(selectedFolder);
        }
    });
}

if (Meteor.isServer) {

    Meteor.startup( function () {
        return Meteor.methods( {
            removeFolder : function (f) {
                console.log("server::removeFolder:: "+f);
                return Mails.remove({folder: f});
            },

            renameFolder : function(oldName,newName) {
                console.log("server::renameFolder:: "+oldName +" "+ newName);
                return Mails.update({folder: oldName}, {$set: {folder: newName}}, {multi: true});
            }
        });
    });
}
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
            selectedFolder = event.target.text.value;
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
            }
        });
    });
}